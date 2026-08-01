const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const Company = require('../models/company.model');

const router = express.Router();
router.use(protect);

// GET /api/actions
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id }).lean();
    const actions = [];

    const upcomingOA = companies.filter((c) => c.status === 'Online Assessment');
    if (upcomingOA.length > 0) {
      actions.push({
        id: 'action-oa',
        type: 'warning',
        title: `${upcomingOA.length} Online Assessment(s) Active`,
        description: `Prepare for test rounds for ${upcomingOA.map((c) => c.name).join(', ')}.`,
        link: '/applications',
      });
    }

    const techInterviews = companies.filter((c) => c.status === 'Technical Interview');
    if (techInterviews.length > 0) {
      actions.push({
        id: 'action-tech',
        type: 'info',
        title: `${techInterviews.length} Technical Interview(s) Scheduled`,
        description: `Review DSA & System Design notes for ${techInterviews.map((c) => c.name).join(', ')}.`,
        link: '/resources',
      });
    }

    if (actions.length === 0) {
      actions.push({
        id: 'action-default',
        type: 'success',
        title: 'Track Your Next Application',
        description: 'Keep your placement momentum high by adding new applications or practice resources.',
        link: '/applications',
      });
    }

    return res.status(200).json({ success: true, count: actions.length, data: actions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
