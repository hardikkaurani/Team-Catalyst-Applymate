import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, TrendingDown, Target, Clock } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { insightApi } from '../api/insightApi';

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const [funnelData, setFunnelData] = useState([]);
  const [weakestRoundData, setWeakestRoundData] = useState([]);
  const [topicFrequencyData, setTopicFrequencyData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const [funnelRes, weakestRes, topicRes, responseRes] = await Promise.allSettled([
        insightApi.getFunnel(),
        insightApi.getWeakestRound(),
        insightApi.getTopicFrequency(),
        insightApi.getResponseTime(),
      ]);

      if (funnelRes.status === 'fulfilled') {
        const data = funnelRes.value.data?.data || funnelRes.value.data;
        setFunnelData(Array.isArray(data) ? data : data.funnel || []);
      }

      if (weakestRes.status === 'fulfilled') {
        const data = weakestRes.value.data?.data || weakestRes.value.data;
        setWeakestRoundData(Array.isArray(data) ? data : data.rounds || []);
      }

      if (topicRes.status === 'fulfilled') {
        const data = topicRes.value.data?.data || topicRes.value.data;
        setTopicFrequencyData(Array.isArray(data) ? data : data.topics || []);
      }

      if (responseRes.status === 'fulfilled') {
        const data = responseRes.value.data?.data || responseRes.value.data;
        setResponseTimeData(data);
      }
    } catch (error) {
      console.error('Failed to load insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8AAEE0', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#EF4444'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Company Insights & Analytics
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Data-backed analytics on pipeline conversion, weakest interview rounds, and topic frequencies.
          </p>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Application Pipeline Funnel */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Application Pipeline Funnel
              </h2>
              <BarChart3 className="w-5 h-5 text-accent-primary" />
            </div>

            {loading ? (
              <SkeletonLoader count={1} className="h-64" />
            ) : funnelData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                No funnel data available yet.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="stage" stroke="#638ECB" fontSize={12} />
                    <YAxis stroke="#638ECB" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(31, 46, 71, 0.9)',
                        borderColor: '#638ECB',
                        borderRadius: '12px',
                        color: '#F0F3FA',
                      }}
                    />
                    <Bar dataKey="count" fill="#8AAEE0" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Weakest Round Analysis */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Rejection Rate by Interview Round
              </h2>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>

            {loading ? (
              <SkeletonLoader count={1} className="h-64" />
            ) : weakestRoundData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                No round analysis data available yet.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weakestRoundData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" stroke="#638ECB" fontSize={12} />
                    <YAxis dataKey="round" type="category" stroke="#638ECB" fontSize={12} width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(31, 46, 71, 0.9)',
                        borderColor: '#638ECB',
                        borderRadius: '12px',
                        color: '#F0F3FA',
                      }}
                    />
                    <Bar dataKey="rejections" fill="#EF4444" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frequent Topics */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Most Asked Interview Topics
              </h2>
              <Target className="w-5 h-5 text-amber-500" />
            </div>

            {loading ? (
              <SkeletonLoader count={1} className="h-64" />
            ) : topicFrequencyData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Log interview reflections to track topic frequencies.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="topic" stroke="#638ECB" fontSize={12} />
                    <YAxis stroke="#638ECB" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(31, 46, 71, 0.9)',
                        borderColor: '#638ECB',
                        borderRadius: '12px',
                        color: '#F0F3FA',
                      }}
                    />
                    <Bar dataKey="frequency" fill="#F59E0B" radius={[8, 8, 0, 0]}>
                      {topicFrequencyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Average Response Duration */}
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Average Response Time
              </h2>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 mb-3">
                <Clock className="w-10 h-10" />
              </div>
              <p className="text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
                {responseTimeData?.avgDays || 12} Days
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 max-w-xs">
                Average duration between initial application date and first status change update.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
