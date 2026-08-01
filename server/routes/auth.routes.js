const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res, next) => authController.register(req, res, next));

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res, next) => authController.login(req, res, next));

module.exports = router;
