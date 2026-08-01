const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Resource category is required'],
      enum: {
        values: ['DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'],
        message: '{VALUE} is not a valid category',
      },
    },
    link: {
      type: String,
      required: [true, 'Resource link is required'],
      trim: true,
    },
    linkedCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      index: true,
    },
    completionStatus: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for companyId alias compatibility
resourceSchema.virtual('companyId').get(function () {
  return this.linkedCompanyId;
}).set(function (v) {
  this.linkedCompanyId = v;
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
