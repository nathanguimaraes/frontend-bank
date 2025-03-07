import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Transfer } from '../lib/api';

interface SpendingGraphProps {
  transfers: Transfer[];
}

type TimeRange = 'week' | 'month' | 'year';

export const SpendingGraph: React.FC<SpendingGraphProps> = ({ transfers }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const data = useMemo(() => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 12
    };

    if (timeRange === 'year') {
      // Group by months for year view
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now.getFullYear(), i, 1);
        const monthTransfers = transfers.filter(t => {
          const transferDate = new Date(t.id);
          return transferDate.getMonth() === month.getMonth() &&
                 transferDate.getFullYear() === month.getFullYear();
        });

        const spending = monthTransfers
          .filter(t => t.sender.id === 3)
          .reduce((sum, t) => sum + t.value, 0);

        return {
          date: month.toLocaleString('default', { month: 'short' }),
          spending
        };
      });

      return monthlyData;
    } else {
      // Daily data for week/month view
      const days = periods[timeRange];
      return Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const dayTransfers = transfers.filter(t => {
          const transferDate = new Date(t.id);
          return transferDate.toDateString() === date.toDateString();
        });

        const spending = dayTransfers
          .filter(t => t.sender.id === 3)
          .reduce((sum, t) => sum + t.value, 0);

        return {
          date: timeRange === 'week' 
            ? date.toLocaleString('default', { weekday: 'short' })
            : date.getDate().toString(),
          spending
        };
      }).reverse();
    }
  }, [transfers, timeRange]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Spending Overview</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Spending']}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#spending)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};