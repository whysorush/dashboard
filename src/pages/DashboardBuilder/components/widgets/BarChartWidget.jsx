// src/pages/DashboardBuilder/components/widgets/BarChartWidget.jsx
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../utils/mockDataGenerator';

const BarChartWidget = ({ widget, isSelected, onClick }) => {
  const data = useMemo(() => {
    return generateMockData('categories', {
      categories: 5,
      includeComparison: widget.config?.comparisonPeriod
    });
  }, [widget.config?.comparisonPeriod]);

  const kpis = useMemo(() => {
    return calculateKPIs(data, widget.config);
  }, [data, widget.config]);

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
  };

  return (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      {widget.config?.showKPIs !== false && (
        <KPIDisplay
          metrics={kpis}
          config={widget.config}
          position={widget.config?.kpiPosition || 'top'}
        />
      )}

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart
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
            <Bar
              dataKey="value"
              fill={widget.config?.color || '#3B82F6'}
              radius={[4, 4, 0, 0]}
              animationDuration={widget.config?.animations !== false ? 1500 : 0}
            />
            {widget.config?.stacked && (
              <Bar
                dataKey="value2"
                fill={widget.config?.color ? `${widget.config.color}88` : '#3B82F688'}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <FilterBar config={widget.config} onChange={handleFilterChange} />
    </BaseWidget>
  );
};

export default BarChartWidget;