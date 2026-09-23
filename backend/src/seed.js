require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/db');
const Competition = require('./models/Competition');
const Registration = require('./models/Registration');
const mongoose = require('mongoose');

async function seedData(autoDisconnect = true) {
  console.log('[Seed] Starting database wipe and seed...');
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  try {
    // 1. Wipe collections
    await Competition.deleteMany({});
    await Registration.deleteMany({});
    console.log('[Seed] Wiped existing competitions and registrations.');

    // Dynamic live countdown matching Page 3 reference: 01d : 06h : 28m : 32s
    const now = new Date();
    const registrationEnd = new Date(now.getTime() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000);
    const submissionStart = new Date(now.getTime() + 12 * 3600 * 1000);
    const submissionEnd = new Date(now.getTime() + (7 * 86400) * 1000);
    const resultDate = new Date(now.getTime() + (10 * 86400) * 1000);

    // 2. Create Competition document matching Page 3 exact design reference
    const feedantsDance = await Competition.create({
      title: 'Feedants Classical Dance',
      tags: ['Dance', 'Multi-Win', 'Winners get certificate'],
      prizePool: 1500,
      entryFee: 99,
      totalSlots: 20,
      bookedSlots: 1, // 1/20 Booked -> Only 19 spots left
      judge: {
        name: 'Manju Dubey',
        title: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      dates: {
        registrationEnd,
        submissionStart,
        submissionEnd,
        resultDate
      },
      previousWinners: [
        {
          name: 'Riya Shah',
          rank: '1st',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Aarav Mehta',
          rank: '2nd',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Neha Verma',
          rank: '3rd',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Rohit C',
          rank: '4th',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80'
        }
      ],
      rewards: [
        { rank: '1st Winner', amount: 500 },
        { rank: '2nd Winner', amount: 300 },
        { rank: '3rd Winner', amount: 240 },
        { rank: '4th Winner', amount: 200 },
        { rank: '5th Winner', amount: 130 },
        { rank: '6th Winner', amount: 80 }
      ],
      tabsContent: {
        about: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.\n\nParticipants get personalized audio-visual feedback from Sangeet Natak Akademi honored judges, national digital distribution, and official certified digital credentials backed by Feedants Art Foundation.',
        judgingParameters: 'Judged on 4 standardized classical dimensions:\n\n• Rhythm & Timing (Taal & Laya): 30%\nPrecision in footwork (Tatkar) and synchronicity with bols.\n\n• Expressions & Storytelling (Abhinaya & Bhav): 30%\nDepth of Rasas, facial expressions, and clarity of the narrative.\n\n• Mudras & Posture (Angashuddhi): 20%\nCorrectness of classical hand gestures (Hastas) and body posture.\n\n• Stage Presence & Costume: 20%\nAuthenticity of traditional costume, ghungroos, and graceful execution.',
        rulesAndEligibility: 'Competition Guidelines:\n\n1. Eligibility: Open to all Indian Classical dancers of all age groups.\n2. Video Duration: 2 to 5 minutes unbroken performance video.\n3. Format: MP4, MOV, or YouTube unlisted link in 720p or higher.\n4. Audio: Clean background soundtrack or live accompaniment.\n5. Originality: Solo performances only. No filters or artificial speed-ups.'
      }
    });

    // Seed 1st initial registration
    await Registration.create({
      competitionId: feedantsDance._id,
      userId: 'user_pioneer_dancer',
      status: 'registered',
      registeredAt: new Date(now.getTime() - 3600 * 1000)
    });

    console.log('[Seed] Seeded competition:', feedantsDance.title);
    console.log('[Seed] ID:', feedantsDance._id.toString());
    console.log('[Seed] Total Slots:', feedantsDance.totalSlots, '| Booked:', feedantsDance.bookedSlots, '| Spots Left: 19');
    console.log('[Seed] Successfully finished seeding matching PDF specification.');

    return feedantsDance;
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  } finally {
    if (autoDisconnect) {
      await disconnectDB();
    }
  }
}

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedData;
