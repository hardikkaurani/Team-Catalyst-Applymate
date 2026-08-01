const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const Journal = require('../models/journal.model');

const router = express.Router();

router.use(protect);

// GET /api/journal
router.get('/', async (req, res) => {
  try {
    const query = { userId: req.user.id };
    if (req.query.companyId) query.companyId = req.query.companyId;

    const entries = await Journal.find(query)
      .populate('companyId', 'name role')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/journal
router.post('/', async (req, res) => {
  try {
    const { companyId, roundType, interviewDate, questionsAsked, topics, difficulty, reflection } = req.body;
    const entry = await Journal.create({
      userId: req.user.id,
      companyId,
      roundType,
      interviewDate: interviewDate || new Date(),
      questionsAsked,
      topics: Array.isArray(topics) ? topics : [],
      difficulty: difficulty || 'Medium',
      reflection,
    });
    return res.status(201).json({ success: true, data: entry });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/journal/:id
router.get('/:id', async (req, res) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, userId: req.user.id }).populate('companyId', 'name role');
    if (!entry) return res.status(404).json({ success: false, message: 'Journal entry not found' });
    return res.status(200).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/journal/:id
router.patch('/:id', async (req, res) => {
  try {
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!entry) return res.status(404).json({ success: false, message: 'Journal entry not found' });
    return res.status(200).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/journal/:id
router.delete('/:id', async (req, res) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    return res.status(200).json({ success: true, message: 'Journal entry deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
