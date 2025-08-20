// src/pages/DashboardBuilder/components/widgets/KPIDisplay.jsx
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const KPIDisplay = ({ metrics, config, position = 'top' }) => {
  const formatNumber = (value, format = 'number') => {
    if (value === null || value === undefined) return '—';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: config?.decimalPlaces || 0,
          maximumFractionDigits: config?.decimalPlaces || 0
        }).format(value);
      
      case 'percentage':
        return `${value.toFixed(config?.decimalPlaces || 1)}%`;
      
      case 'abbreviated':
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toFixed(config?.decimalPlaces || 0);
      
      default:
        return value.toLocaleString('en-US', {
          minimumFractionDigits: config?.decimalPlaces || 0,
          maximumFractionDigits: config?.decimalPlaces || 0
        });
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <FiTrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <FiTrendingDown className="w-4 h-4 text-red-500" />;
    return <FiMinus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'mt-4 pt-4 border-t border-gray-200 dark:border-gray-700';
      case 'left':
        return 'mr-4 pr-4 border-r border-gray-200 dark:border-gray-700';
      case 'right':
        return 'ml-4 pl-4 border-l border-gray-200 dark:border-gray-700';
      case 'overlay':
        return 'absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-lg shadow-lg';
      default:
        return 'mb-4 pb-4 border-b border-gray-200 dark:border-gray-700';
    }
  };

  const displayMetrics = config?.kpiMetrics || ['total', 'average', 'growth'];

  return (
    <div className={`kpi-display ${getPositionClasses()}`}>
      <div className={`grid grid-cols-${Math.min(displayMetrics.length, 4)} gap-3`}>
        {displayMetrics.map((metricKey) => {
          const metric = metrics[metricKey];
          if (!metric) return null;

          return (
            <div key={metricKey} className="kpi-item text-center">
              <div className="flex flex-col items-center">
                {/* Value */}
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(metric.value, config?.numberFormat)}
                </div>

                {/* Trend */}
                {config?.showComparison && metric.comparison !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.comparison)}`}>
                    {config?.showTrendArrow !== false && getTrendIcon(metric.comparison)}
                    <span>
                      {metric.comparison > 0 ? '+' : ''}
                      {metric.comparison.toFixed(1)}%
                    </span>
                  </div>
                )}

                {/* Label */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.label || metricKey.charAt(0).toUpperCase() + metricKey.slice(1)}
                </div>

                {/* Sparkline (placeholder) */}
                {config?.showSparkline && (
                  <div className="mt-2 h-8 w-full">
                    <svg className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke={config?.color || '#3B82F6'}
                        strokeWidth="2"
                        points="0,20 20,15 40,18 60,10 80,12 100,5"
                        className="opacity-50"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPIDisplay;