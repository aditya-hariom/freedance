const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: ['registered', 'submitted'],
    default: 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  submissionUrl: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure a user cannot register twice for the same competition
RegistrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
