import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  ExternalLink,
  Upload,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import StatusBadge from '../components/common/StatusBadge';
import Toast from '../components/ui/Toast';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { companyApi } from '../api/companyApi';
import { resourceApi } from '../api/resourceApi';
import { journalApi } from '../api/journalApi';
import { APPLICATION_STATUSES } from '../constants/statusConstants';
import { formatDate } from '../utils/dateUtils';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState(null);

  // Editable fields
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Tab related states
  const [resources, setResources] = useState([]);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await companyApi.getById(id);
      const data = response.data?.data?.company || response.data?.company || response.data;
      setCompany(data);
      setNotes(data.notes || '');

      // Load related resources and journals
      const [resData, jourData] = await Promise.allSettled([
        resourceApi.getAll({ companyId: id }),
        journalApi.getAll({ companyId: id }),
      ]);

      if (resData.status === 'fulfilled') {
        const rList = resData.value.data?.data?.resources || resData.value.data || [];
        setResources(Array.isArray(rList) ? rList : []);
      }
      if (jourData.status === 'fulfilled') {
        const jList = jourData.value.data?.data?.entries || jourData.value.data || [];
        setJournals(Array.isArray(jList) ? jList : []);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      setToastMessage({ type: 'error', text: 'Failed to load company details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await companyApi.updateStatus(id, newStatus);
      const updated = response.data?.data?.company || response.data?.company || response.data;
      setCompany((prev) => ({
        ...prev,
        status: newStatus,
        statusHistory: updated.statusHistory || prev.statusHistory,
      }));
      setToastMessage({ type: 'success', text: `Status updated to ${newStatus}` });
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await companyApi.update(id, { notes });
      setToastMessage({ type: 'success', text: 'Notes updated successfully!' });
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to save notes.' });
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <SkeletonLoader count={1} className="h-10 w-48" />
          <SkeletonLoader count={1} className="h-40" />
          <SkeletonLoader count={1} className="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-2xl font-bold">Company Record Not Found</h2>
          <Link to="/applications">
            <Button variant="primary">Back to Applications</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'jd_notes', label: 'JD & Notes' },
    { id: 'resume', label: 'Resume' },
    { id: 'resources', label: `Linked Resources (${resources.length})` },
    { id: 'history', label: 'Status History' },
    { id: 'journal', label: `Interview Journals (${journals.length})` },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/applications"
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>
        </div>

        {/* Company Header Banner Card */}
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-accent-primary/10 text-accent-primary shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-text-primary-light dark:text-text-primary-dark">
                  {company.name}
                </h1>
                <StatusBadge status={company.status} />
              </div>
              <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                {company.role}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5" /> Applied on {formatDate(company.applicationDate)}
              </p>
            </div>
          </div>

          {/* Quick status dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark shrink-0">
              Change Status:
            </span>
            <Select
              value={company.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={APPLICATION_STATUSES}
              className="w-48"
            />
          </div>
        </Card>

        {/* Tab Navigation Header */}
        <div className="flex overflow-x-auto border-b border-border-light dark:border-border-dark gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <Card className="space-y-6">
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Application Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                    Company Name
                  </p>
                  <p className="font-bold text-base mt-1">{company.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                    Target Role
                  </p>
                  <p className="font-bold text-base mt-1">{company.role}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                    Application Date
                  </p>
                  <p className="font-bold text-base mt-1">{formatDate(company.applicationDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                    Current Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={company.status} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'jd_notes' && (
            <Card className="space-y-6">
              {company.jd && (
                <div>
                  <h4 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-2">
                    Job Description Link
                  </h4>
                  <a
                    href={company.jd}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent-primary font-bold hover:underline"
                  >
                    View Job Description <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-2">
                  Preparation Notes
                </h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Add key prep notes, referral details, or round information..."
                  className="w-full p-4 rounded-xl bg-bg-primary-light dark:bg-bg-primary-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm"
                />
                <div className="mt-3 flex justify-end">
                  <Button variant="primary" onClick={handleSaveNotes} disabled={isSavingNotes}>
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'resume' && (
            <Card className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Uploaded Resume
              </h3>
              {company.resumeFile ? (
                <div className="p-4 rounded-xl border border-border-light dark:border-border-dark flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-accent-primary" />
                    <div>
                      <p className="font-semibold text-sm">Resume Attached</p>
                      <a
                        href={company.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-primary hover:underline"
                      >
                        Download / View Document
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl text-center space-y-3">
                  <Upload className="w-8 h-8 text-text-secondary-light dark:text-text-secondary-dark mx-auto" />
                  <p className="text-sm font-semibold">No resume attached to this application yet.</p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'resources' && (
            <Card className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Linked Preparation Materials
              </h3>
              {resources.length === 0 ? (
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  No preparation resources linked to this company yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {resources.map((res) => (
                    <div
                      key={res._id}
                      className="p-3.5 rounded-xl border border-border-light dark:border-border-dark flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm">{res.title}</p>
                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          Category: {res.category}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
                        {res.completionStatus || 'Not Started'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="space-y-6">
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Application Status Timeline
              </h3>
              {(!company.statusHistory || company.statusHistory.length === 0) ? (
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  No status transitions logged yet.
                </p>
              ) : (
                <div className="relative border-l-2 border-accent-primary/30 pl-6 space-y-6">
                  {company.statusHistory.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-accent-primary border-4 border-bg-secondary-light dark:border-bg-secondary-dark" />
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />
                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          {formatDate(item.changedAt || item.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'journal' && (
            <Card className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Interview Reflection Journals
              </h3>
              {journals.length === 0 ? (
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  No interview journal entries logged for this company.
                </p>
              ) : (
                <div className="space-y-3">
                  {journals.map((j) => (
                    <div
                      key={j._id}
                      className="p-4 rounded-xl border border-border-light dark:border-border-dark space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{j.roundType} Round</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary">
                          Difficulty: {j.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {j.questionsAsked || j.reflection}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

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
