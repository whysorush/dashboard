// src/pages/DashboardBuilder/components/widgets/GradientBarChartWidget.jsx
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../../utils/mockDataGenerator';
import { GRADIENT_CHART_COLORS } from '../../constants';

/**
 * Gradient Bar Chart Widget
 * 
 * A professional bar chart with gradient styling, matching the reference design.
 * Features:
 * - Gradient fill from cyan to green
 * - Clean axes with minimal styling
 * - Proper spacing and rounded corners
 * - Responsive sizing
 */
const GradientBarChartWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};
  
  // Generate mock data based on configuration
  const data = useMemo(() => {
    return generateMockData('categories', {
      categories: config.dataPoints || 10,
      includeComparison: config.comparisonPeriod,
      timeRange: config.timeRange || 'monthly',
      trend: config.trend || 'random'
    });
  }, [config]);

  // Calculate KPIs from data
  const kpis = useMemo(() => {
    return calculateKPIs(data, config);
  }, [data, config]);

  // Get total from data for title display
  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(sum);
  }, [data]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
  };

  // Calculate height based on widget size
  const chartHeight = useMemo(() => {
    const size = widget.position?.size || 'medium';
    return size === 'large' ? 350 : size === 'medium' ? 300 : 250;
  }, [widget.position?.size]);
  
  // Get gradient colors
  const gradientColors = useMemo(() => {
    return {
      startColor: config.startColor || GRADIENT_CHART_COLORS.BAR_CHART.startColor,
      endColor: config.endColor || GRADIENT_CHART_COLORS.BAR_CHART.endColor
    };
  }, [config.startColor, config.endColor]);

  return (
    <BaseWidget 
      widget={widget} 
      isSelected={isSelected} 
      onClick={onClick}
      className="p-0 overflow-hidden"
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
        {/* Title with value */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
            Bar Chart
          </h3>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {total}
          </div>
        </div>
        
        {/* Chart */}
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              barGap={8}
              barCategoryGap={16}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientColors.startColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={gradientColors.endColor} stopOpacity={1} />
                </linearGradient>
              </defs>
              
              {config.showGrid !== false && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke="#E5E7EB"
                  className="dark:stroke-gray-700"
                />
              )}
              
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
                className="text-gray-500 dark:text-gray-400"
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={30}
                className="text-gray-500 dark:text-gray-400"
              />
              
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`${value.toLocaleString()}`, '']}
              />
              
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                animationDuration={config.animations !== false ? 1500 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend/Footer */}
        <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: 'linear-gradient(180deg, #00E5FF 0%, #00FF85 100%)' }}></span>
          Lorem ipsum simply dummy text of the printing and typesetting industry.
        </div>
      </div>
    </BaseWidget>
  );
};

export default GradientBarChartWidget;
