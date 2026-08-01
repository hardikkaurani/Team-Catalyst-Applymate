const mongoose = require('mongoose');

const VALID_STATUSES = [
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected',
];

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
      trim: true,
    },
    jd: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    resumeFile: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user query performance (Filtering by user, status, applicationDate)
companySchema.index({ userId: 1, status: 1, applicationDate: -1 });
// Compound text index for fast search queries on company name and role
companySchema.index({ userId: 1, name: 'text', role: 'text' });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
module.exports.VALID_STATUSES = VALID_STATUSES;
