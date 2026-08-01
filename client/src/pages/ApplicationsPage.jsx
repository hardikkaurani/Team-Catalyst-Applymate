import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Trash2, Eye, Edit, Filter } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toast from '../components/ui/Toast';
import { companyApi } from '../api/companyApi';
import { useDebounce } from '../hooks/useDebounce';
import { APPLICATION_STATUSES } from '../constants/statusConstants';
import { formatDate, formatInputDate } from '../utils/dateUtils';

export default function ApplicationsPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortField, setSortField] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Toast states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    applicationDate: formatInputDate(new Date()),
    status: 'Applied',
    jd: '',
    notes: '',
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, selectedStatuses, sortField, sortOrder, page]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort: sortOrder === 'desc' ? `-${sortField}` : sortField,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedStatuses.length > 0) params.status = selectedStatuses.join(',');

      const response = await companyApi.getAll(params);
      const data = response.data?.data || response.data;
      const list = data.companies || data;
      setCompanies(Array.isArray(list) ? list : []);

      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
    setPage(1);
  };

  const handleOpenAddModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      role: '',
      applicationDate: formatInputDate(new Date()),
      status: 'Applied',
      jd: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      role: company.role || '',
      applicationDate: formatInputDate(company.applicationDate),
      status: company.status || 'Applied',
      jd: company.jd || '',
      notes: company.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await companyApi.update(editingCompany._id, formData);
        setToastMessage({ type: 'success', text: 'Company updated successfully!' });
      } else {
        await companyApi.create(formData);
        setToastMessage({ type: 'success', text: 'Company application added!' });
      }
      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      setToastMessage({
        type: 'error',
        text: error.response?.data?.message || 'Action failed',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await companyApi.delete(deleteTargetId);
      setToastMessage({ type: 'success', text: 'Company record deleted.' });
      setDeleteTargetId(null);
      fetchCompanies();
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to delete company.' });
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await companyApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applymate-applications-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToastMessage({ type: 'success', text: 'CSV export downloaded!' });
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to export CSV.' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Applications Management
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Track and manage company placement application workflows.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleExportCsv} icon={Download}>
              Export CSV
            </Button>
            <Button variant="primary" onClick={handleOpenAddModal} icon={Plus}>
              Add Application
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark p-4 rounded-2xl border border-border-light dark:border-border-dark space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              placeholder="Search by company or role..."
              className="flex-1"
            />
            <div className="flex items-center gap-3">
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                options={[
                  { value: 'applicationDate', label: 'Sort by Date' },
                  { value: 'name', label: 'Sort by Company' },
                  { value: 'status', label: 'Sort by Status' },
                ]}
                className="w-44"
              />
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                options={[
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' },
                ]}
                className="w-36"
              />
            </div>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-light dark:border-border-dark">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status Filter:
            </span>
            {APPLICATION_STATUSES.map((status) => {
              const active = selectedStatuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusToggle(status)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-accent-primary text-white border-accent-primary shadow-sm'
                      : 'bg-bg-primary-light dark:bg-bg-primary-dark text-text-primary-light dark:text-text-primary-dark border-border-light dark:border-border-dark hover:border-accent-primary'
                  }`}
                >
                  {status}
                </button>
              );
            })}
            {selectedStatuses.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedStatuses([])}
                className="text-xs text-red-500 hover:underline font-semibold ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-accent-primary/10 border-b border-border-light dark:border-border-dark text-xs uppercase font-bold text-text-primary-light dark:text-text-primary-dark">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8">
                      <SkeletonLoader count={5} className="h-10 my-1" />
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8">
                      <EmptyState
                        title="No Applications Found"
                        description="Try adjusting search terms or add a new application."
                        actionText="Add Application"
                        onAction={handleOpenAddModal}
                      />
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr
                      key={company._id}
                      className="hover:bg-accent-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-text-primary-light dark:text-text-primary-dark">
                        <Link
                          to={`/applications/${company._id}`}
                          className="hover:text-accent-primary transition-colors"
                        >
                          {company.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark font-medium">
                        {company.role}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={company.status} />
                      </td>
                      <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                        {formatDate(company.applicationDate)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Link to={`/applications/${company._id}`}>
                          <Button variant="ghost" size="sm" icon={Eye}>
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleOpenEditModal(company)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteTargetId(company._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? 'Edit Application' : 'Add New Application'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Google, Amazon, Microsoft"
            required
          />

          <Input
            label="Job Role"
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Software Engineer, SDE Intern"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Application Date"
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={(e) =>
                setFormData({ ...formData, applicationDate: e.target.value })
              }
              required
            />

            <Select
              label="Current Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={APPLICATION_STATUSES}
              required
            />
          </div>

          <Input
            label="Job Description URL"
            name="jd"
            value={formData.jd}
            onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
            placeholder="https://careers.company.com/job/123"
          />

          <Input
            label="Notes / Preparation Details"
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Key topics, referral details, or notes..."
            multiline
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCompany ? 'Save Changes' : 'Create Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Company Application"
        message="Are you sure you want to delete this company application? This action cannot be undone."
      />

      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
