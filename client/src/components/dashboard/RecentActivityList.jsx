import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import StatusBadge from '../common/StatusBadge';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';

export default function RecentActivityList({ activities = [] }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          Recent Application Timeline
        </h2>
        <Link
          to="/timeline"
          className="text-xs font-semibold text-accent-primary hover:underline"
        >
          View All
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
          No recent activity logged.
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
          {activities.slice(0, 6).map((item, idx) => (
            <div
              key={item._id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-bg-primary-light/50 dark:bg-bg-primary-dark/50 border border-border-light dark:border-border-dark text-sm"
            >
              <div className="space-y-0.5">
                <Link
                  to={`/applications/${item.companyId?._id || item.companyId}`}
                  className="font-bold text-text-primary-light dark:text-text-primary-dark hover:text-accent-primary transition-colors"
                >
                  {item.companyName || item.companyId?.name || 'Company'}
                </Link>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {formatTimeAgo(item.changedAt || item.createdAt)}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
