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
  const [selectedWidget, setSelectedWidget] = useState(null);
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
  const addWidget = useCallback((type, position = null) => {
    const newWidget = {
      id: generateUniqueId(),
      type,
      position: position || {
        x: 0,
        y: 0,
        w: type.includes('chart') ? 6 : 3,
        h: type.includes('chart') ? 4 : 2
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

    const newWidgets = [...widgets, newWidget];
    setWidgets(newWidgets);
    saveToHistory(newWidgets);
    setSelectedWidget(newWidget.id);
    
    return newWidget.id;
  }, [widgets, saveToHistory]);

  // Remove widget
  const removeWidget = useCallback((widgetId) => {
    const newWidgets = widgets.filter(w => w.id !== widgetId);
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

  // Update widget property (nested)
  const updateWidgetProperty = useCallback((widgetId, path, value) => {
    const newWidgets = widgets.map(widget => {
      if (widget.id !== widgetId) return widget;
      
      const updatedWidget = { ...widget };
      const pathParts = path.split('.');
      let current = updatedWidget;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current[pathParts[i]] = { ...current[pathParts[i]] };
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      return updatedWidget;
    });
    
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

  // Clear all widgets
  const clearCanvas = useCallback(() => {
    setWidgets([]);
    setSelectedWidget(null);
    saveToHistory([]);
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

  const value = {
    // State
    widgets,
    selectedWidget,
    isDragging,
    gridConfig,
    history,
    historyIndex,
    
    // Actions
    addWidget,
    removeWidget,
    updateWidget,
    updateWidgetProperty,
    updateWidgetPosition,
    savePositionsToHistory,
    duplicateWidget,
    toggleLockWidget,
    clearCanvas,
    undo,
    redo,
    selectAll,
    
    // Setters
    setSelectedWidget,
    setIsDragging
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};