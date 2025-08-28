// src/pages/DashboardBuilder/components/PropertiesPanel/ProfessionalBarChartProperties.jsx
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { PROFESSIONAL_WIDGET_CONFIGS } from '../../constants';

const ProfessionalBarChartProperties = ({ widget }) => {
  const { updateWidgetProperty } = useBuilder();
  
  // Use default config as fallback
  const defaultConfig = PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART;
  
  const handleChange = (property, value) => {
    updateWidgetProperty(widget.id, `config.${property}`, value);
  };
  
  return (
    <div className="space-y-4">
      <div className="properties-group">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Professional Bar Chart Properties
        </h3>
        
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Chart Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.title || defaultConfig.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          {/* Main Value */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Main Value
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.mainValue || defaultConfig.mainValue}
              onChange={(e) => handleChange('mainValue', Number(e.target.value))}
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
          
          {/* Time Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
              Time Filter
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              value={widget.config?.timeFilter || defaultConfig.timeFilter}
              onChange={(e) => handleChange('timeFilter', e.target.value)}
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Quarter">Quarter</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bar Chart Data */}
      <div className="properties-group">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center">
          <span>Chart Data</span>
          <button 
            className="text-xs text-blue-500 hover:text-blue-600"
            onClick={() => handleChange('data', defaultConfig.data)}
          >
            Reset to Default
          </button>
        </h3>
        
        <div className="space-y-2">
          {(widget.config?.data || defaultConfig.data).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                className="w-1/3 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={item.month}
                onChange={(e) => {
                  const newData = [...(widget.config?.data || defaultConfig.data)];
                  newData[index] = { ...newData[index], month: e.target.value };
                  handleChange('data', newData);
                }}
              />
              <input
                type="number"
                className="w-1/3 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={item.value}
                onChange={(e) => {
                  const newData = [...(widget.config?.data || defaultConfig.data)];
                  newData[index] = { 
                    ...newData[index], 
                    value: Number(e.target.value),
                    // Recalculate height based on the max value in the data
                    height: Math.round((Number(e.target.value) / 100000) * defaultConfig.maxHeight)
                  };
                  handleChange('data', newData);
                }}
              />
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  const newData = [...(widget.config?.data || defaultConfig.data)];
                  newData.splice(index, 1);
                  handleChange('data', newData);
                }}
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            className="w-full px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm"
            onClick={() => {
              const newData = [...(widget.config?.data || defaultConfig.data)];
              newData.push({ month: 'NEW', value: 50000, height: 87 });
              handleChange('data', newData);
            }}
          >
            + Add Data Point
          </button>
        </div>
      </div>
      
      {/* Y-Axis Labels */}
      <div className="properties-group">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Y-Axis Labels
        </h3>
        
        <div className="space-y-2">
          {(widget.config?.yAxisLabels || defaultConfig.yAxisLabels).map((label, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                value={label}
                onChange={(e) => {
                  const newLabels = [...(widget.config?.yAxisLabels || defaultConfig.yAxisLabels)];
                  newLabels[index] = e.target.value;
                  handleChange('yAxisLabels', newLabels);
                }}
              />
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  const newLabels = [...(widget.config?.yAxisLabels || defaultConfig.yAxisLabels)];
                  newLabels.splice(index, 1);
                  handleChange('yAxisLabels', newLabels);
                }}
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            className="w-full px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm"
            onClick={() => {
              const newLabels = [...(widget.config?.yAxisLabels || defaultConfig.yAxisLabels)];
              newLabels.push('New Label');
              handleChange('yAxisLabels', newLabels);
            }}
          >
            + Add Label
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBarChartProperties;
