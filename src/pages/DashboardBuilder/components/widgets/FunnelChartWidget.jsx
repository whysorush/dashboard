// src/pages/DashboardBuilder/components/widgets/FunnelChartWidget.jsx
import React, { useMemo } from 'react';
import {
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../utils/mockDataGenerator';

const FunnelChartWidget = ({ widget, isSelected, onClick }) => {
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

  const COLORS = [
    '#3B82F6',
    '#60A5FA', 
    '#93C5FD',
    '#BFDBFE',
    '#DBEAFE'
  ];

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
          <FunnelChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}
            />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive={widget.config?.animations !== false}
            >
              <LabelList 
                position="center" 
                fill="#fff"
                formatter={(value) => `${value.toLocaleString()}`}
              />
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={widget.config?.color ? 
                    `${widget.config.color}${Math.floor((1 - index * 0.15) * 255).toString(16).padStart(2, '0')}` : 
                    COLORS[index % COLORS.length]
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