// src/pages/DashboardBuilder/components/PropertiesPanel/DataProperties.jsx
import React from 'react';
import { REFRESH_INTERVALS, TIME_RANGES, AGGREGATION_TYPES } from '../../constants';

const DataProperties = ({ widget, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Data Refresh Interval */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Refresh Interval
        </label>
        <select
          value={widget.config?.refreshInterval || 0}
          onChange={(e) => onChange('config.refreshInterval', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {REFRESH_INTERVALS.map(interval => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Time Range
        </label>
        <select
          value={widget.config?.timeRange || 'monthly'}
          onChange={(e) => onChange('config.timeRange', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {TIME_RANGES.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Data Points (for charts) */}
      {widget.type.includes('chart') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data Points
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={widget.config?.dataPoints || 12}
              onChange={(e) => onChange('config.dataPoints', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
              {widget.config?.dataPoints || 12}
            </span>
          </div>
        </div>
      )}

      {/* Aggregation Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Aggregation
        </label>
        <select
          value={widget.config?.aggregation || 'sum'}
          onChange={(e) => onChange('config.aggregation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {AGGREGATION_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Group By (for bar/pie charts) */}
      {(widget.type === 'bar-chart' || widget.type === 'pie-chart') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Group By
          </label>
          <select
            value={widget.config?.groupBy || 'category'}
            onChange={(e) => onChange('config.groupBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="category">Category</option>
            <option value="product">Product</option>
            <option value="region">Region</option>
            <option value="status">Status</option>
            <option value="type">Type</option>
          </select>
        </div>
      )}

      {/* Data Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data Source
        </label>
        <select
          value={widget.config?.dataSource || 'mock'}
          onChange={(e) => onChange('config.dataSource', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="mock">Mock Data</option>
          <option value="api" disabled>API (Coming Soon)</option>
          <option value="csv" disabled>CSV Upload (Coming Soon)</option>
        </select>
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Show Filters
        </label>
        <button
          type="button"
          onClick={() => onChange('config.showFilters', !widget.config?.showFilters)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            widget.config?.showFilters 
              ? 'bg-blue-500' 
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              widget.config?.showFilters ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default DataProperties;