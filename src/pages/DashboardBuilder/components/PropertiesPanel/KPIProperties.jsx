// src/pages/DashboardBuilder/components/PropertiesPanel/KPIProperties.jsx
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { NUMBER_FORMATS } from '../../constants';

/**
 * Properties panel for professional KPI widgets
 */
const KPIProperties = ({ widget }) => {
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
          Subtitle
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Value
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.value || 0}
          onChange={(e) => handleChange('value', Number(e.target.value))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Format Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.formatType || 'number'}
          onChange={(e) => handleChange('formatType', e.target.value)}
        >
          {NUMBER_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>
      
      {widget.config?.formatType === 'currency' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency Symbol
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={widget.config?.currency || '$'}
            onChange={(e) => handleChange('currency', e.target.value)}
          />
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Growth Percentage
        </label>
        <input
          type="number"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.growth || 0}
          onChange={(e) => handleChange('growth', Number(e.target.value))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={widget.config?.icon || ''}
          onChange={(e) => handleChange('icon', e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter an emoji or icon name
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon Color
        </label>
        <div className="flex items-center">
          <input
            type="color"
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer"
            value={widget.config?.iconColor || '#27D0FC'}
            onChange={(e) => handleChange('iconColor', e.target.value)}
          />
          <input
            type="text"
            className="flex-1 ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={widget.config?.iconColor || '#27D0FC'}
            onChange={(e) => handleChange('iconColor', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon Background Color
        </label>
        <div className="flex items-center">
          <input
            type="color"
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer"
            value={widget.config?.iconBgColor?.replace(/rgba\((.*),\s*[\d\.]+\)/, 'rgb($1)') || '#E6F5FF'}
            onChange={(e) => {
              // Convert RGB to RGBA with opacity
              const rgb = e.target.value;
              const rgba = rgb.replace(
                /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, 
                (_, r, g, b) => `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, 0.1)`
              );
              handleChange('iconBgColor', rgba);
            }}
          />
          <input
            type="text"
            className="flex-1 ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={widget.config?.iconBgColor || 'rgba(59, 130, 246, 0.1)'}
            onChange={(e) => handleChange('iconBgColor', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default KPIProperties;