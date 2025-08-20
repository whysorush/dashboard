// src/pages/DashboardBuilder/utils/gridHelpers.js

/**
 * Generate a unique ID for widgets
 */
export const generateUniqueId = () => {
    return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  /**
   * Check if two positions overlap
   */
  export const checkCollision = (pos1, pos2) => {
    return !(
      pos1.x + pos1.w <= pos2.x ||
      pos2.x + pos2.w <= pos1.x ||
      pos1.y + pos1.h <= pos2.y ||
      pos2.y + pos2.h <= pos1.y
    );
  };
  
  /**
   * Find a free position for a new widget
   */
  export const findFreePosition = (widgets, newWidget, gridCols = 12) => {
    const maxY = Math.max(0, ...widgets.map(w => w.position.y + w.position.h));
    
    // Try to place on the same row first
    for (let y = 0; y <= maxY + 1; y++) {
      for (let x = 0; x <= gridCols - newWidget.w; x++) {
        const testPos = { x, y, w: newWidget.w, h: newWidget.h };
        const hasCollision = widgets.some(w => checkCollision(w.position, testPos));
        
        if (!hasCollision) {
          return testPos;
        }
      }
    }
    
    // If no free space, place at the bottom
    return {
      x: 0,
      y: maxY,
      w: newWidget.w,
      h: newWidget.h
    };
  };
  
  /**
   * Snap position to grid
   */
  export const snapToGrid = (x, y, gridSize = 10) => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };
  
  /**
   * Calculate grid position from pixel coordinates
   */
  export const pixelsToGrid = (x, y, colWidth, rowHeight) => {
    return {
      gridX: Math.round(x / colWidth),
      gridY: Math.round(y / rowHeight)
    };
  };
  
  /**
   * Calculate pixel coordinates from grid position
   */
  export const gridToPixels = (gridX, gridY, colWidth, rowHeight) => {
    return {
      x: gridX * colWidth,
      y: gridY * rowHeight
    };
  };
  
  /**
   * Get the bounds of all widgets
   */
  export const getWidgetsBounds = (widgets) => {
    if (widgets.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
    
    const minX = Math.min(...widgets.map(w => w.position.x));
    const minY = Math.min(...widgets.map(w => w.position.y));
    const maxX = Math.max(...widgets.map(w => w.position.x + w.position.w));
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h));
    
    return { minX, minY, maxX, maxY };
  };
  
  /**
   * Validate widget position
   */
  export const validatePosition = (position, gridCols = 12, gridRows = Infinity) => {
    const validated = { ...position };
    
    // Ensure position is within grid bounds
    validated.x = Math.max(0, Math.min(validated.x, gridCols - validated.w));
    validated.y = Math.max(0, validated.y);
    
    // Ensure size is valid
    validated.w = Math.max(1, Math.min(validated.w, gridCols));
    validated.h = Math.max(1, validated.h);
    
    // Adjust width if it extends beyond grid
    if (validated.x + validated.w > gridCols) {
      validated.w = gridCols - validated.x;
    }
    
    return validated;
  };
  
  /**
   * Compact widgets vertically to remove gaps
   */
  export const compactWidgets = (widgets, gridCols = 12) => {
    const sorted = [...widgets].sort((a, b) => {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      }
      return a.position.x - b.position.x;
    });
    
    const compacted = [];
    
    sorted.forEach(widget => {
      const newPos = { ...widget.position };
      
      // Try to move widget up as much as possible
      while (newPos.y > 0) {
        const testPos = { ...newPos, y: newPos.y - 1 };
        const hasCollision = compacted.some(w => checkCollision(w.position, testPos));
        
        if (hasCollision) {
          break;
        }
        newPos.y--;
      }
      
      compacted.push({ ...widget, position: newPos });
    });
    
    return compacted;
  };
  
  /**
   * Distribute widgets evenly in a grid
   */
  export const distributeWidgets = (widgets, gridCols = 12) => {
    const distributed = [];
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    
    widgets.forEach(widget => {
      if (currentX + widget.position.w > gridCols) {
        currentX = 0;
        currentY += rowHeight;
        rowHeight = 0;
      }
      
      distributed.push({
        ...widget,
        position: {
          ...widget.position,
          x: currentX,
          y: currentY
        }
      });
      
      currentX += widget.position.w;
      rowHeight = Math.max(rowHeight, widget.position.h);
    });
    
    return distributed;
  };
  
  /**
   * Align widgets to a specific edge
   */
  export const alignWidgets = (widgets, alignment = 'left') => {
    const bounds = getWidgetsBounds(widgets);
    
    return widgets.map(widget => {
      const newPos = { ...widget.position };
      
      switch (alignment) {
        case 'left':
          newPos.x = bounds.minX;
          break;
        case 'right':
          newPos.x = bounds.maxX - widget.position.w;
          break;
        case 'top':
          newPos.y = bounds.minY;
          break;
        case 'bottom':
          newPos.y = bounds.maxY - widget.position.h;
          break;
        case 'center-horizontal':
          newPos.x = Math.floor((bounds.maxX - bounds.minX - widget.position.w) / 2);
          break;
        case 'center-vertical':
          newPos.y = Math.floor((bounds.maxY - bounds.minY - widget.position.h) / 2);
          break;
        default:
          break;
      }
      
      return { ...widget, position: newPos };
    });
  };
  
  /**
   * Resize widget within grid bounds
   */
  export const resizeWidget = (widget, newSize, gridCols = 12) => {
    const validated = {
      w: Math.max(1, Math.min(newSize.w, gridCols - widget.position.x)),
      h: Math.max(1, newSize.h)
    };
    
    return {
      ...widget,
      position: {
        ...widget.position,
        w: validated.w,
        h: validated.h
      }
    };
  };
  
  /**
   * Get layout from widgets array for react-grid-layout
   */
  export const getLayoutFromWidgets = (widgets) => {
    return widgets.map(widget => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      static: widget.locked || false,
      minW: 1,
      minH: 1,
      maxW: 12
    }));
  };
  
  /**
   * Update widgets from react-grid-layout changes
   */
  export const updateWidgetsFromLayout = (widgets, layout) => {
    return widgets.map(widget => {
      const layoutItem = layout.find(item => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h
          }
        };
      }
      return widget;
    });
  };