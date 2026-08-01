const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

// @route   PATCH /api/profile
// @desc    Update user profile details
// @access  Private
router.patch('/', (req, res, next) => authController.updateProfile(req, res, next));

// @route   PATCH /api/profile/password
// @desc    Change user password
// @access  Private
router.patch('/password', (req, res, next) => authController.changePassword(req, res, next));

module.exports = router;
