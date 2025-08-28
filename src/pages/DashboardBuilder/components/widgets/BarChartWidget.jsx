// src/pages/DashboardBuilder/components/widgets/BarChartWidget.jsx
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../../utils/mockDataGenerator';

const BarChartWidget = ({ widget, isSelected, onClick }) => {
  // Generate realistic data based on widget config
  const data = useMemo(() => {
    return generateMockData('categories', {
      categories: widget.config?.dataPoints || 5,
      includeComparison: widget.config?.comparisonPeriod,
      timeRange: widget.config?.timeRange || 'monthly',
      trend: widget.config?.trend || 'up'
    });
  }, [widget.config]);

  const kpis = useMemo(() => {
    return calculateKPIs(data, widget.config);
  }, [data, widget.config]);

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
  };

  // Calculate height based on widget size
  const chartHeight = useMemo(() => {
    const size = widget.position?.size || 'medium';
    return size === 'large' ? 350 : size === 'medium' ? 300 : 250;
  }, [widget.position?.size]);

  // Determine bar color and styles
  const primaryColor = widget.config?.color || '#3B82F6';
  const secondaryColor = `${primaryColor}88`; // 50% opacity version

  return (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      {widget.config?.showKPIs !== false && (
        <KPIDisplay
          metrics={kpis}
          config={widget.config}
          position={widget.config?.kpiPosition || 'top'}
        />
      )}

      <div style={{ width: '100%', height: chartHeight }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barGap={5}
            barCategoryGap={10}
          >
            {widget.config?.showGrid !== false && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700"
                vertical={false}
              />
            )}
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            {widget.config?.showLegend !== false && (
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
              />
            )}
            <Bar
              name="Current Period"
              dataKey="value"
              fill={primaryColor}
              radius={[4, 4, 0, 0]}
              animationDuration={widget.config?.animations !== false ? 1500 : 0}
              maxBarSize={60}
            />
            {widget.config?.comparisonPeriod && (
              <Bar
                name="Previous Period"
                dataKey="previousValue"
                fill={secondaryColor}
                radius={[4, 4, 0, 0]}
                animationDuration={widget.config?.animations !== false ? 1500 : 0}
                maxBarSize={60}
              />
            )}
            {widget.config?.stacked && (
              <Bar
                name="Secondary Metric"
                dataKey="value2"
                fill={secondaryColor}
                radius={[4, 4, 0, 0]}
                stackId="stack"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {widget.config?.showFilters !== false && (
        <FilterBar config={widget.config} onChange={handleFilterChange} />
      )}
    </BaseWidget>
  );
};

export default BarChartWidget;