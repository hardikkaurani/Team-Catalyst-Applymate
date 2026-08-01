const express = require('express');
const resourceController = require('../controllers/resource.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to protect all resource routes
router.use(protect);

// @route   POST /api/resources
// @desc    Create a new preparation resource
// @access  Private
router.post('/', (req, res) => resourceController.create(req, res));

// @route   GET /api/resources
// @desc    Get all preparation resources (supports ?category=... & ?companyId=...)
// @access  Private
router.get('/', (req, res) => resourceController.getAll(req, res));

// @route   GET /api/resources/company/:companyId
// @desc    Get resources specific to a company ID
// @access  Private
router.get('/company/:companyId', (req, res) => resourceController.getByCompany(req, res));

// @route   GET /api/resources/:id
// @desc    Get single resource by ID
// @access  Private
router.get('/:id', (req, res) => resourceController.getById(req, res));

// @route   PUT /api/resources/:id
// @desc    Update a resource by ID
// @access  Private
router.put('/:id', (req, res) => resourceController.update(req, res));

// @route   PATCH /api/resources/:id
// @desc    Update a resource by ID (partial update)
// @access  Private
router.patch('/:id', (req, res) => resourceController.update(req, res));

// @route   DELETE /api/resources/:id
// @desc    Delete a resource by ID
// @access  Private
router.delete('/:id', (req, res) => resourceController.delete(req, res));

module.exports = router;
