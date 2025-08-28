// src/pages/DashboardBuilder/components/widgets/PieChartWidget.jsx
import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs } from '../../utils/mockDataGenerator';

const PieChartWidget = ({ widget, isSelected, onClick }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const data = useMemo(() => {
    return generateMockData('pie', {
      segments: 5
    });
  }, []);

  const kpis = useMemo(() => {
    return calculateKPIs(data, widget.config);
  }, [data, widget.config]);

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationDuration={widget.config?.animations !== false ? 1500 : 0}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={widget.config?.color ? 
                    `${widget.config.color}${Math.floor((1 - index * 0.15) * 255).toString(16).padStart(2, '0')}` : 
                    COLORS[index % COLORS.length]
                  } 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}
            />
            {widget.config?.showLegend !== false && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <FilterBar config={widget.config} onChange={handleFilterChange} />
    </BaseWidget>
  );
};

export default PieChartWidget;