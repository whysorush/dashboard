// src/pages/DashboardBuilder/components/RowContainer.jsx
import React from 'react';
import { FiPlus, FiMove, FiAlertCircle } from 'react-icons/fi';
import { useBuilder } from '../context/BuilderContext';

const RowContainer = ({ row, children, isSelected, onAddWidget, canAddMore = true }) => {
  const { setSelectedRow } = useBuilder();

  const handleRowClick = (e) => {
    // Only select row if clicking directly on the row container (not on widgets)
    if (e.target === e.currentTarget || e.target.classList.contains('row-container')) {
      setSelectedRow(row.id);
    }
  };

  return (
    <div 
      className={`row-container relative mb-4 p-2 rounded-lg border-2 border-dashed
        ${isSelected ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700'}
      `}
      onClick={handleRowClick}
      data-row-id={row.id}
    >
      {/* Row header */}
      <div className="row-header flex items-center justify-between mb-2 px-2">
        <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium mr-2">
            <FiMove className="text-gray-500 dark:text-gray-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {row.title}
          </h4>
        </div>
        
        {canAddMore ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddWidget(row.id);
            }}
            className="flex items-center text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Add widget to this row"
          >
            <FiPlus className="mr-1" size={12} /> Add Widget
          </button>
        ) : (
          <div className="flex items-center text-xs px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded cursor-not-allowed"
            title="Maximum 3 charts per row"
          >
            <FiAlertCircle className="mr-1" size={12} /> Max Reached
          </div>
        )}
      </div>
      
      {/* Row content - widgets container */}
      <div 
      
      
      // className="row-content flex flex-row flex-nowrap gap-4 justify-center items-stretch"
      
      
      >
        {children}
      </div>
      
      {/* Empty state */}
      {React.Children.count(children) === 0 && (
        <div className="empty-row flex items-center justify-center h-24 bg-gray-50 dark:bg-gray-800/50 rounded border border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag widgets here or click "Add Widget"
          </p>
        </div>
      )}
    </div>
  );
};

export default RowContainer;
