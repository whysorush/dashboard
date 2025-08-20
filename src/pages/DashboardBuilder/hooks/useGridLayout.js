// src/pages/DashboardBuilder/hooks/useGridLayout.js
import { useState, useCallback, useEffect } from 'react';
import { 
  findFreePosition, 
  validatePosition, 
  compactWidgets,
  getLayoutFromWidgets,
  updateWidgetsFromLayout 
} from '../utils/gridHelpers';

export const useGridLayout = (initialWidgets = [], gridConfig = {}) => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [layout, setLayout] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);

  // Default grid configuration
  const config = {
    cols: 12,
    rowHeight: 100,
    margin: [10, 10],
    containerPadding: [20, 20],
    compactType: 'vertical',
    preventCollision: false,
    ...gridConfig
  };

  // Update layout when widgets change
  useEffect(() => {
    setLayout(getLayoutFromWidgets(widgets));
  }, [widgets]);

  // Add a new widget to the grid
  const addWidget = useCallback((widgetType, customPosition = null) => {
    const defaultSizes = {
      'line-chart': { w: 6, h: 4 },
      'bar-chart': { w: 6, h: 4 },
      'area-chart': { w: 6, h: 4 },
      'pie-chart': { w: 4, h: 4 },
      'funnel-chart': { w: 4, h: 4 },
      'kpi-card': { w: 3, h: 2 },
      'data-table': { w: 8, h: 4 }
    };

    const size = defaultSizes[widgetType] || { w: 4, h: 3 };
    const position = customPosition || findFreePosition(widgets, size, config.cols);
    const validatedPosition = validatePosition({ ...position, ...size }, config.cols);

    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      position: validatedPosition,
      config: {
        title: `New ${widgetType.replace('-', ' ')}`,
        showKPIs: true,
        showFilters: true
      }
    };

    setWidgets([...widgets, newWidget]);
    return newWidget;
  }, [widgets, config.cols]);

  // Remove a widget from the grid
  const removeWidget = useCallback((widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  }, [widgets]);

  // Update widget position
  const updateWidgetPosition = useCallback((widgetId, newPosition) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, position: validatePosition(newPosition, config.cols) }
        : widget
    ));
  }, [widgets, config.cols]);

  // Update widget size
  const updateWidgetSize = useCallback((widgetId, newSize) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { 
            ...widget, 
            position: validatePosition({ ...widget.position, ...newSize }, config.cols) 
          }
        : widget
    ));
  }, [widgets, config.cols]);

  // Handle layout change from react-grid-layout
  const handleLayoutChange = useCallback((newLayout) => {
    setLayout(newLayout);
    setWidgets(updateWidgetsFromLayout(widgets, newLayout));
  }, [widgets]);

  // Handle drag start
  const handleDragStart = useCallback((widgetId) => {
    setIsDragging(true);
    setDraggedWidget(widgetId);
  }, []);

  // Handle drag stop
  const handleDragStop = useCallback(() => {
    setIsDragging(false);
    setDraggedWidget(null);
    
    // Compact widgets if enabled
    if (config.compactType) {
      setWidgets(compactWidgets(widgets, config.cols));
    }
  }, [widgets, config.cols, config.compactType]);

  // Handle resize start
  const handleResizeStart = useCallback((widgetId) => {
    setIsResizing(true);
    setDraggedWidget(widgetId);
  }, []);

  // Handle resize stop
  const handleResizeStop = useCallback(() => {
    setIsResizing(false);
    setDraggedWidget(null);
  }, []);

  // Move widget by keyboard
  const moveWidget = useCallback((widgetId, direction) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const newPosition = { ...widget.position };
    const step = 1;

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - step);
        break;
      case 'down':
        newPosition.y = newPosition.y + step;
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - step);
        break;
      case 'right':
        newPosition.x = Math.min(config.cols - newPosition.w, newPosition.x + step);
        break;
      default:
        break;
    }

    updateWidgetPosition(widgetId, newPosition);
  }, [widgets, config.cols, updateWidgetPosition]);

  // Duplicate a widget
  const duplicateWidget = useCallback((widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const newPosition = findFreePosition(widgets, widget.position, config.cols);
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
      position: newPosition
    };

    setWidgets([...widgets, newWidget]);
    return newWidget;
  }, [widgets, config.cols]);

  // Clear all widgets
  const clearGrid = useCallback(() => {
    setWidgets([]);
    setLayout([]);
  }, []);

  // Compact the grid
  const compactGrid = useCallback(() => {
    setWidgets(compactWidgets(widgets, config.cols));
  }, [widgets, config.cols]);

  // Get widget by ID
  const getWidget = useCallback((widgetId) => {
    return widgets.find(w => w.id === widgetId);
  }, [widgets]);

  // Check if position is free
  const isPositionFree = useCallback((position, excludeWidgetId = null) => {
    return !widgets.some(widget => {
      if (widget.id === excludeWidgetId) return false;
      
      const widgetPos = widget.position;
      return !(
        position.x + position.w <= widgetPos.x ||
        widgetPos.x + widgetPos.w <= position.x ||
        position.y + position.h <= widgetPos.y ||
        widgetPos.y + widgetPos.h <= position.y
      );
    });
  }, [widgets]);

  return {
    widgets,
    layout,
    config,
    isDragging,
    isResizing,
    draggedWidget,
    
    // Methods
    addWidget,
    removeWidget,
    updateWidgetPosition,
    updateWidgetSize,
    handleLayoutChange,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    moveWidget,
    duplicateWidget,
    clearGrid,
    compactGrid,
    getWidget,
    isPositionFree,
    
    // Setters
    setWidgets
  };
};