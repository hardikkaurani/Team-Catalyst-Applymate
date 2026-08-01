import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Edit } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/ui/Toast';
import { resourceApi } from '../api/resourceApi';
import { companyApi } from '../api/companyApi';
import { RESOURCE_CATEGORIES, RESOURCE_STATUSES } from '../constants/statusConstants';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal & Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'DSA',
    link: '',
    completionStatus: 'Not Started',
    linkedCompanyId: '',
  });

  const [deleteId, setDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchResourcesAndCompanies();
  }, []);

  const fetchResourcesAndCompanies = async () => {
    setLoading(true);
    try {
      const [resData, compData] = await Promise.allSettled([
        resourceApi.getAll(),
        companyApi.getAll(),
      ]);

      if (resData.status === 'fulfilled') {
        const rList = resData.value.data?.data?.resources || resData.value.data || [];
        setResources(Array.isArray(rList) ? rList : []);
      }

      if (compData.status === 'fulfilled') {
        const cList = compData.value.data?.data?.companies || compData.value.data || [];
        setCompanies(Array.isArray(cList) ? cList : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources =
    activeCategory === 'All'
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  const handleOpenAddModal = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      category: 'DSA',
      link: '',
      completionStatus: 'Not Started',
      linkedCompanyId: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      category: resource.category || 'DSA',
      link: resource.link || '',
      completionStatus: resource.completionStatus || 'Not Started',
      linkedCompanyId: resource.linkedCompanyId?._id || resource.linkedCompanyId || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await resourceApi.update(editingResource._id, formData);
        setToastMessage({ type: 'success', text: 'Resource updated successfully!' });
      } else {
        await resourceApi.create(formData);
        setToastMessage({ type: 'success', text: 'Resource created successfully!' });
      }
      setIsModalOpen(false);
      fetchResourcesAndCompanies();
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to save resource.' });
    }
  };

  const handleToggleStatus = async (resource) => {
    const statusOrder = ['Not Started', 'In Progress', 'Completed'];
    const currentIndex = statusOrder.indexOf(resource.completionStatus || 'Not Started');
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      await resourceApi.update(resource._id, { completionStatus: nextStatus });
      setResources((prev) =>
        prev.map((r) => (r._id === resource._id ? { ...r, completionStatus: nextStatus } : r))
      );
      setToastMessage({ type: 'success', text: `Status updated to ${nextStatus}` });
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await resourceApi.delete(deleteId);
      setToastMessage({ type: 'success', text: 'Resource deleted.' });
      setDeleteId(null);
      fetchResourcesAndCompanies();
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to delete resource.' });
    }
  };

  const statusBadges = {
    'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
    'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
    'Not Started': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Preparation Resources
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Curate DSA, Aptitude, Core subjects, and link them to job applications.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
            Add Resource
          </Button>
        </div>

        {/* Category Tab Pills */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {['All', ...RESOURCE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-accent-primary text-white border-accent-primary shadow-sm'
                  : 'bg-bg-secondary-light dark:bg-bg-secondary-dark border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-accent-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} className="h-44" />
          </div>
        ) : filteredResources.length === 0 ? (
          <EmptyState
            title="No Resources Found"
            description="Add preparation materials to track your study progress."
            actionText="Add Resource"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <Card key={res._id} hover className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary">
                      {res.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(res)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${
                        statusBadges[res.completionStatus || 'Not Started']
                      }`}
                      title="Click to advance status"
                    >
                      {res.completionStatus || 'Not Started'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark leading-snug">
                    {res.title}
                  </h3>

                  {res.link && (
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline"
                    >
                      Open Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">
                    {res.linkedCompanyId?.name
                      ? `Linked: ${res.linkedCompanyId.name}`
                      : 'Global Resource'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleOpenEditModal(res)} />
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => setDeleteId(res._id)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource ? 'Edit Resource' : 'Add Preparation Resource'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Resource Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Striver's A2Z DSA Sheet, OS Notes"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={RESOURCE_CATEGORIES}
              required
            />

            <Select
              label="Completion Status"
              name="completionStatus"
              value={formData.completionStatus}
              onChange={(e) => setFormData({ ...formData, completionStatus: e.target.value })}
              options={RESOURCE_STATUSES}
              required
            />
          </div>

          <Input
            label="Resource Link URL"
            name="link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://leetcode.com/... or Google Drive link"
          />

          <Select
            label="Link to Company (Optional)"
            name="linkedCompanyId"
            value={formData.linkedCompanyId}
            onChange={(e) => setFormData({ ...formData, linkedCompanyId: e.target.value })}
            options={[
              { value: '', label: 'Global (No specific company)' },
              ...companies.map((c) => ({ value: c._id, label: `${c.name} (${c.role})` })),
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingResource ? 'Save Changes' : 'Create Resource'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message="Are you sure you want to delete this resource?"
      />

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
