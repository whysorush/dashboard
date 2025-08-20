// src/pages/DashboardBuilder/components/Canvas.jsx
import React, { useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import { useBuilder } from '../context/BuilderContext';
import WidgetControls from './WidgetControls';
import QuickAddButton from './QuickAddButton';
import { WIDGET_TYPES } from '../constants';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import widget components
import LineChartWidget from './widgets/LineChartWidget';
import BarChartWidget from './widgets/BarChartWidget';
import AreaChartWidget from './widgets/AreaChartWidget';
import PieChartWidget from './widgets/PieChartWidget';
import FunnelChartWidget from './widgets/FunnelChartWidget';
import KPICardWidget from './widgets/KPICardWidget';
import DataTableWidget from './widgets/DataTableWidget';

const Canvas = () => {
  const {
    widgets,
    selectedWidget,
    gridConfig,
    addWidget,
    updateWidgetPosition,
    savePositionsToHistory,
    setSelectedWidget,
    setIsDragging
  } = useBuilder();

  const [quickAddPosition, setQuickAddPosition] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Handle drop from palette
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'widget',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const canvasRect = document.querySelector('.canvas-container').getBoundingClientRect();
      
      if (clientOffset && canvasRect) {
        const x = Math.floor((clientOffset.x - canvasRect.left) / (canvasRect.width / gridConfig.cols));
        const y = Math.floor((clientOffset.y - canvasRect.top) / gridConfig.rowHeight);
        
        addWidget(item.type, {
          x: Math.max(0, Math.min(x, gridConfig.cols - item.defaultSize.w)),
          y: Math.max(0, y),
          ...item.defaultSize
        });
      } else {
        addWidget(item.type);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  // Generate layout for react-grid-layout
  const layout = widgets.map(widget => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    static: widget.locked || false,
    minW: 2,
    minH: 2,
    maxW: 12
  }));

  // Handle layout change
  const handleLayoutChange = useCallback((newLayout) => {
    newLayout.forEach(item => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget && (
        widget.position.x !== item.x ||
        widget.position.y !== item.y ||
        widget.position.w !== item.w ||
        widget.position.h !== item.h
      )) {
        updateWidgetPosition(item.i, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        });
      }
    });
  }, [widgets, updateWidgetPosition]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  // Handle drag stop
  const handleDragStop = useCallback(() => {
    setIsDragging(false);
    savePositionsToHistory();
  }, [setIsDragging, savePositionsToHistory]);

  // Handle resize stop
  const handleResizeStop = useCallback(() => {
    savePositionsToHistory();
  }, [savePositionsToHistory]);

  // Render widget based on type
  const renderWidget = useCallback((widget) => {
    const props = {
      widget,
      isSelected: selectedWidget === widget.id,
      onClick: () => setSelectedWidget(widget.id)
    };

    switch (widget.type) {
      case WIDGET_TYPES.LINE_CHART:
        return <LineChartWidget {...props} />;
      case WIDGET_TYPES.BAR_CHART:
        return <BarChartWidget {...props} />;
      case WIDGET_TYPES.AREA_CHART:
        return <AreaChartWidget {...props} />;
      case WIDGET_TYPES.PIE_CHART:
        return <PieChartWidget {...props} />;
      case WIDGET_TYPES.FUNNEL_CHART:
        return <FunnelChartWidget {...props} />;
      case WIDGET_TYPES.KPI_CARD:
        return <KPICardWidget {...props} />;
      case WIDGET_TYPES.DATA_TABLE:
        return <DataTableWidget {...props} />;
      default:
        return (
          <div className="widget-placeholder">
            <p>Unknown widget type: {widget.type}</p>
          </div>
        );
    }
  }, [selectedWidget, setSelectedWidget]);

  // Handle mouse move to show quick add buttons
  const handleMouseMove = useCallback((e) => {
    if (widgets.length === 0) return;
    
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - canvasRect.left) / (canvasRect.width / gridConfig.cols));
    const y = Math.floor((e.clientY - canvasRect.top) / gridConfig.rowHeight);
    
    // Check if position is empty
    const isEmpty = !widgets.some(w => 
      x >= w.position.x && 
      x < w.position.x + w.position.w &&
      y >= w.position.y && 
      y < w.position.y + w.position.h
    );
    
    if (isEmpty && x >= 0 && x < gridConfig.cols && y >= 0) {
      setQuickAddPosition({ x, y });
      setShowQuickAdd(true);
    } else {
      setShowQuickAdd(false);
    }
  }, [widgets, gridConfig]);

  const handleMouseLeave = useCallback(() => {
    setShowQuickAdd(false);
  }, []);

  return (
    <div 
      ref={drop}
      className={`canvas-container relative w-full h-full p-4 ${
        isOver && canDrop ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {widgets.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Start Building Your Dashboard
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Drag widgets from the palette or click the + button to add them
            </p>
            <QuickAddButton 
              position={{ x: 6, y: 0 }} 
              isLarge 
              className="mx-auto"
            />
          </div>
        </div>
      ) : (
        <>
          <GridLayout
            className="layout"
            layout={layout}
            cols={gridConfig.cols}
            rowHeight={gridConfig.rowHeight}
            width={1200}
            margin={gridConfig.margin}
            containerPadding={gridConfig.containerPadding}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            draggableHandle=".widget-drag-handle"
            compactType={gridConfig.compactType}
            preventCollision={false}
            isDroppable={true}
            useCSSTransforms={true}
            transformScale={1}
          >
            {widgets.map(widget => (
              <div 
                key={widget.id}
                className={`widget-container ${
                  selectedWidget === widget.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {renderWidget(widget)}
                {selectedWidget === widget.id && (
                  <WidgetControls widgetId={widget.id} />
                )}
              </div>
            ))}
          </GridLayout>
          
          {/* Quick Add Button */}
          {showQuickAdd && quickAddPosition && (
            <div
              style={{
                position: 'absolute',
                left: `${(quickAddPosition.x / gridConfig.cols) * 100}%`,
                top: `${quickAddPosition.y * gridConfig.rowHeight}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              <QuickAddButton position={quickAddPosition} />
            </div>
          )}
        </>
      )}
      
      {/* Drop indicator */}
      {isOver && canDrop && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-500 
                      bg-blue-500 bg-opacity-10 pointer-events-none rounded-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              Drop widget here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;