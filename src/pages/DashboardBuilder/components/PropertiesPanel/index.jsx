// src/pages/DashboardBuilder/components/PropertiesPanel/index.jsx
import React, { useState } from 'react';
import { FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useBuilder } from '../../context/BuilderContext';
import GeneralProperties from './GeneralProperties';
import DataProperties from './DataProperties';
import StyleProperties from './StyleProperties';
import KPIProperties from './KPIProperties';

const PropertiesPanel = ({ onClose }) => {
  const { widgets, selectedWidget, updateWidgetProperty } = useBuilder();
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    data: true,
    style: true,
    kpi: true
  });

  const widget = widgets.find(w => w.id === selectedWidget);
  
  if (!widget) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePropertyChange = (path, value) => {
    updateWidgetProperty(selectedWidget, path, value);
  };

  const sections = [
    {
      id: 'general',
      title: 'General',
      icon: '⚙️',
      component: GeneralProperties
    },
    {
      id: 'data',
      title: 'Data',
      icon: '📊',
      component: DataProperties
    },
    {
      id: 'style',
      title: 'Style',
      icon: '🎨',
      component: StyleProperties
    },
    {
      id: 'kpi',
      title: 'KPIs',
      icon: '📈',
      component: KPIProperties,
      show: widget.type.includes('chart') || widget.type === 'kpi-card'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Widget Properties
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {widget.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Properties Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map(section => {
          if (section.show === false) return null;
          
          const SectionComponent = section.component;
          
          return (
            <div key={section.id} className="border-b border-gray-200 dark:border-gray-700">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.icon}</span>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {section.title}
                  </h3>
                </div>
                {expandedSections[section.id] ? (
                  <FiChevronDown className="text-gray-400" />
                ) : (
                  <FiChevronRight className="text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              {expandedSections[section.id] && (
                <div className="px-4 pb-4">
                  <SectionComponent
                    widget={widget}
                    onChange={handlePropertyChange}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={() => {
            if (window.confirm('Reset all properties to default values?')) {
              // Reset logic here
              console.log('Reset properties');
            }
          }}
          className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 
                   hover:text-gray-900 dark:hover:text-white
                   border border-gray-300 dark:border-gray-600 rounded-lg
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;