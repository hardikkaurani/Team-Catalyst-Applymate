const Resource = require('../models/resource.model');

class ResourceService {
  /**
   * Create a new preparation resource
   */
  async createResource(userId, data) {
    const { title, category, link, linkedCompanyId, companyId, completionStatus } = data;

    if (!title || !category || !link) {
      const error = new Error('Please provide title, category, and link');
      error.statusCode = 400;
      throw error;
    }

    const companyRef = linkedCompanyId || companyId || null;

    const resource = await Resource.create({
      userId,
      title: title.trim(),
      category,
      link: link.trim(),
      linkedCompanyId: companyRef,
      completionStatus: completionStatus || 'Not Started',
    });

    return await Resource.findById(resource._id).populate('linkedCompanyId', 'name role status');
  }

  /**
   * Get all resources for a user, with optional filters
   */
  async getResources(userId, filters = {}) {
    const query = { userId };

    if (filters.category) {
      query.category = filters.category;
    }

    const companyId = filters.linkedCompanyId || filters.companyId;
    if (companyId) {
      query.linkedCompanyId = companyId;
    }

    if (filters.completionStatus) {
      query.completionStatus = filters.completionStatus;
    }

    return await Resource.find(query)
      .populate('linkedCompanyId', 'name role status')
      .sort({ createdAt: -1 });
  }

  /**
   * Get resources specific to a company
   */
  async getResourcesByCompany(userId, companyId) {
    if (!companyId) {
      const error = new Error('Company ID is required');
      error.statusCode = 400;
      throw error;
    }

    return await Resource.find({ userId, linkedCompanyId: companyId })
      .populate('linkedCompanyId', 'name role status')
      .sort({ createdAt: -1 });
  }

  /**
   * Get a single resource by ID
   */
  async getResourceById(userId, resourceId) {
    const resource = await Resource.findOne({ _id: resourceId, userId })
      .populate('linkedCompanyId', 'name role status');

    if (!resource) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }

    return resource;
  }

  /**
   * Update resource details
   */
  async updateResource(userId, resourceId, updateData) {
    const resource = await Resource.findOne({ _id: resourceId, userId });

    if (!resource) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }

    const allowedUpdates = ['title', 'category', 'link', 'linkedCompanyId', 'companyId', 'completionStatus'];
    
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === 'companyId') {
          resource.linkedCompanyId = updateData[field];
        } else {
          resource[field] = updateData[field];
        }
      }
    });

    await resource.save();
    return await Resource.findById(resource._id).populate('linkedCompanyId', 'name role status');
  }

  /**
   * Delete a resource
   */
  async deleteResource(userId, resourceId) {
    const resource = await Resource.findOneAndDelete({ _id: resourceId, userId });

    if (!resource) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }

    return { id: resourceId };
  }
}

module.exports = new ResourceService();
