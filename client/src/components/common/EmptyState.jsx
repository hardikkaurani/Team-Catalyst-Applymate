import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyState({
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
  icon: Icon = FolderOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl my-6">
      <div className="p-4 rounded-full bg-accent-primary/10 mb-4">
        <Icon className="w-8 h-8 text-accent-primary" />
      </div>
      <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-sm mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
