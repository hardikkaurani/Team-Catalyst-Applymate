const companyService = require('../services/company.service');

class CompanyController {
  /**
   * GET /api/companies
   * Get all company applications for logged in user (with optional search & status filter)
   */
  async getAllCompanies(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await companyService.getAllCompanies(userId, req.query);

      return res.status(200).json({
        success: true,
        count: result.count,
        data: result.companies,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching company applications',
      });
    }
  }

  /**
   * GET /api/companies/stats
   * Get KPI statistics for user applications
   */
  async getStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await companyService.getStats(userId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error calculating application statistics',
      });
    }
  }

  /**
   * GET /api/companies/:id
   * Get single company application details
   */
  async getCompanyById(req, res, next) {
    try {
      const userId = req.user.id;
      const companyId = req.params.id;

      const company = await companyService.getCompanyById(userId, companyId);

      return res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching company details',
      });
    }
  }

  /**
   * POST /api/companies
   * Create a new company application
   */
  async createCompany(req, res, next) {
    try {
      const userId = req.user.id;
      const company = await companyService.createCompany(userId, req.body);

      return res.status(201).json({
        success: true,
        data: company,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error creating company application',
      });
    }
  }

  /**
   * PUT /api/companies/:id
   * Update existing company application
   */
  async updateCompany(req, res, next) {
    try {
      const userId = req.user.id;
      const companyId = req.params.id;

      const updatedCompany = await companyService.updateCompany(userId, companyId, req.body);

      return res.status(200).json({
        success: true,
        data: updatedCompany,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating company application',
      });
    }
  }

  /**
   * DELETE /api/companies/:id
   * Delete company application
   */
  async deleteCompany(req, res, next) {
    try {
      const userId = req.user.id;
      const companyId = req.params.id;

      const result = await companyService.deleteCompany(userId, companyId);

      return res.status(200).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error deleting company application',
      });
    }
  }
}

module.exports = new CompanyController();
