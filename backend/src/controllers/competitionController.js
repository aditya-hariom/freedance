const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

/**
 * GET /api/competitions
 * Fetch all competitions with computed fields and optional user registration state
 */
async function getCompetitions(req, res) {
  try {
    const { userId } = req.query;
    const competitions = await Competition.find().sort({ createdAt: -1 });

    const result = await Promise.all(competitions.map(async (comp) => {
      const compObj = comp.toObject({ virtuals: true });
      let isRegistered = false;
      let userRegistration = null;

      if (userId) {
        userRegistration = await Registration.findOne({
          competitionId: comp._id,
          userId: String(userId)
        });
        isRegistered = !!userRegistration;
      }

      return {
        ...compObj,
        spotsLeft: Math.max(0, comp.totalSlots - comp.bookedSlots),
        isRegistrationOpen: new Date() < comp.dates.registrationEnd && comp.bookedSlots < comp.totalSlots,
        isRegistered,
        userRegistration
      };
    }));

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('[getCompetitions] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * GET /api/competitions/:id
 * Fetch single competition details with computed spotsLeft, isRegistrationOpen, and isRegistered
 */
async function getCompetitionById(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    const compObj = competition.toObject({ virtuals: true });
    let isRegistered = false;
    let userRegistration = null;

    if (userId) {
      userRegistration = await Registration.findOne({
        competitionId: id,
        userId: String(userId)
      });
      isRegistered = !!userRegistration;
    }

    const spotsLeft = Math.max(0, competition.totalSlots - competition.bookedSlots);
    const isRegistrationOpen = new Date() < competition.dates.registrationEnd && competition.bookedSlots < competition.totalSlots;

    return res.json({
      success: true,
      data: {
        ...compObj,
        spotsLeft,
        isRegistrationOpen,
        isRegistered,
        userRegistration
      }
    });
  } catch (error) {
    console.error('[getCompetitionById] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * POST /api/competitions/:id/register
 * Prevent race conditions and overbooking using atomic MongoDB operation.
 * Guarantees idempotency and safe rollback if registration record fails.
 */
async function registerForCompetition(req, res) {
  const competitionId = req.params.id;
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return res.status(400).json({
      success: false,
      message: 'A valid userId is required to register.'
    });
  }

  const cleanUserId = userId.trim();

  try {
    // 1. Idempotency Check: Verify user is not already registered
    const existingRegistration = await Registration.findOne({
      competitionId,
      userId: cleanUserId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this competition.',
        isRegistered: true,
        registration: existingRegistration
      });
    }

    // 2. Fetch competition metadata to get totalSlots
    const targetComp = await Competition.findById(competitionId);
    if (!targetComp) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found.'
      });
    }

    const totalSlots = targetComp.totalSlots;

    // 3. ATOMIC CONCURRENCY OPERATION
    // Only increment bookedSlots if:
    //  - bookedSlots < totalSlots
    //  - dates.registrationEnd > current time
    // This is executed as an isolated atomic query in MongoDB engine
    const competition = await Competition.findOneAndUpdate(
      {
        _id: competitionId,
        bookedSlots: { $lt: totalSlots },
        $expr: { $lt: ['$bookedSlots', '$totalSlots'] },
        'dates.registrationEnd': { $gt: new Date() }
      },
      { $inc: { bookedSlots: 1 } },
      { new: true }
    );

    // If null is returned, either slots are fully booked or registration has passed
    if (!competition) {
      return res.status(409).json({
        success: false,
        message: 'Registration closed or slots full.'
      });
    }

    // 4. Create Registration Record
    try {
      const registration = await Registration.create({
        competitionId,
        userId: cleanUserId,
        status: 'registered',
        registeredAt: new Date()
      });

      const updatedCompObj = competition.toObject({ virtuals: true });
      const spotsLeft = Math.max(0, competition.totalSlots - competition.bookedSlots);
      const isRegistrationOpen = new Date() < competition.dates.registrationEnd && competition.bookedSlots < competition.totalSlots;

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        competition: {
          ...updatedCompObj,
          spotsLeft,
          isRegistrationOpen,
          isRegistered: true
        },
        registration
      });
    } catch (createErr) {
      // 5. Rollback Compensation: If registration record fails (e.g. race condition double click),
      // decrement the bookedSlots counter so slot is never permanently leaked
      console.warn('[registerForCompetition] Registration record failed, rolling back slot:', createErr.message);
      await Competition.findByIdAndUpdate(competitionId, { $inc: { bookedSlots: -1 } });

      if (createErr.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'User is already registered for this competition.',
          isRegistered: true
        });
      }

      throw createErr;
    }
  } catch (error) {
    console.error('[registerForCompetition] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration.',
      error: error.message
    });
  }
}

/**
 * POST /api/competitions/:id/submit
 * Upload/submit entry for a registered user
 */
async function submitEntry(req, res) {
  const competitionId = req.params.id;
  const { userId, submissionUrl } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  try {
    const registration = await Registration.findOne({
      competitionId,
      userId: String(userId).trim()
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'You must register before submitting an entry.'
      });
    }

    registration.status = 'submitted';
    registration.submissionUrl = submissionUrl || 'https://storage.feedants.com/submissions/kathak_perf_01.mp4';
    registration.submittedAt = new Date();
    await registration.save();

    return res.json({
      success: true,
      message: 'Submission uploaded successfully!',
      registration
    });
  } catch (error) {
    console.error('[submitEntry] Error:', error);
    return res.status(500).json({ success: false, message: 'Submission failed', error: error.message });
  }
}

module.exports = {
  getCompetitions,
  getCompetitionById,
  registerForCompetition,
  submitEntry
};
