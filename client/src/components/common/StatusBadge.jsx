import React from 'react';
import { STATUS_CONFIG } from '../../constants/statusConstants';

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
    >
      {config.label || status}
    </span>
  );
}
