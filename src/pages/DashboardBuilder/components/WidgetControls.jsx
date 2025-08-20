// src/pages/DashboardBuilder/components/WidgetControls.jsx
import React from 'react';
import { FiCopy, FiTrash2, FiLock, FiUnlock, FiMove } from 'react-icons/fi';
import { useBuilder } from '../context/BuilderContext';

const WidgetControls = ({ widgetId }) => {
  const { 
    widgets, 
    removeWidget, 
    duplicateWidget, 
    toggleLockWidget 
  } = useBuilder();
  
  const widget = widgets.find(w => w.id === widgetId);
  if (!widget) return null;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this widget?')) {
      removeWidget(widgetId);
    }
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    duplicateWidget(widgetId);
  };

  const handleToggleLock = (e) => {
    e.stopPropagation();
    toggleLockWidget(widgetId);
  };

  return (
    <>
      {/* Drag Handle */}
      <div className="widget-drag-handle absolute top-0 left-0 right-0 h-8 
                    cursor-move bg-gradient-to-b from-gray-100/50 to-transparent 
                    dark:from-gray-800/50 opacity-0 hover:opacity-100 transition-opacity
                    flex items-center justify-center">
        <div className="flex items-center gap-1">
          <FiMove className="text-gray-500 dark:text-gray-400" size={14} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Drag to move
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 
                    group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleDuplicate}
          className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm 
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Duplicate widget"
        >
          <FiCopy size={14} className="text-gray-600 dark:text-gray-400" />
        </button>
        
        <button
          onClick={handleToggleLock}
          className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm 
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={widget.locked ? "Unlock widget" : "Lock widget"}
        >
          {widget.locked ? (
            <FiLock size={14} className="text-yellow-600 dark:text-yellow-400" />
          ) : (
            <FiUnlock size={14} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>
        
        <button
          onClick={handleDelete}
          className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm 
                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Delete widget"
        >
          <FiTrash2 size={14} className="text-red-600 dark:text-red-400" />
        </button>
      </div>

      {/* Selection Border */}
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
      
      {/* Resize Handles (if not locked) */}
      {!widget.locked && (
        <>
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
          
          {/* Edge handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize" />
          <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize" />
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize" />
        </>
      )}
    </>
  );
};

export default WidgetControls;