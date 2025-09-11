// src/pages/DashboardBuilder/components/Canvas.jsx
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDrop } from "react-dnd";
import { useBuilder } from "../context/BuilderContext";
import useRowBasedLayout from "../hooks/useRowBasedLayout";
import WidgetControls from "./WidgetControls";
import QuickAddButton from "./QuickAddButton";
import RowContainer from "./RowContainer";
import RowManager from "./RowManager";
import { WIDGET_TYPES, WIDGET_CATEGORIES } from "../constants";

// Import basic widget components
import LineChartWidget from "./widgets/LineChartWidget";
import BarChartWidget from "./widgets/BarChartWidget";
import AreaChartWidget from "./widgets/AreaChartWidget";
import PieChartWidget from "./widgets/PieChartWidget";
import FunnelChartWidget from "./widgets/FunnelChartWidget";
import KPICardWidget from "./widgets/KPICardWidget";
import DataTableWidget from "./widgets/DataTableWidget";

// Import professional widget components
import ProfessionalKPIWidget from "./widgets/ProfessionalKPIWidget";
import RevenueKPIWidget from "./widgets/RevenueKPIWidget";
import OrdersKPIWidget from "./widgets/OrdersKPIWidget";
import CustomersKPIWidget from "./widgets/CustomersKPIWidget";
import GradientBarChartWidget from "./widgets/GradientBarChartWidget";
import SmoothFunnelChartWidget from "./widgets/SmoothFunnelChartWidget";
import ProfessionalTableWidget from "./widgets/ProfessionalTableWidget";
import AdvancedFilterBarWidget from "./widgets/AdvancedFilterBarWidget";

// Import exact design professional widgets
import ProfessionalBarChartWidget from "./widgets/ProfessionalBarChartWidget";

