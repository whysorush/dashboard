// src/pages/DashboardBuilder/components/widgets/KPICardWidget.jsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import BaseWidget from './BaseWidget';

const KPICardWidget = ({ widget, isSelected, onClick }) => {
  // Mock KPI data
  const kpiData = {
    value: 42567,
    previousValue: 38234,
    label: widget.config?.title || 'Total Revenue',
    change: ((42567 - 38234) / 38234 * 100).toFixed(1),
    trend: [65, 72, 68, 75, 82, 79, 88, 92, 85, 95, 98, 102] // Sparkline data
  };

  const formatValue = (value) => {
    const format = widget.config?.numberFormat || 'number';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'abbreviated':
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
      default:
        return value.toLocaleString();
    }
  };

  const isPositive = parseFloat(kpiData.change) > 0;

  return (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      <div className="flex flex-col h-full justify-center">
        {/* Icon */}
        <div className="mb-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${widget.config?.color || '#3B82F6'}20` }}
          >
            <FiActivity 
              className="w-6 h-6" 
              style={{ color: widget.config?.color || '#3B82F6' }}
            />
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Figtree', sans-serif" }}>
            {formatValue(kpiData.value)}
          </div>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? (
              <FiTrendingUp className="w-4 h-4" />
            ) : (
              <FiTrendingDown className="w-4 h-4" />
            )}
            <span>{isPositive ? '+' : ''}{kpiData.change}%</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            vs last period
          </span>
        </div>

        {/* Sparkline */}
        {widget.config?.showSparkline !== false && (
          <div className="h-12 w-full">
            <svg className="w-full h-full">
              <polyline
                fill="none"
                stroke={widget.config?.color || '#3B82F6'}
                strokeWidth="2"
                points={kpiData.trend.map((value, index) => 
                  `${index * (100 / (kpiData.trend.length - 1))},${50 - (value - 50) * 0.4}`
                ).join(' ')}
                className="opacity-50"
              />
            </svg>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default KPICardWidget;