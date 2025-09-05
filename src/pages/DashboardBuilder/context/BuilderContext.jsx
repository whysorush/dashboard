// src/pages/DashboardBuilder/context/BuilderContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateUniqueId } from '../utils/gridHelpers';

const BuilderContext = createContext();

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
};

export const BuilderProvider = ({ children }) => {
  const [widgets, setWidgets] = useState([]);
  const [rows, setRows] = useState([{ id: 'row-1', title: 'Row 1' }]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [gridConfig] = useState({
    cols: 12,
    rowHeight: 100,
    margin: [10, 10],
    containerPadding: [20, 20],
    compactType: 'vertical'
  });

  // Save to history for undo/redo
  const saveToHistory = useCallback((newWidgets) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newWidgets);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Add widget
  const addWidget = useCallback((type, position = null, rowId = null) => {
    // If no rowId provided, use the first row or create one
    const targetRowId = rowId || (rows.length > 0 ? rows[0].id : 'row-1');
    
    // If the row doesn't exist, create it
    if (!rows.find(r => r.id === targetRowId)) {
      setRows(prevRows => [...prevRows, { 
        id: targetRowId, 
        title: `Row ${prevRows.length + 1}` 
      }]);
    }
    
    // Find widgets in the same row to calculate position
    const rowWidgets = widgets.filter(w => w.position.rowId === targetRowId);
    const widgetsCount = rowWidgets.length;
    
    // Calculate index based on widgets in row (0 for first, 1 for second, 2 for third)
    // Max 3 widgets per row
    const index = position?.index ?? Math.min(widgetsCount, 2);
    
    // Determine size based on how many widgets will be in the row after adding this one
    let size;
    let updatedWidgets = [...widgets];
    
    if (widgetsCount === 0) {
      size = 'large';  // First widget in row = 100% width
    } else if (widgetsCount === 1) {
      size = 'medium'; // Second widget in row = 50% width
      
      // Also update the existing widget to be medium size
      const existingWidget = rowWidgets[0];
      if (existingWidget && existingWidget.position.size === 'large') {
        updatedWidgets = updatedWidgets.map(w => {
          if (w.id === existingWidget.id) {
            return {
              ...w,
              position: {
                ...w.position,
                size: 'medium'
              }
            };
          }
          return w;
        });
      }
    } else {
      size = 'small';  // Third widget in row = 33.33% width
      
      // Update all widgets in this row to be small size
      updatedWidgets = updatedWidgets.map(w => {
        if (w.position.rowId === targetRowId && w.position.size !== 'small') {
          return {
            ...w,
            position: {
              ...w.position,
              size: 'small'
            }
          };
        }
        return w;
      });
    }
    
    const newWidget = {
      id: generateUniqueId(),
      type,
      position: position || {
        rowId: targetRowId,
        row: rows.findIndex(r => r.id === targetRowId),
        index: index,
        size: size
      },
      config: {
        title: `New ${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        subtitle: '',
        showKPIs: true,
        showFilters: true,
        color: '#3B82F6',
        dataPoints: 12,
        refreshInterval: 0,
        aggregation: 'sum',
        timeRange: 'monthly',
        kpiMetrics: ['total', 'average', 'growth'],
        numberFormat: 'number'
      },
      locked: false
    };

  // Add the new widget to the updated widgets array
  const finalWidgets = [...updatedWidgets, newWidget];
  setWidgets(finalWidgets);
  saveToHistory(finalWidgets);
  setSelectedWidget(newWidget.id);
  
  return newWidget.id;
}, [widgets, rows, saveToHistory]);

// Add new method for row-based position updates:
const updateWidgetRowPosition = useCallback((widgetId, newRow, newIndex) => {
  const newWidgets = widgets.map(widget => {
    if (widget.id === widgetId) {
      return {
        ...widget,
        position: {
          row: newRow,
          index: newIndex
        }
      };
    }
    return widget;
  });
  
  setWidgets(newWidgets);
  saveToHistory(newWidgets);
}, [widgets, saveToHistory]);


  // Remove widget
  const removeWidget = useCallback((widgetId) => {
    const widgetToRemove = widgets.find(w => w.id === widgetId);
    
    if (!widgetToRemove) return;
    
    const rowId = widgetToRemove.position.rowId;
    const newWidgets = widgets.filter(w => w.id !== widgetId);
    
    // Get remaining widgets in the same row
    const rowWidgets = newWidgets.filter(w => w.position.rowId === rowId);
    const widgetsCount = rowWidgets.length;
    
    // Update sizes of remaining widgets in the row
    if (widgetsCount === 1) {
      // If only one widget left, make it large (100% width)
     const newWidgets = newWidgets.map(w => {
        if (w.id === rowWidgets[0].id) {
          return {
            ...w,
            position: {
              ...w.position,
              size: 'large'
            }
          };
        }
        return w;
      });
    } else if (widgetsCount === 2) {
      // If two widgets left, make them medium (50% width each)
      newWidgets = newWidgets.map(w => {
        if (w.position.rowId === rowId && w.position.size !== 'medium') {
          return {
            ...w,
            position: {
              ...w.position,
              size: 'medium'
            }
          };
        }
        return w;
      });
    }
    
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
    
    if (selectedWidget === widgetId) {
      setSelectedWidget(null);
    }
  }, [widgets, selectedWidget, saveToHistory]);

  // Update widget
  const updateWidget = useCallback((widgetId, updates) => {
    const newWidgets = widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, ...updates }
        : widget
    );
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
  }, [widgets, saveToHistory]);

  // Update widget position
  const updateWidgetPosition = useCallback((widgetId, position) => {
    const newWidgets = widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, position }
        : widget
    );
    setWidgets(newWidgets);
    // Don't save to history for every drag, only on drop
  }, [widgets]);

  // Save position changes to history (call on drag end)
  const savePositionsToHistory = useCallback(() => {
    saveToHistory(widgets);
  }, [widgets, saveToHistory]);

  // Duplicate widget
  const duplicateWidget = useCallback((widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    const newWidget = {
      ...widget,
      id: generateUniqueId(),
      position: {
        ...widget.position,
        x: (widget.position.x + 1) % (gridConfig.cols - widget.position.w + 1),
        y: widget.position.y + widget.position.h + 1
      },
      config: { ...widget.config }
    };
    
    const newWidgets = [...widgets, newWidget];
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
    setSelectedWidget(newWidget.id);
    
    return newWidget.id;
  }, [widgets, gridConfig.cols, saveToHistory]);

  // Lock/Unlock widget
  const toggleLockWidget = useCallback((widgetId) => {
    const newWidgets = widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, locked: !widget.locked }
        : widget
    );
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
  }, [widgets, saveToHistory]);

  // Clear all widgets and rows
  const clearCanvas = useCallback(() => {
    setWidgets([]);
    setRows([]);
    setSelectedWidget(null);
    setSelectedRow(null);
    saveToHistory([]);
  }, [saveToHistory]);
  
  // Load a template (rows and widgets)
  const loadTemplate = useCallback((templateRows, templateWidgets) => {
    // Set rows first
    setRows(templateRows);
    
    // Then set widgets
    setWidgets(templateWidgets);
    
    // Save to history
    saveToHistory(templateWidgets);
  }, [saveToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setWidgets(history[newIndex]);
      setSelectedWidget(null);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setWidgets(history[newIndex]);
      setSelectedWidget(null);
    }
  }, [history, historyIndex]);

  // Select all widgets
  const selectAll = useCallback(() => {
    // For now, just select the first widget
    // Could be extended for multi-select
    if (widgets.length > 0) {
      setSelectedWidget(widgets[0].id);
    }
  }, [widgets]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'a':
            e.preventDefault();
            selectAll();
            break;
          case 'd':
            if (selectedWidget) {
              e.preventDefault();
              duplicateWidget(selectedWidget);
            }
            break;
          case 's':
            e.preventDefault();
            // Save functionality can be added here
            console.log('Save dashboard');
            break;
        }
      } else if (e.key === 'Delete' && selectedWidget) {
        e.preventDefault();
        removeWidget(selectedWidget);
      } else if (e.key === 'Escape') {
        setSelectedWidget(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWidget, undo, redo, selectAll, duplicateWidget, removeWidget]);

  // Add a new row
  const addRow = useCallback(() => {
    const newRow = {
      id: `row-${Date.now()}`,
      title: `Row ${rows.length + 1}`
    };
    setRows([...rows, newRow]);
    return newRow.id;
  }, [rows]);

  // Remove a row and its widgets
  const removeRow = useCallback((rowId) => {
    // Remove all widgets in this row
    const newWidgets = widgets.filter(w => w.position.rowId !== rowId);
    setWidgets(newWidgets);
    
    // Remove the row
    setRows(rows.filter(r => r.id !== rowId));
    saveToHistory(newWidgets);
  }, [widgets, rows, saveToHistory]);

  // Update row properties
  const updateRow = useCallback((rowId, updates) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, ...updates } : row
    ));
  }, [rows]);

  // Reorder rows
  const reorderRows = useCallback((sourceIndex, destinationIndex) => {
    const newRows = Array.from(rows);
    const [removed] = newRows.splice(sourceIndex, 1);
    newRows.splice(destinationIndex, 0, removed);
    
    setRows(newRows);
    
    // Update widget positions to reflect new row order
    const newWidgets = widgets.map(widget => {
      const oldRowIndex = rows.findIndex(r => r.id === widget.position.rowId);
      const newRowIndex = newRows.findIndex(r => r.id === widget.position.rowId);
      
      if (oldRowIndex !== newRowIndex) {
        return {
          ...widget,
          position: {
            ...widget.position,
            row: newRowIndex
          }
        };
      }
      return widget;
    });
    
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
  }, [rows, widgets, saveToHistory]);

  // Recalculate widget sizes in a row
  const recalculateRowWidgetSizes = useCallback((rowId) => {
    const rowWidgets = widgets.filter(w => w.position.rowId === rowId);
    const count = rowWidgets.length;
    
    if (count === 0) return;
    
    // Update sizes based on count: 1 = large (100%), 2 = medium (50%), 3+ = small (33.33%)
    const size = count === 1 ? 'large' : count === 2 ? 'medium' : 'small';
    
    const newWidgets = widgets.map(widget => {
      if (widget.position.rowId === rowId) {
        return {
          ...widget,
          position: {
            ...widget.position,
            size
          }
        };
      }
      return widget;
    });
    
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
  }, [widgets, saveToHistory]);

  const value = {
    // State
    widgets,
    rows,
    selectedWidget,
    selectedRow,
    isDragging,
    gridConfig,
    history,
    historyIndex,
    
    // Widget Actions
    addWidget,
    removeWidget,
    updateWidget,
    // updateWidgetProperty,
    updateWidgetPosition,
    savePositionsToHistory,
    duplicateWidget,
    toggleLockWidget,
    clearCanvas,
    updateWidgetRowPosition,
    
    // Row Actions
    addRow,
    removeRow,
    updateRow,
    reorderRows,
    recalculateRowWidgetSizes,
    
    // Template Actions
    loadTemplate,
    
    // History Actions
    undo,
    redo,
    selectAll,
    
    // Setters
    setSelectedWidget,
    setSelectedRow,
    setIsDragging
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};