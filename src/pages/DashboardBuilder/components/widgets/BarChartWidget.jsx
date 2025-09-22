// src/pages/DashboardBuilder/components/widgets/BarChartWidget.jsx
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../../utils/mockDataGenerator';
import { useThemeStyles } from '../../../../utils/themeUtils';

const BarChartWidget = ({ widget, isSelected, onClick }) => {
  const {
    getChartColors,
    getStyleProperties,
    getCSSVariables,
    getChartHeight,
    getColorPalette,
    getTooltipStyle,
    getAnimationConfig
  } = useThemeStyles();

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

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || 'medium');
  const colorPalette = getColorPalette();
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(widget.config?.animations !== false);

  // Determine bar color and styles
  const primaryColor = widget.config?.color || colors.primary;
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

      <div 
        style={{ 
          width: '100%', 
          height: chartHeight,
          ...cssVariables
        }}
        className="chart-container"
      >
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
                stroke={colors.grid}
                vertical={false}
              />
            )}
            <XAxis 
              dataKey="name"
              tick={{ 
                fontSize: 12,
                fill: colors.textSecondary
              }}
              axisLine={{ stroke: colors.border }}
              tickLine={false}
            />
            <YAxis 
              tick={{ 
                fontSize: 12,
                fill: colors.textSecondary
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            {widget.config?.showLegend !== false && (
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10,
                  color: colors.text
                }}
                iconType="circle"
              />
            )}
            <Bar
              name="Current Period"
              dataKey="value"
              fill={primaryColor}
              radius={[parseInt(styleProps.borderRadius), parseInt(styleProps.borderRadius), 0, 0]}
              animationDuration={animationConfig.duration}
              maxBarSize={60}
            />
            {widget.config?.comparisonPeriod && (
              <Bar
                name="Previous Period"
                dataKey="previousValue"
                fill={secondaryColor}
                radius={[parseInt(styleProps.borderRadius), parseInt(styleProps.borderRadius), 0, 0]}
                animationDuration={animationConfig.duration}
                maxBarSize={60}
              />
            )}
            {widget.config?.stacked && (
              <Bar
                name="Secondary Metric"
                dataKey="value2"
                fill={secondaryColor}
                radius={[parseInt(styleProps.borderRadius), parseInt(styleProps.borderRadius), 0, 0]}
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