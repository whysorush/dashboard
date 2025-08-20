// src/pages/DashboardBuilder/components/widgets/FilterBar.jsx
import React, { useState } from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { TIME_RANGES, COMPARISON_PERIODS } from '../../constants';

const FilterBar = ({ config, onChange }) => {
  const [showComparison, setShowComparison] = useState(false);

  if (config?.showFilters === false) return null;

  return (
    <div className="filter-bar mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-2">
        {/* Time Range Buttons */}
        <div className="flex items-center gap-1">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {TIME_RANGES.map(range => (
              <button
                key={range.value}
                onClick={() => onChange('timeRange', range.value)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  config?.timeRange === range.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Toggle */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100 
                   dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FiClock className="w-3 h-3" />
          Compare
        </button>

        {/* Comparison Period Dropdown */}
        {showComparison && (
          <select
            value={config?.comparisonPeriod || ''}
            onChange={(e) => onChange('comparisonPeriod', e.target.value)}
            className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No Comparison</option>
            {COMPARISON_PERIODS.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default FilterBar;