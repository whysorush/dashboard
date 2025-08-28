// src/pages/DashboardBuilder/hooks/useRowBasedLayout.js
import { useMemo, useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';

export const useRowBasedLayout = () => {
  const { widgets, rows, updateWidgetProperty } = useBuilder();

  // Group widgets by row
  const widgetsByRow = useMemo(() => {
    const grouped = {};
    
    // Initialize with empty arrays for all rows
    rows.forEach(row => {
      grouped[row.id] = [];
    });
    
    // Add widgets to their rows
    widgets.forEach(widget => {
      const rowId = widget.position.rowId || rows[0]?.id;
      if (grouped[rowId]) {
        grouped[rowId].push(widget);
      } else {
        // If row doesn't exist, create it
        grouped[rowId] = [widget];
      }
    });
    
    return grouped;
  }, [widgets, rows]);

  // Calculate widget sizes based on row occupancy
  const calculateWidgetSizes = useCallback(() => {
    Object.entries(widgetsByRow).forEach(([rowId, rowWidgets]) => {
      const count = rowWidgets.length;
      
      if (count === 0) return;
      
      // Determine size class based on count
      const sizeClass = count === 1 ? 'large' : count === 2 ? 'medium' : 'small';
      
      // Update all widgets in this row
      rowWidgets.forEach(widget => {
        if (widget.position.size !== sizeClass) {
          updateWidgetProperty(widget.id, 'position.size', sizeClass);
        }
      });
    });
  }, [widgetsByRow, updateWidgetProperty]);

  // Get CSS class for widget size
  const getWidgetSizeClass = useCallback((widget) => {
    const size = widget.position.size || 'medium';
    
    switch (size) {
      case 'large':
        return 'flex-1 w-full';
      case 'medium':
        return 'flex-1 w-1/2';
      case 'small':
        return 'flex-1 w-1/3';
      default:
        return 'flex-1 w-full';
    }
  }, []);

  // Get percentage width for widget
  const getWidgetWidthPercent = useCallback((widget) => {
    const size = widget.position.size || 'medium';
    
    switch (size) {
      case 'large':
        return 100;
      case 'medium':
        return 50;
      case 'small':
        return 33.33;
      default:
        return 100;
    }
  }, []);

  // Get number of widgets allowed in a row
  const getMaxWidgetsPerRow = useCallback((rowId) => {
    const rowWidgets = widgetsByRow[rowId] || [];
    const chartWidgets = rowWidgets.filter(w => w.type.includes('chart'));
    
    // If there are already 3 chart widgets, no more can be added
    if (chartWidgets.length >= 3) return 0;
    
    return 3 - chartWidgets.length;
  }, [widgetsByRow]);

  return {
    widgetsByRow,
    calculateWidgetSizes,
    getWidgetSizeClass,
    getWidgetWidthPercent,
    getMaxWidgetsPerRow
  };
};

export default useRowBasedLayout;
