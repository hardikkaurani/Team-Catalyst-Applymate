const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const Company = require('../models/company.model');

const router = express.Router();
router.use(protect);

// GET /api/timeline
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id }).lean();
    const activities = [];

    companies.forEach((c) => {
      if (c.statusHistory && c.statusHistory.length > 0) {
        c.statusHistory.forEach((sh) => {
          activities.push({
            id: `${c._id}-${sh.changedAt || sh._id}`,
            companyName: c.name,
            role: c.role,
            status: sh.status,
            date: sh.changedAt || c.updatedAt || c.createdAt,
            type: 'status_change',
          });
        });
      } else {
        activities.push({
          id: `${c._id}-created`,
          companyName: c.name,
          role: c.role,
          status: c.status,
          date: c.applicationDate || c.createdAt,
          type: 'application_submitted',
        });
      }
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
