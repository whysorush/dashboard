// src/pages/DashboardBuilder/components/PropertiesPanel/KPIProperties.jsx
import React from 'react';
import { KPI_METRICS, NUMBER_FORMATS } from '../../constants';

const KPIProperties = ({ widget, onChange }) => {
  const handleMetricToggle = (metric) => {
    const currentMetrics = widget.config?.kpiMetrics || [];
    const updated = currentMetrics.includes(metric)
      ? currentMetrics.filter(m => m !== metric)
      : [...currentMetrics, metric];
    onChange('config.kpiMetrics', updated);
  };

  return (
    <div className="space-y-4">
      {/* Show KPIs Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Display KPIs
        </label>
        <button
          type="button"
          onClick={() => onChange('config.showKPIs', !widget.config?.showKPIs)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            widget.config?.showKPIs !== false 
              ? 'bg-blue-500' 
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              widget.config?.showKPIs !== false ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {widget.config?.showKPIs !== false && (
        <>
          {/* KPI Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              KPI Position
            </label>
            <select
              value={widget.config?.kpiPosition || 'top'}
              onChange={(e) => onChange('config.kpiPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>

          {/* Select Metrics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Metrics to Display
            </label>
            <div className="space-y-2">
              {KPI_METRICS.map(metric => (
                <label
                  key={metric.value}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(widget.config?.kpiMetrics || []).includes(metric.value)}
                    onChange={() => handleMetricToggle(metric.value)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-500 
                             focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-lg">{metric.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {metric.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Number Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number Format
            </label>
            <select
              value={widget.config?.numberFormat || 'number'}
              onChange={(e) => onChange('config.numberFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {NUMBER_FORMATS.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          {/* Decimal Places */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Decimal Places
            </label>
            <input
              type="number"
              min="0"
              max="4"
              value={widget.config?.decimalPlaces || 0}
              onChange={(e) => onChange('config.decimalPlaces', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Show Comparison */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Comparison
            </label>
            <button
              type="button"
              onClick={() => onChange('config.showComparison', !widget.config?.showComparison)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                widget.config?.showComparison 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  widget.config?.showComparison ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Show Trend Arrow */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Trend Arrow
            </label>
            <button
              type="button"
              onClick={() => onChange('config.showTrendArrow', !widget.config?.showTrendArrow)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                widget.config?.showTrendArrow !== false 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  widget.config?.showTrendArrow !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sparkline */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Sparkline
            </label>
            <button
              type="button"
              onClick={() => onChange('config.showSparkline', !widget.config?.showSparkline)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                widget.config?.showSparkline 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  widget.config?.showSparkline ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default KPIProperties;