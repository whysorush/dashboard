// src/pages/DashboardBuilder/components/RowManager.jsx
import React from 'react';
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiEdit2 } from 'react-icons/fi';
import { useBuilder } from '../context/BuilderContext';

const RowManager = () => {
  const { 
    rows, 
    widgets,
    addRow, 
    removeRow, 
    updateRow, 
    reorderRows,
    selectedRow,
    setSelectedRow
  } = useBuilder();

  // Count widgets in each row
  const getRowWidgetsCount = (rowId) => {
    return widgets.filter(w => w.position.rowId === rowId).length;
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    setSelectedRow(selectedRow === rowId ? null : rowId);
  };

  // Handle row title edit
  const handleRowTitleChange = (rowId, newTitle) => {
    updateRow(rowId, { title: newTitle });
  };

  // Handle row reordering
  const handleMoveRow = (rowId, direction) => {
    const currentIndex = rows.findIndex(r => r.id === rowId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < rows.length) {
      reorderRows(currentIndex, newIndex);
    }
  };

  return (
    <div className="row-manager mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Rows
        </h3>
        <button
          onClick={addRow}
          className="flex items-center px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiPlus className="mr-1" /> Add Row
        </button>
      </div>
      
      <div className="row-list space-y-2">
        {rows.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No rows yet. Add your first row to get started.
          </div>
        ) : (
          rows.map((row, index) => (
            <div 
              key={row.id}
              className={`row-item p-2 border rounded-md flex items-center justify-between
                ${selectedRow === row.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}
              `}
              onClick={() => handleRowSelect(row.id)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium mr-2">
                  {index + 1}
                </div>
                {selectedRow === row.id ? (
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) => handleRowTitleChange(row.id, e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center">
                    <span className="font-medium">{row.title}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({getRowWidgetsCount(row.id)} widgets)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {selectedRow === row.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowTitleChange(row.id, `Row ${index + 1}`);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Edit title"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveRow(row.id, 'up');
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  disabled={index === 0}
                  title="Move up"
                >
                  <FiArrowUp size={14} className={index === 0 ? 'opacity-50' : ''} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveRow(row.id, 'down');
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  disabled={index === rows.length - 1}
                  title="Move down"
                >
                  <FiArrowDown size={14} className={index === rows.length - 1 ? 'opacity-50' : ''} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete row "${row.title}"? This will remove all widgets in this row.`)) {
                      removeRow(row.id);
                    }
                  }}
                  className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete row"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RowManager;
