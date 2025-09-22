// src/pages/DashboardBuilder/components/PropertiesPanel/StyleProperties.jsx
import React from 'react';
import { COLOR_SCHEMES } from '../../constants';

const StyleProperties = ({ widget, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Color Scheme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color Scheme
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_SCHEMES.map(scheme => (
            <button
              key={scheme.value}
              onClick={() => onChange('config.color', scheme.value)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                widget.config?.color === scheme.value
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
              title={scheme.name}
            >
              <div 
                className="w-full h-6 rounded"
                style={{ backgroundColor: scheme.value }}
              />
              {widget.config?.color === scheme.value && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
        {/* Custom Color Input */}
        <div className="mt-2">
          <input
            type="color"
            value={widget.config?.color || '#27D0FC'}
            onChange={(e) => onChange('config.color', e.target.value)}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
            title="Choose custom color"
          />
        </div>
      </div>

      {/* Theme Override */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Theme
        </label>
        <select
          value={widget.config?.theme || 'inherit'}
          onChange={(e) => onChange('config.theme', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="inherit">Inherit from Dashboard</option>
          <option value="light">Always Light</option>
          <option value="dark">Always Dark</option>
        </select>
      </div>

      {/* Chart-specific styles */}
      {widget.type.includes('chart') && (
        <>
          {/* Show Legend */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Legend
            </label>
            <button
              type="button"
              onClick={() => onChange('config.showLegend', !widget.config?.showLegend)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                widget.config?.showLegend !== false 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  widget.config?.showLegend !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Show Grid Lines */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Grid Lines
            </label>
            <button
              type="button"
              onClick={() => onChange('config.showGrid', !widget.config?.showGrid)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                widget.config?.showGrid !== false 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  widget.config?.showGrid !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Animations
            </label>
            <button
              type="button"
              onClick={() => onChange('config.animations', !widget.config?.animations)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                widget.config?.animations !== false 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  widget.config?.animations !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Line Chart Specific */}
          {(widget.type === 'line-chart' || widget.type === 'area-chart') && (
            <>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Smooth Curves
                </label>
                <button
                  type="button"
                  onClick={() => onChange('config.smoothCurves', !widget.config?.smoothCurves)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    widget.config?.smoothCurves 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      widget.config?.smoothCurves ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Data Points
                </label>
                <button
                  type="button"
                  onClick={() => onChange('config.showDataPoints', !widget.config?.showDataPoints)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    widget.config?.showDataPoints !== false 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      widget.config?.showDataPoints !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* Bar Chart Specific */}
          {widget.type === 'bar-chart' && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Stacked Bars
              </label>
              <button
                type="button"
                onClick={() => onChange('config.stacked', !widget.config?.stacked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  widget.config?.stacked 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    widget.config?.stacked ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
        </>
      )}

      {/* Border Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Border Style
        </label>
        <select
          value={widget.config?.borderStyle || 'default'}
          onChange={(e) => onChange('config.borderStyle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="default">Default</option>
          <option value="none">No Border</option>
          <option value="thin">Thin</option>
          <option value="thick">Thick</option>
          <option value="dashed">Dashed</option>
        </select>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Opacity
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={widget.config?.opacity || 1}
            onChange={(e) => onChange('config.opacity', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
            {Math.round((widget.config?.opacity || 1) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StyleProperties;