const Canvas = () => {
  const {
    widgets,
    rows,
    selectedWidget,
    selectedRow,
    gridConfig,
    addWidget,
    addRow,
    updateWidgetPosition,
    savePositionsToHistory,
    setSelectedWidget,
    setSelectedRow,
    setIsDragging,
  } = useBuilder();

  const [quickAddPosition, setQuickAddPosition] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Use the row-based layout hook
  const {
    widgetsByRow,
    calculateWidgetSizes,
    getWidgetSizeClass,
    getMaxWidgetsPerRow,
  } = useRowBasedLayout();

  // Handle adding a widget to a specific row - MOVED UP BEFORE useEffect
  const handleAddWidgetToRow = useCallback(
    (rowId, widgetType = "bar-chart") => {
      // Get widgets in this row to determine position
      const rowWidgets = widgets.filter((w) => w.position.rowId === rowId);
      const widgetsCount = rowWidgets.length;

      // Add widget to the row
      addWidget(
        widgetType,
        {
          rowId: rowId,
          row: rows.findIndex((r) => r.id === rowId),
          index: widgetsCount,
          size:
            widgetsCount >= 2
              ? "small"
              : widgetsCount === 1
              ? "medium"
              : "large",
        },
        rowId
      );
    },
    [widgets, rows, addWidget]
  );

  // Automatically recalculate widget sizes when widgets change
  useEffect(() => {
    calculateWidgetSizes();
  }, [widgets.length, calculateWidgetSizes]);

  // Listen for quickadd events from the ComponentPalette
  useEffect(() => {
    const handleQuickAdd = (event) => {
      const { type, rowId } = event.detail;
      if (type && rowId) {
        handleAddWidgetToRow(rowId, type);
      }
    };

    const canvasElement = document.querySelector(".canvas-container");
    if (canvasElement) {
      canvasElement.addEventListener("quickadd", handleQuickAdd);
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("quickadd", handleQuickAdd);
      }
    };
  }, [handleAddWidgetToRow]); // Now this dependency is properly defined

  // Handle drop from palette
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "widget",
    canDrop: (item, monitor) => {
      // Always allow drops
      return true;
    },
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();

      // If there are no rows, create one first
      if (rows.length === 0) {
        const newRowId = addRow();
        handleAddWidgetToRow(newRowId, item.type);
        return;
      }

      // If we have client offset, try to find the row we're dropping into
      if (clientOffset) {
        const rowElements = document.querySelectorAll(".row-container");
        let targetRow = null;
        let targetRowIndex = -1;

        // Find which row we're dropping into
        for (let i = 0; i < rowElements.length; i++) {
          const rowRect = rowElements[i].getBoundingClientRect();
          if (
            clientOffset.y >= rowRect.top &&
            clientOffset.y <= rowRect.bottom
          ) {
            targetRow = rows[i];
            targetRowIndex = i;
            break;
          }
        }

        // If we found a target row
        if (targetRow) {
          // Check if this row can accept more widgets
          if (getMaxWidgetsPerRow(targetRow.id) > 0) {
            handleAddWidgetToRow(targetRow.id, item.type);
            return;
          } else {
            // For tables, prefer creating a new row instead of finding another row
            if (
              item.type === WIDGET_TYPES.PROFESSIONAL_TABLE ||
              item.type === WIDGET_TYPES.DATA_TABLE
            ) {
              const newRowId = addRow();
              handleAddWidgetToRow(newRowId, item.type);
              return;
            }

            // For other widgets, find the next row with space or use the last row
            let foundRow = false;
            for (let i = 0; i < rows.length; i++) {
              if (getMaxWidgetsPerRow(rows[i].id) > 0) {
                handleAddWidgetToRow(rows[i].id, item.type);
                foundRow = true;
                break;
              }
            }

            // If no row has space, create a new row
            if (!foundRow) {
              const newRowId = addRow();
              handleAddWidgetToRow(newRowId, item.type);
            }
            return;
          }
        }
      }

      // Default: add to the first row that has space
      for (let i = 0; i < rows.length; i++) {
        if (getMaxWidgetsPerRow(rows[i].id) > 0) {
          handleAddWidgetToRow(rows[i].id, item.type);
          return;
        }
      }

      // If all rows are full, create a new row
      const newRowId = addRow();
      handleAddWidgetToRow(newRowId, item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // We're not using react-grid-layout anymore with our row-based approach
  // This is kept as a placeholder for compatibility with existing code
  const layout = [];

  // We're using row-based layout now, so we don't need this function anymore
  const handleLayoutChange = useCallback(() => {
    // No-op function kept for compatibility
  }, []);

  // These handlers are no longer needed with our row-based approach
  // Kept as empty functions for compatibility
  const handleDragStart = useCallback(() => {}, []);
  const handleDragStop = useCallback(() => {}, []);
  const handleResizeStop = useCallback(() => {}, []);

  // Render widget based on type
  const renderWidget = useCallback(
    (widget) => {
      const props = {
        widget,
        isSelected: selectedWidget === widget.id,
        onClick: () => setSelectedWidget(widget.id),
      };

      switch (widget.type) {
        // Exact Design Professional Widgets
        case WIDGET_TYPES.ADVANCED_FILTER_BAR:
          return <AdvancedFilterBarWidget {...props} />;
        case WIDGET_TYPES.REVENUE_KPI:
          return <RevenueKPIWidget {...props} />;
        case WIDGET_TYPES.ORDERS_KPI:
          return <OrdersKPIWidget {...props} />;
        case WIDGET_TYPES.CUSTOMERS_KPI:
          return <CustomersKPIWidget {...props} />;
        case WIDGET_TYPES.GRADIENT_BAR_CHART:
          return <GradientBarChartWidget {...props} />;
        case WIDGET_TYPES.SMOOTH_FUNNEL_CHART:
          return <SmoothFunnelChartWidget {...props} />;
        case WIDGET_TYPES.PROFESSIONAL_TABLE:
          return <ProfessionalTableWidget {...props} />;

        // Basic othetrs widgets
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

        //optional widgets
        case WIDGET_TYPES.PROFESSIONAL_BAR_CHART:
          return <ProfessionalBarChartWidget {...props} />;
        case WIDGET_TYPES.PROFESSIONAL_KPI_CARD:
          return <ProfessionalKPIWidget {...props} />;

        // Professional widgets
        case WIDGET_TYPES.PROFESSIONAL_KPI:
          return <ProfessionalKPIWidget {...props} />;
        default:
          return (
            <div className="widget-placeholder p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">
                Unknown widget type: {widget.type}
              </p>
            </div>
          );
      }
    },
    [selectedWidget, setSelectedWidget]
  );

  // Handle mouse move to show quick add buttons
  const handleMouseMove = useCallback(
    (e) => {
      if (widgets.length === 0) return;

      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = Math.floor(
        (e.clientX - canvasRect.left) / (canvasRect.width / gridConfig.cols)
      );
      const y = Math.floor((e.clientY - canvasRect.top) / gridConfig.rowHeight);

      // Check if position is empty
      const isEmpty = !widgets.some(
        (w) =>
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
    },
    [widgets, gridConfig]
  );

  const handleMouseLeave = useCallback(() => {
    setShowQuickAdd(false);
  }, []);

  return (
    <div
      ref={drop}
      className={`canvas-container relative w-full h-full p-4 ${
        isOver && canDrop ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-4">
        <RowManager />
      </div>

      {rows.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Start Building Your Dashboard
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Add a row first, then add charts to it!
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mb-4">
              1 chart = full width • 2 charts = half each • 3 charts = third
              each
            </p>
            <button
              onClick={addRow}
              className="flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <span className="mr-2">+</span> Add Row
            </button>
          </div>
        </div>
      ) : (
        <div className="rows-container space-y-6">
          {rows.map((row) => {
            const rowWidgets = widgetsByRow[row.id] || [];
            const isRowSelected = selectedRow === row.id;
            const canAddMoreWidgets = getMaxWidgetsPerRow(row.id) > 0;

            // Sort widgets by their index in the row
            rowWidgets.sort((a, b) => a.position.index - b.position.index);

            return (
              <RowContainer
                key={row.id}
                row={row}
                isSelected={isRowSelected}
                onAddWidget={(rowId) => handleAddWidgetToRow(rowId)}
                canAddMore={canAddMoreWidgets}
              >
                {rowWidgets.map((widget) => {
                  // Determine size class based on number of widgets in the row
                  const sizeClass =
                    rowWidgets.length === 1
                      ? "flex-1 w-full"
                      : rowWidgets.length === 2
                      ? "flex-1 w-1/2"
                      : "flex-1 w-1/3";

                  return (
                    <div
                      key={widget.id}
                      className={`widget-container ${sizeClass} ${
                        selectedWidget === widget.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      style={{
                        // Apply specific flex basis based on number of widgets in row
                        flexBasis:
                          rowWidgets.length === 1
                            ? "calc(100% - 8px)"
                            : rowWidgets.length === 2
                            ? "calc(50% - 16px)"
                            : "calc(33.333% - 16px)",
                        // Ensure consistent height within the row
                        height: "100%",
                      }}
                    >
                      {renderWidget(widget)}
                      {selectedWidget === widget.id && (
                        <WidgetControls widgetId={widget.id} />
                      )}
                    </div>
                  );
                })}
              </RowContainer>
            );
          })}

          <div className="flex justify-center mt-6">
            <button
              onClick={addRow}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <span className="mr-2">+</span> Add Row
            </button>
          </div>
        </div>
      )}

      {/* Drop indicator */}
      {isOver && canDrop && (
        <div
          className="absolute inset-0 border-2 border-dashed border-blue-500 
                      bg-blue-500 bg-opacity-10 pointer-events-none rounded-lg"
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
              Drop chart here - Charts will auto-resize based on row occupancy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
