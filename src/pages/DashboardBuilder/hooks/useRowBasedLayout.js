// src/pages/DashboardBuilder/hooks/useRowBasedLayout.js
import { useMemo, useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { KPI_WIDGET_TYPES, TABLE_WIDGET_TYPES } from '../constants';

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
      const sizeClass = count === 1 ? 'large' : count === 2 ? 'medium' : count <= 4 ? 'small' : 'extra-small';
      
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
      case 'extra-small':
        return 'flex-1 w-1/4';
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
      case 'extra-small':
        return 25;
      default:
        return 100;
    }
  }, []);

  // Updated: number of widgets allowed in a row based on widget type
  const getMaxWidgetsPerRow = useCallback((rowId) => {
    const rowWidgets = widgetsByRow[rowId] || [];
    const kpiWidgets = rowWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type));
    const hasAnyKpi = kpiWidgets.length > 0;
    const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
    const hasAnyTable = rowWidgets.some(w => TABLE_WIDGET_TYPES.includes(w.type));
    
    // If the row contains a table, it cannot accept any more widgets
    if (hasAnyTable) return 0;
    
    if (hasAnyKpi) {
      // KPI rows can have up to 4 widgets total
      if (rowWidgets.length >= 4) return 0;
      return 4 - rowWidgets.length;
    } else {
      // Non-KPI rows can have up to 2 widgets total
      if (rowWidgets.length >= 2) return 0;
      return 2 - rowWidgets.length;
    }
  }, [widgetsByRow]);

  // New: number of KPI widgets allowed in a row (max 4)
  const getMaxKPIWidgetsPerRow = useCallback((rowId) => {
    const rowWidgets = widgetsByRow[rowId] || [];
    const kpiWidgets = rowWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type));
    if (kpiWidgets.length >= 4) return 0;
    return 4 - kpiWidgets.length;
  }, [widgetsByRow]);

  return {
    widgetsByRow,
    calculateWidgetSizes,
    getWidgetSizeClass,
    getWidgetWidthPercent,
    getMaxWidgetsPerRow,
    getMaxKPIWidgetsPerRow,
  };
};

export default useRowBasedLayout;
