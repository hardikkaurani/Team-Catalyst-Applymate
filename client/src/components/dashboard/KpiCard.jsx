import React from 'react';
import Card from '../ui/Card';

export default function KpiCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-emerald-500/10 text-emerald-500',
    red: 'bg-red-500/10 text-red-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
            {title}
          </p>
          <p className="text-3xl font-extrabold mt-2 text-text-primary-light dark:text-text-primary-dark">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs mt-1 text-text-secondary-light dark:text-text-secondary-dark">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl ${colorStyles[color] || colorStyles.blue}`}>
            <Icon className="w-6 h-6 shrink-0" />
          </div>
        )}
      </div>
    </Card>
  );
}
