const express = require('express');
const companyController = require('../controllers/company.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all company endpoints
router.use(protect);

// @route   GET /api/companies/stats
// @desc    Get KPI counts for logged-in user applications
// @access  Private
router.get('/stats', (req, res, next) => companyController.getStats(req, res, next));

// @route   GET /api/companies/export/csv
// @desc    Export company applications as CSV
// @access  Private
router.get('/export/csv', (req, res, next) => companyController.exportCsv(req, res, next));

// @route   GET /api/companies
// @desc    Get all companies for logged-in user with search & status filter
// @access  Private
router.get('/', (req, res, next) => companyController.getAllCompanies(req, res, next));

// @route   GET /api/companies/:id
// @desc    Get single company application details
// @access  Private
router.get('/:id', (req, res, next) => companyController.getCompanyById(req, res, next));

// @route   POST /api/companies
// @desc    Create a new company application
// @access  Private
router.post('/', (req, res, next) => companyController.createCompany(req, res, next));

// @route   PUT /api/companies/:id
// @desc    Update an existing company application
// @access  Private
router.put('/:id', (req, res, next) => companyController.updateCompany(req, res, next));

// @route   PATCH /api/companies/:id
// @desc    Update an existing company application
// @access  Private
router.patch('/:id', (req, res, next) => companyController.updateCompany(req, res, next));

// @route   PATCH /api/companies/:id/status
// @desc    Update company status stage specifically
// @access  Private
router.patch('/:id/status', (req, res, next) => companyController.updateStatus(req, res, next));

// @route   DELETE /api/companies/:id
// @desc    Delete a company application
// @access  Private
router.delete('/:id', (req, res, next) => companyController.deleteCompany(req, res, next));

module.exports = router;
