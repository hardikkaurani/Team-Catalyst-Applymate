import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, BookOpen, TrendingUp } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { resourceApi } from '../api/resourceApi';

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await resourceApi.getProgress();
      const data = response.data?.data || response.data;
      setProgress(Array.isArray(data) ? data : data.progress || []);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall readiness score
  const totalItems = progress.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalCompleted = progress.reduce((acc, curr) => acc + (curr.completed || 0), 0);
  const overallPercentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Preparation Readiness Matrix
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Aggregate study progress across DSA, Aptitude, Core Subjects, and Interview Prep.
          </p>
        </div>

        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Score Card */}
          <Card className="flex items-center gap-6 bg-gradient-to-br from-accent-primary/20 to-bg-secondary-light dark:to-bg-secondary-dark">
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-8 border-accent-primary/30">
              <span className="text-2xl font-black text-accent-primary">
                {overallPercentage}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                Overall Placement Readiness
              </p>
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
                {overallPercentage >= 80
                  ? 'Placement Ready!'
                  : overallPercentage >= 50
                  ? 'Good Progress'
                  : 'In Preparation Phase'}
              </h3>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {totalCompleted} of {totalItems} total modules completed
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                  Completed Modules
                </p>
                <p className="text-2xl font-black text-text-primary-light dark:text-text-primary-dark mt-0.5">
                  {totalCompleted}
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                  Total Tracked Modules
                </p>
                <p className="text-2xl font-black text-text-primary-light dark:text-text-primary-dark mt-0.5">
                  {totalItems}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Progress Breakdown */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Category-Wise Breakdown
            </h2>
            <TrendingUp className="w-5 h-5 text-accent-primary" />
          </div>

          {loading ? (
            <SkeletonLoader count={4} className="h-14 my-2" />
          ) : progress.length === 0 ? (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center py-8">
              No preparation metrics tracked yet. Add resources to view category progress.
            </p>
          ) : (
            <div className="space-y-6">
              {progress.map((item, idx) => {
                const percentage =
                  item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-text-primary-light dark:text-text-primary-dark">
                        {item.category}
                      </span>
                      <span className="text-accent-primary">
                        {item.completed} / {item.total} ({percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-3 rounded-full bg-bg-primary-light dark:bg-bg-primary-dark overflow-hidden border border-border-light dark:border-border-dark">
                      <div
                        className="h-full bg-accent-primary transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
