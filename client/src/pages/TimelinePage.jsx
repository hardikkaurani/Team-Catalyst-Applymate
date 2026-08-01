import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { timelineApi } from '../api/timelineApi';
import { APPLICATION_STATUSES } from '../constants/statusConstants';
import { formatDate, formatTimeAgo } from '../utils/dateUtils';

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTimeline();
  }, [statusFilter]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const response = await timelineApi.getFeed(params);
      const data = response.data?.data || response.data;
      setTimeline(Array.isArray(data) ? data : data.timeline || []);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Application Status Timeline
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Chronological feed of status changes across all job applications.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark p-4 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
            <span className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
              Filter Status:
            </span>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: '', label: 'All Statuses' }, ...APPLICATION_STATUSES]}
              className="w-48"
            />
          </div>
        </div>

        {/* Timeline Feed */}
        <Card>
          {loading ? (
            <SkeletonLoader count={6} className="h-16 my-2" />
          ) : timeline.length === 0 ? (
            <EmptyState
              title="No Timeline Events Logged"
              description="Status updates across your applications will appear here."
            />
          ) : (
            <div className="relative border-l-2 border-accent-primary/30 pl-6 space-y-8 my-4">
              {timeline.map((item, idx) => (
                <div key={item._id || idx} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent-primary border-4 border-bg-secondary-light dark:border-bg-secondary-dark shadow-sm" />

                  <div className="bg-bg-primary-light/40 dark:bg-bg-primary-dark/40 border border-border-light dark:border-border-dark rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Link
                        to={`/applications/${item.companyId?._id || item.companyId}`}
                        className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark hover:text-accent-primary transition-colors"
                      >
                        {item.companyName || item.companyId?.name || 'Company'}
                      </Link>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        Role: <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{item.role || 'N/A'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge status={item.status} />
                      <div className="text-right">
                        <p className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {formatDate(item.changedAt || item.createdAt)}
                        </p>
                        <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                          {formatTimeAgo(item.changedAt || item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
