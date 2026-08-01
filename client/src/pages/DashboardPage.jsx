import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, Clock, XCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import KpiCard from '../components/dashboard/KpiCard';
import ActionCenterWidget from '../components/dashboard/ActionCenterWidget';
import StatusDistributionChart from '../components/dashboard/StatusDistributionChart';
import RecentActivityList from '../components/dashboard/RecentActivityList';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { companyApi } from '../api/companyApi';
import { actionApi } from '../api/actionApi';
import { timelineApi } from '../api/timelineApi';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ total: 0, active: 0, offers: 0, rejected: 0 });
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [actions, setActions] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [compRes, actionRes, timelineRes] = await Promise.allSettled([
        companyApi.getAll(),
        actionApi.getActions(),
        timelineApi.getFeed(),
      ]);

      if (compRes.status === 'fulfilled') {
        const data = compRes.value.data?.data || compRes.value.data;
        const companies = data.companies || data || [];

        const total = companies.length;
        const active = companies.filter((c) => !['Selected', 'Rejected'].includes(c.status)).length;
        const offers = companies.filter((c) => c.status === 'Selected').length;
        const rejected = companies.filter((c) => c.status === 'Rejected').length;

        setKpis({ total, active, offers, rejected });

        // Group status distribution
        const distMap = {};
        companies.forEach((c) => {
          distMap[c.status] = (distMap[c.status] || 0) + 1;
        });
        const distArr = Object.keys(distMap).map((st) => ({
          name: st,
          value: distMap[st],
        }));
        setStatusDistribution(distArr);
      }

      if (actionRes.status === 'fulfilled') {
        const data = actionRes.value.data?.data || actionRes.value.data;
        setActions(Array.isArray(data) ? data : data.actions || []);
      }

      if (timelineRes.status === 'fulfilled') {
        const data = timelineRes.value.data?.data || timelineRes.value.data;
        setActivities(Array.isArray(data) ? data : data.timeline || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Real-time metric summary of placement applications and action items.
          </p>
        </div>

        {/* KPI Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonLoader count={4} className="h-28" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Total Companies"
              value={kpis.total}
              icon={Briefcase}
              color="blue"
              subtitle="Applications logged"
            />
            <KpiCard
              title="Active Pipeline"
              value={kpis.active}
              icon={Clock}
              color="purple"
              subtitle="In progress stages"
            />
            <KpiCard
              title="Offers Received"
              value={kpis.offers}
              icon={CheckCircle2}
              color="green"
              subtitle="Selected statuses"
            />
            <KpiCard
              title="Rejections"
              value={kpis.rejected}
              icon={XCircle}
              color="red"
              subtitle="Completed processes"
            />
          </div>
        )}

        {/* Middle Row: Smart Actions + Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionCenterWidget actions={actions} />
          <StatusDistributionChart data={statusDistribution} />
        </div>

        {/* Bottom Row: Timeline Feed */}
        <RecentActivityList activities={activities} />
      </div>
    </DashboardLayout>
  );
}
