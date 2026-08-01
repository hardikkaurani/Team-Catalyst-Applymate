const mongoose = require('mongoose');
const Company = require('../models/company.model');
const { VALID_STATUSES } = require('../models/company.model');

class CompanyService {
  /**
   * Get all companies for the authenticated user with search and status filter options
   * @param {string} userId - Authenticated user ID
   * @param {object} queryParams - Query parameters (search, status)
   */
  async getAllCompanies(userId, queryParams = {}) {
    const { search, status } = queryParams;

    // Strict ownership filter
    const query = { userId: new mongoose.Types.ObjectId(userId) };

    // Status filter
    if (status && status.trim() !== '') {
      if (!VALID_STATUSES.includes(status)) {
        const error = new Error(`Invalid status filter. Allowed values: ${VALID_STATUSES.join(', ')}`);
        error.statusCode = 400;
        throw error;
      }
      query.status = status;
    }

    // Search filter (Case-insensitive regex match on company name or role title)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { role: { $regex: searchRegex } },
      ];
    }

    // Fetch matching company applications sorted newest first
    const companies = await Company.find(query)
      .sort({ applicationDate: -1, createdAt: -1 })
      .lean();

    return {
      count: companies.length,
      companies,
    };
  }

  /**
   * Calculate KPI dashboard metrics for user applications using MongoDB aggregation
   * @param {string} userId - Authenticated user ID
   */
  async getStats(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const statsAggregation = await Company.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Map aggregated counts to stats dictionary
    const statusMap = {
      Applied: 0,
      'Online Assessment': 0,
      'Technical Interview': 0,
      'HR Interview': 0,
      Selected: 0,
      Rejected: 0,
    };

    let total = 0;

    statsAggregation.forEach((item) => {
      if (statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
        total += item.count;
      }
    });

    const active =
      statusMap['Applied'] +
      statusMap['Online Assessment'] +
      statusMap['Technical Interview'] +
      statusMap['HR Interview'];

    return {
      total,
      active,
      selected: statusMap['Selected'],
      rejected: statusMap['Rejected'],
      applied: statusMap['Applied'],
      onlineAssessment: statusMap['Online Assessment'],
      technicalInterview: statusMap['Technical Interview'],
      hrInterview: statusMap['HR Interview'],
    };
  }

  /**
   * Get single company details by ID ensuring user ownership
   * @param {string} userId - Authenticated user ID
   * @param {string} companyId - Company document ID
   */
  async getCompanyById(userId, companyId) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    const company = await Company.findOne({
      _id: companyId,
      userId,
    }).lean();

    if (!company) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    return company;
  }

  /**
   * Create a new company application entry
   * @param {string} userId - Authenticated user ID
   * @param {object} payload - Application details (name, role, status, jd, notes, resumeFile, applicationDate)
   */
  async createCompany(userId, payload) {
    const { name, role, status, jd, notes, resumeFile, applicationDate } = payload;

    if (!name || name.trim() === '') {
      const error = new Error('Company name is required');
      error.statusCode = 400;
      throw error;
    }

    if (!role || role.trim() === '') {
      const error = new Error('Role title is required');
      error.statusCode = 400;
      throw error;
    }

    const finalStatus = status ? status.trim() : 'Applied';
    if (!VALID_STATUSES.includes(finalStatus)) {
      const error = new Error(`Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const company = await Company.create({
      userId,
      name: name.trim(),
      role: role.trim(),
      status: finalStatus,
      jd: jd ? jd.trim() : '',
      notes: notes ? notes.trim() : '',
      resumeFile: resumeFile ? resumeFile.trim() : '',
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
    });

    return company;
  }

  /**
   * Update an existing company application
   * @param {string} userId - Authenticated user ID
   * @param {string} companyId - Company document ID
   * @param {object} updatePayload - Fields to update
   */
  async updateCompany(userId, companyId, updatePayload) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    const company = await Company.findOne({ _id: companyId, userId });
    if (!company) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    const allowedUpdates = ['name', 'role', 'status', 'jd', 'notes', 'resumeFile', 'applicationDate'];
    const updateData = {};

    for (const field of allowedUpdates) {
      if (updatePayload[field] !== undefined) {
        if (field === 'name' || field === 'role') {
          if (typeof updatePayload[field] !== 'string' || updatePayload[field].trim() === '') {
            const error = new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`);
            error.statusCode = 400;
            throw error;
          }
          updateData[field] = updatePayload[field].trim();
        } else if (field === 'status') {
          const statusValue = updatePayload[field].trim();
          if (!VALID_STATUSES.includes(statusValue)) {
            const error = new Error(`Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`);
            error.statusCode = 400;
            throw error;
          }
          updateData[field] = statusValue;
        } else if (field === 'applicationDate') {
          updateData[field] = new Date(updatePayload[field]);
        } else if (typeof updatePayload[field] === 'string') {
          updateData[field] = updatePayload[field].trim();
        } else {
          updateData[field] = updatePayload[field];
        }
      }
    }

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: companyId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return updatedCompany;
  }

  /**
   * Delete a company application
   * @param {string} userId - Authenticated user ID
   * @param {string} companyId - Company document ID
   */
  async deleteCompany(userId, companyId) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    const company = await Company.findOneAndDelete({ _id: companyId, userId });
    if (!company) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      message: 'Application deleted successfully',
    };
  }
}

module.exports = new CompanyService();
