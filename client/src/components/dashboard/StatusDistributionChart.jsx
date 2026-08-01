import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';
import { STATUS_CONFIG } from '../../constants/statusConstants';

export default function StatusDistributionChart({ data = [] }) {
  // Expected data format: [{ name: 'Applied', value: 5 }, ...]
  const chartData = data.map((item) => ({
    name: item.name || item.status,
    value: item.value || item.count || 0,
    color: STATUS_CONFIG[item.name || item.status]?.color || '#8AAEE0',
  }));

  return (
    <Card className="flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">
        Application Status Distribution
      </h2>
      {chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
          No application data to display yet.
        </div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 46, 71, 0.9)',
                  borderColor: '#638ECB',
                  borderRadius: '12px',
                  color: '#F0F3FA',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
