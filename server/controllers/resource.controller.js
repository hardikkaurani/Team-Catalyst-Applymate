const resourceService = require('../services/resource.service');

class ResourceController {
  /**
   * Create a new resource
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const result = await resourceService.createResource(userId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while creating resource',
      });
    }
  }

  /**
   * Get all resources with optional query filters
   */
  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const filters = req.query;
      const resources = await resourceService.getResources(userId, filters);
      return res.status(200).json({
        success: true,
        count: resources.length,
        data: resources,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while fetching resources',
      });
    }
  }

  /**
   * Get resource progress statistics
   */
  async getProgress(req, res) {
    try {
      const userId = req.user.id;
      const progress = await resourceService.getProgress(userId);
      return res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while fetching resource progress',
      });
    }
  }

  /**
   * Get resources linked to a specific company
   */
  async getByCompany(req, res) {
    try {
      const userId = req.user.id;
      const { companyId } = req.params;
      const resources = await resourceService.getResourcesByCompany(userId, companyId);
      return res.status(200).json({
        success: true,
        count: resources.length,
        data: resources,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while fetching company resources',
      });
    }
  }

  /**
   * Get resource by ID
   */
  async getById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const resource = await resourceService.getResourceById(userId, id);
      return res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while fetching resource',
      });
    }
  }

  /**
   * Update a resource
   */
  async update(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updatedResource = await resourceService.updateResource(userId, id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Resource updated successfully',
        data: updatedResource,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while updating resource',
      });
    }
  }

  /**
   * Delete a resource
   */
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await resourceService.deleteResource(userId, id);
      return res.status(200).json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error while deleting resource',
      });
    }
  }
}

module.exports = new ResourceController();
