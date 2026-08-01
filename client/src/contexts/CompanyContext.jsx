import React, { createContext, useState, useCallback } from 'react';
import { companyApi } from '../api/companyApi';

export const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchCompanies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await companyApi.getAll(params);
      const data = response.data?.data || response.data;
      const list = data.companies || data;
      setCompanies(Array.isArray(list) ? list : []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCompany = async (companyData) => {
    const response = await companyApi.create(companyData);
    const newCompany = response.data?.data?.company || response.data?.company || response.data;
    setCompanies((prev) => [newCompany, ...prev]);
    return newCompany;
  };

  const updateCompany = async (id, updateData) => {
    const response = await companyApi.update(id, updateData);
    const updated = response.data?.data?.company || response.data?.company || response.data;
    setCompanies((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  };

  const updateStatus = async (id, status) => {
    const response = await companyApi.updateStatus(id, status);
    const updated = response.data?.data?.company || response.data?.company || response.data;
    setCompanies((prev) => prev.map((c) => (c._id === id ? { ...c, status, statusHistory: updated.statusHistory || c.statusHistory } : c)));
    return updated;
  };

  const deleteCompany = async (id) => {
    await companyApi.delete(id);
    setCompanies((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        loading,
        error,
        pagination,
        fetchCompanies,
        addCompany,
        updateCompany,
        updateStatus,
        deleteCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
