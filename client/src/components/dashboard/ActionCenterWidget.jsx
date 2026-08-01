import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function ActionCenterWidget({ actions = [] }) {
  const navigate = useNavigate();

  const priorityStyles = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
            Smart Action Center
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
          {actions.length} Action Items
        </span>
      </div>

      {actions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-text-secondary-light dark:text-text-secondary-dark">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
          <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
            All caught up!
          </p>
          <p className="text-xs">No pending action recommendations right now.</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
          {actions.map((action, idx) => (
            <div
              key={action.id || idx}
              className="p-3.5 rounded-xl border border-border-light dark:border-border-dark bg-bg-primary-light/50 dark:bg-bg-primary-dark/50 flex items-center justify-between gap-3 hover:border-accent-primary transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      priorityStyles[action.priority] || priorityStyles.medium
                    }`}
                  >
                    {action.priority || 'Action'}
                  </span>
                  <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </div>
                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {action.message}
                </p>
              </div>

              {action.actionUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(action.actionUrl)}
                  className="shrink-0"
                >
                  Action <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
