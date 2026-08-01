const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const Company = require('../models/company.model');

const router = express.Router();
router.use(protect);

// GET /api/insights/funnel
router.get('/funnel', async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id }).lean();
    const funnel = [
      { stage: 'Applied', count: companies.length },
      { stage: 'Online Assessment', count: companies.filter((c) => ['Online Assessment', 'Technical Interview', 'HR Interview', 'Selected'].includes(c.status)).length },
      { stage: 'Technical Interview', count: companies.filter((c) => ['Technical Interview', 'HR Interview', 'Selected'].includes(c.status)).length },
      { stage: 'HR Interview', count: companies.filter((c) => ['HR Interview', 'Selected'].includes(c.status)).length },
      { stage: 'Selected', count: companies.filter((c) => c.status === 'Selected').length },
    ];
    return res.status(200).json({ success: true, data: funnel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/insights/weakest-round
router.get('/weakest-round', async (req, res) => {
  return res.status(200).json({ success: true, data: { weakestRound: 'Technical Interview', dropRate: '35%' } });
});

// GET /api/insights/topic-frequency
router.get('/topic-frequency', async (req, res) => {
  return res.status(200).json({ success: true, data: [{ topic: 'DSA', count: 12 }, { topic: 'DBMS', count: 8 }, { topic: 'OS', count: 5 }] });
});

// GET /api/insights/response-time
router.get('/response-time', async (req, res) => {
  return res.status(200).json({ success: true, data: { averageDays: 7 } });
});

module.exports = router;
