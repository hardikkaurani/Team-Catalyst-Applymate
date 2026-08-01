const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    roundType: {
      type: String,
      enum: ['OA', 'Technical', 'HR'],
      required: true,
    },
    interviewDate: {
      type: Date,
      default: Date.now,
    },
    questionsAsked: {
      type: String,
      default: '',
    },
    topics: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    reflection: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
