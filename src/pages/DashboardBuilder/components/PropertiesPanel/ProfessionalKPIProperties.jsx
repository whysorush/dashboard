// src/pages/DashboardBuilder/components/PropertiesPanel/ProfessionalKPIProperties.jsx
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { PROFESSIONAL_WIDGET_CONFIGS } from '../../constants';

const ProfessionalKPIProperties = ({ widget }) => {
  const { updateWidgetProperty } = useBuilder();
  
  // Use default config as fallback
  const defaultConfig = PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD;
  
  const handleChange = (property, value) => {
    updateWidgetProperty(widget.id, `config.${property}`, value);
  };
  
  return (
    <div className="space-y-4">
      <div className="properties-group">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Professional KPI Properties
        </h3>
        
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              KPI Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.title || defaultConfig.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          {/* Value */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Value
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.value || defaultConfig.value}
              onChange={(e) => handleChange('value', Number(e.target.value))}
            />
          </div>
          
          {/* Prefix */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Value Prefix
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.prefix || defaultConfig.prefix}
              onChange={(e) => handleChange('prefix', e.target.value)}
            />
          </div>
          
          {/* Growth */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Growth Percentage
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.growth || defaultConfig.growth}
              onChange={(e) => handleChange('growth', Number(e.target.value))}
            />
          </div>
          
          {/* Growth Direction */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Growth Direction
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.growthDirection || defaultConfig.growthDirection}
              onChange={(e) => handleChange('growthDirection', e.target.value)}
            >
              <option value="up">Up (↗)</option>
              <option value="down">Down (↘)</option>
            </select>
          </div>
          
          {/* Growth Text */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Growth Text
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.growthText || defaultConfig.growthText}
              onChange={(e) => handleChange('growthText', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="properties-group">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Visual Properties
        </h3>
        
        <div className="space-y-3">
          {/* Icon */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Icon
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.icon || defaultConfig.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use emoji or icon code
            </p>
          </div>
          
          {/* Icon Background Color */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Icon Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                value={widget.config?.iconBg || defaultConfig.iconBg}
                onChange={(e) => handleChange('iconBg', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={widget.config?.iconBg || defaultConfig.iconBg}
                onChange={(e) => handleChange('iconBg', e.target.value)}
              />
            </div>
          </div>
          
          {/* Growth Background Color */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Growth Badge Background
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                value={widget.config?.growthColor || defaultConfig.growthColor}
                onChange={(e) => handleChange('growthColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={widget.config?.growthColor || defaultConfig.growthColor}
                onChange={(e) => handleChange('growthColor', e.target.value)}
              />
            </div>
          </div>
          
          {/* Growth Text Color */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Growth Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                value={widget.config?.growthTextColor || defaultConfig.growthTextColor}
                onChange={(e) => handleChange('growthTextColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={widget.config?.growthTextColor || defaultConfig.growthTextColor}
                onChange={(e) => handleChange('growthTextColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalKPIProperties;
