// src/pages/DashboardBuilder/components/QuickAddButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useBuilder } from '../context/BuilderContext';
import { WIDGET_CATEGORIES } from '../constants';

const QuickAddButton = ({ position, isLarge = false, className = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { addWidget } = useBuilder();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleAddWidget = (type, defaultSize) => {
    addWidget(type, position ? { ...position, ...defaultSize } : null);
    setShowMenu(false);
  };

  const allWidgets = Object.values(WIDGET_CATEGORIES).flatMap(cat => cat.widgets);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${
          isLarge 
            ? 'w-12 h-12 text-lg' 
            : 'w-8 h-8 text-sm'
        } bg-blue-500 hover:bg-blue-600 text-white rounded-full 
          flex items-center justify-center shadow-lg hover:shadow-xl 
          transition-all transform hover:scale-110 focus:outline-none 
          focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
        title="Add widget"
      >
        <FiPlus />
      </button>

      {showMenu && (
        <div className="absolute z-50 mt-2 left-1/2 transform -translate-x-1/2 
                      w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl 
                      border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 py-1">
              Add Widget
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(WIDGET_CATEGORIES).map(([key, category]) => (
              <div key={key} className="border-t border-gray-100 dark:border-gray-700">
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-750">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 
                               flex items-center gap-1">
                    <span>{category.icon}</span>
                    {category.label}
                  </p>
                </div>
                <div className="p-1">
                  {category.widgets.map((widget) => (
                    <button
                      key={widget.type}
                      onClick={() => handleAddWidget(widget.type, widget.defaultSize)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 
                               dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">{widget.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {widget.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {widget.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAddButton;