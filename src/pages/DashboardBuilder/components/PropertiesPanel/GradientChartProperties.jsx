// src/pages/DashboardBuilder/components/PropertiesPanel/GradientChartProperties.jsx
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';

/**
 * Properties panel for gradient chart widgets
 */
const GradientChartProperties = ({ widget }) => {
  const { updateWidgetProperty } = useBuilder();
  
  // Handle property changes
  const handleChange = (property, value) => {
    updateWidgetProperty(widget.id, `config.${property}`, value);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data Points
        </label>
        <input
          type="number"
          min="3"
          max="20"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.dataPoints || 10}
          onChange={(e) => handleChange('dataPoints', Number(e.target.value))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Trend
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.trend || 'random'}
          onChange={(e) => handleChange('trend', e.target.value)}
        >
          <option value="up">Upward</option>
          <option value="down">Downward</option>
          <option value="random">Random</option>
          <option value="volatile">Volatile</option>
          <option value="stable">Stable</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Start Color (Gradient)
        </label>
        <div className="flex items-center">
          <input
            type="color"
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer"
            value={widget.config?.startColor || '#00E5FF'}
            onChange={(e) => handleChange('startColor', e.target.value)}
          />
          <input
            type="text"
            className="flex-1 ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={widget.config?.startColor || '#00E5FF'}
            onChange={(e) => handleChange('startColor', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          End Color (Gradient)
        </label>
        <div className="flex items-center">
          <input
            type="color"
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer"
            value={widget.config?.endColor || '#00FF85'}
            onChange={(e) => handleChange('endColor', e.target.value)}
          />
          <input
            type="text"
            className="flex-1 ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={widget.config?.endColor || '#00FF85'}
            onChange={(e) => handleChange('endColor', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showGrid"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={widget.config?.showGrid !== false}
          onChange={(e) => handleChange('showGrid', e.target.checked)}
        />
        <label htmlFor="showGrid" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Show Grid
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showLegend"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={widget.config?.showLegend !== false}
          onChange={(e) => handleChange('showLegend', e.target.checked)}
        />
        <label htmlFor="showLegend" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Show Legend
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="animations"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={widget.config?.animations !== false}
          onChange={(e) => handleChange('animations', e.target.checked)}
        />
        <label htmlFor="animations" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Enable Animations
        </label>
      </div>
    </div>
  );
};

export default GradientChartProperties;
