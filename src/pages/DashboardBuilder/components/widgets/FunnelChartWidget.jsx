// src/pages/DashboardBuilder/components/widgets/FunnelChartWidget.jsx
import React, { useMemo } from 'react';
import {
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../../utils/mockDataGenerator';
import { useThemeStyles } from '../../../../utils/themeUtils';

const FunnelChartWidget = ({ widget, isSelected, onClick }) => {
  const {
    getChartColors,
    getStyleProperties,
    getCSSVariables,
    getChartHeight,
    getColorPalette,
    getTooltipStyle,
    getAnimationConfig
  } = useThemeStyles();

  const data = useMemo(() => {
    return generateMockData('funnel', {
      stages: 5
    });
  }, []);

  const kpis = useMemo(() => {
    const conversionRate = data.length > 1 ? 
      ((data[data.length - 1].value / data[0].value) * 100).toFixed(1) : 0;
    
    return {
      total: {
        value: data[0]?.value || 0,
        label: 'Total Visitors'
      },
      conversion: {
        value: parseFloat(conversionRate),
        label: 'Conversion Rate',
        comparison: 5.2 // Mock comparison
      },
      average: {
        value: data[data.length - 1]?.value || 0,
        label: 'Conversions'
      }
    };
  }, [data]);

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
  };

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || 'medium');
  const colorPalette = getColorPalette(5);
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(widget.config?.animations !== false);

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
          <FunnelChart>
            <Tooltip
              contentStyle={tooltipStyle}
            />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive={widget.config?.animations !== false}
            >
              <LabelList 
                position="center" 
                fill={colors.text}
                formatter={(value) => `${value.toLocaleString()}`}
              />
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={widget.config?.color ? 
                    `${widget.config.color}${Math.floor((1 - index * 0.15) * 255).toString(16).padStart(2, '0')}` : 
                    colorPalette[index % colorPalette.length]
                  }
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <FilterBar config={widget.config} onChange={handleFilterChange} />
    </BaseWidget>
  );
};

export default FunnelChartWidget;