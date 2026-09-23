const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const { registerForCompetition } = require('../src/controllers/competitionController');

let mongod;

describe('Atomic Concurrency & Overbooking Prevention Tests', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  it('prevents overbooking when 50 concurrent requests compete for 3 remaining slots', async () => {
    // Setup a competition with 5 total slots and 2 already booked (3 remaining)
    const testComp = await Competition.create({
      title: 'Concurrency Stress Test Competition',
      tags: ['Dance', 'Test'],
      prizePool: 1000,
      entryFee: 50,
      totalSlots: 5,
      bookedSlots: 2,
      judge: {
        name: 'Test Judge',
        title: 'Lead Judge',
        experience: '10 Years',
        avatarUrl: 'https://example.com/avatar.jpg'
      },
      dates: {
        registrationEnd: new Date(Date.now() + 86400 * 1000), // open
        submissionStart: new Date(),
        submissionEnd: new Date(Date.now() + 2 * 86400 * 1000),
        resultDate: new Date(Date.now() + 3 * 86400 * 1000)
      },
      previousWinners: [],
      rewards: [{ rank: '1st', amount: 500 }],
      tabsContent: {
        about: 'Testing concurrency',
        judgingParameters: 'Testing',
        rulesAndEligibility: 'Testing'
      }
    });

    const competitionId = testComp._id.toString();

    // Helper to simulate an Express req/res cycle
    function simulateRegisterRequest(userId) {
      return new Promise((resolve) => {
        const req = {
          params: { id: competitionId },
          body: { userId }
        };
        const res = {
          statusCode: 200,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(data) {
            resolve({ status: this.statusCode, data });
          }
        };
        registerForCompetition(req, res);
      });
    }

    // Fire 50 concurrent registrations simultaneously
    const totalRequests = 50;
    const promises = [];
    for (let i = 1; i <= totalRequests; i++) {
      promises.push(simulateRegisterRequest(`concurrent_user_${i}`));
    }

    const results = await Promise.all(promises);

    const successfulRegistrations = results.filter(r => r.status === 201);
    const rejectedRegistrations = results.filter(r => r.status === 409);

    console.log(`[Concurrency Test] Total Requests: ${totalRequests}`);
    console.log(`[Concurrency Test] Successful (201): ${successfulRegistrations.length}`);
    console.log(`[Concurrency Test] Rejected (409 Slots Full): ${rejectedRegistrations.length}`);

    // EXACTLY 3 must succeed because only 3 spots were remaining
    assert.strictEqual(
      successfulRegistrations.length,
      3,
      'Exactly 3 registrations should succeed for 3 available slots'
    );

    // EXACTLY 47 must be rejected with 409
    assert.strictEqual(
      rejectedRegistrations.length,
      47,
      'Remaining 47 concurrent attempts should be rejected with 409 Conflict'
    );

    // Verify database state
    const finalComp = await Competition.findById(competitionId);
    assert.strictEqual(
      finalComp.bookedSlots,
      5,
      'Total booked slots must strictly equal total slots (5), zero overbooking'
    );

    // Verify registration records
    const registrationCount = await Registration.countDocuments({ competitionId });
    assert.strictEqual(
      registrationCount,
      3,
      'Exactly 3 registration records should be created'
    );
  });

  it('enforces idempotency and prevents duplicate registration for the same user', async () => {
    const testComp = await Competition.create({
      title: 'Idempotency Test Competition',
      tags: ['Dance'],
      prizePool: 500,
      entryFee: 10,
      totalSlots: 10,
      bookedSlots: 0,
      judge: {
        name: 'Judge',
        title: 'Title',
        experience: '5y',
        avatarUrl: 'https://example.com/j.jpg'
      },
      dates: {
        registrationEnd: new Date(Date.now() + 86400 * 1000),
        submissionStart: new Date(),
        submissionEnd: new Date(Date.now() + 2 * 86400 * 1000),
        resultDate: new Date(Date.now() + 3 * 86400 * 1000)
      },
      previousWinners: [],
      rewards: [{ rank: '1st', amount: 500 }],
      tabsContent: {
        about: 'Idempotency',
        judgingParameters: 'Testing',
        rulesAndEligibility: 'Testing'
      }
    });

    const competitionId = testComp._id.toString();

    function simulateRegisterRequest(userId) {
      return new Promise((resolve) => {
        const req = {
          params: { id: competitionId },
          body: { userId }
        };
        const res = {
          statusCode: 200,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(data) {
            resolve({ status: this.statusCode, data });
          }
        };
        registerForCompetition(req, res);
      });
    }

    // First attempt succeeds
    const firstRes = await simulateRegisterRequest('repeat_user');
    assert.strictEqual(firstRes.status, 201);

    // Second attempt fails with 400
    const secondRes = await simulateRegisterRequest('repeat_user');
    assert.strictEqual(secondRes.status, 400);
    assert.strictEqual(secondRes.data.isRegistered, true);

    // Booked slots must be only 1
    const compAfter = await Competition.findById(competitionId);
    assert.strictEqual(compAfter.bookedSlots, 1);
  });
});
