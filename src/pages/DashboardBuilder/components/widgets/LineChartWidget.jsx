// src/pages/DashboardBuilder/components/widgets/LineChartWidget.jsx
import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../utils/mockDataGenerator';

const LineChartWidget = ({ widget, isSelected, onClick }) => {
  // Generate mock data based on configuration
  const data = useMemo(() => {
    return generateMockData('time-series', {
      points: widget.config?.dataPoints || 12,
      trend: 'random'
    });
  }, [widget.config?.dataPoints]);

  // Calculate KPIs from data
  const kpis = useMemo(() => {
    return calculateKPIs(data, widget.config);
  }, [data, widget.config]);

  const handleFilterChange = (key, value) => {
    // This would normally update the widget config
    console.log('Filter changed:', key, value);
  };

  return (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      {/* KPIs */}
      {widget.config?.showKPIs !== false && (
        <KPIDisplay
          metrics={kpis}
          config={widget.config}
          position={widget.config?.kpiPosition || 'top'}
        />
      )}

      {/* Chart */}
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            {widget.config?.showGrid !== false && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700"
              />
            )}
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}
            />
            {widget.config?.showLegend !== false && <Legend />}
            <Line
              type={widget.config?.smoothCurves ? 'monotone' : 'linear'}
              dataKey="value"
              stroke={widget.config?.color || '#3B82F6'}
              strokeWidth={2}
              dot={widget.config?.showDataPoints !== false}
              activeDot={{ r: 6 }}
              animationDuration={widget.config?.animations !== false ? 1500 : 0}
            />
            {/* Second line for comparison if needed */}
            {widget.config?.comparisonPeriod && (
              <Line
                type={widget.config?.smoothCurves ? 'monotone' : 'linear'}
                dataKey="previousValue"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <FilterBar config={widget.config} onChange={handleFilterChange} />
    </BaseWidget>
  );
};

export default LineChartWidget;