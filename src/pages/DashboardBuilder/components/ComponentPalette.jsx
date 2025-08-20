// src/pages/DashboardBuilder/components/ComponentPalette.jsx
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { FiSearch, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { WIDGET_CATEGORIES } from '../constants';

const DraggableWidget = ({ widget }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: {
      type: widget.type,
      defaultSize: widget.defaultSize
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`widget-card p-3 bg-white dark:bg-gray-700 rounded-lg border-2 
                border-gray-200 dark:border-gray-600 cursor-move transition-all
                hover:border-blue-400 hover:shadow-md ${
                  isDragging ? 'opacity-50 scale-95' : ''
                }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{widget.icon}</div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {widget.label}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {widget.description}
          </p>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Size: {widget.defaultSize.w}×{widget.defaultSize.h}
      </div>
    </div>
  );
};

const ComponentPalette = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(WIDGET_CATEGORIES).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter widgets based on search
  const filteredCategories = Object.entries(WIDGET_CATEGORIES).reduce((acc, [key, category]) => {
    const filteredWidgets = category.widgets.filter(widget =>
      widget.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredWidgets.length > 0) {
      acc[key] = {
        ...category,
        widgets: filteredWidgets
      };
    }
    
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Widget Library
        </h2>
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
                             text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 
                     border border-gray-200 dark:border-gray-600 rounded-lg
                     text-gray-900 dark:text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Widget Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(filteredCategories).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No widgets found matching "{searchTerm}"
            </p>
          </div>
        ) : (
          Object.entries(filteredCategories).map(([key, category]) => (
            <div key={key} className="category-section">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(key)}
                className="w-full flex items-center justify-between mb-3 
                         hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -mx-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {category.label}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({category.widgets.length})
                  </span>
                </div>
                {expandedCategories[key] ? (
                  <FiChevronDown className="text-gray-400" />
                ) : (
                  <FiChevronRight className="text-gray-400" />
                )}
              </button>

              {/* Category Widgets */}
              {expandedCategories[key] && (
                <div className="space-y-2">
                  {category.widgets.map((widget) => (
                    <DraggableWidget key={widget.type} widget={widget} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Tips */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Tip:</strong> Drag widgets to the canvas or use the + buttons
        </p>
      </div>
    </div>
  );
};

export default ComponentPalette;