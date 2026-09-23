const mongoose = require('mongoose');

const PreviousWinnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  avatarUrl: { type: String, required: true }
}, { _id: false });

const RewardSchema = new mongoose.Schema({
  rank: { type: String, required: true },
  amount: { type: Number, required: true }
}, { _id: false });

const JudgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  experience: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  videoUrl: { type: String, default: '' }
}, { _id: false });

const DatesSchema = new mongoose.Schema({
  registrationEnd: { type: Date, required: true },
  submissionStart: { type: Date, required: true },
  submissionEnd: { type: Date, required: true },
  resultDate: { type: Date, required: true }
}, { _id: false });

const TabsContentSchema = new mongoose.Schema({
  about: { type: String, required: true },
  judgingParameters: { type: String, required: true },
  rulesAndEligibility: { type: String, required: true }
}, { _id: false });

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  prizePool: {
    type: Number,
    required: true,
    min: 0
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  bookedSlots: {
    type: Number,
    default: 0,
    min: 0
  },
  judge: {
    type: JudgeSchema,
    required: true
  },
  dates: {
    type: DatesSchema,
    required: true
  },
  previousWinners: {
    type: [PreviousWinnerSchema],
    default: []
  },
  rewards: {
    type: [RewardSchema],
    default: []
  },
  tabsContent: {
    type: TabsContentSchema,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining spots
CompetitionSchema.virtual('spotsLeft').get(function() {
  return Math.max(0, this.totalSlots - this.bookedSlots);
});

// Virtual to determine if registration is open
CompetitionSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return now < this.dates.registrationEnd && this.bookedSlots < this.totalSlots;
});

module.exports = mongoose.model('Competition', CompetitionSchema);
