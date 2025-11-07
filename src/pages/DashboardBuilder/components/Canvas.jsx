// src/pages/DashboardBuilder/components/Canvas.jsx
import React, { useCallback, useEffect, useRef, lazy, Suspense, memo, useMemo } from "react";
import { useDrop } from "react-dnd";
import { useBuilder } from "../context/BuilderContext";
import useRowBasedLayout from "../hooks/useRowBasedLayout";
import RowContainer from "./RowContainer";
import DraggableRowContainer from "./DraggableRowContainer";
import RowManager from "./RowManager";
import { WIDGET_TYPES, KPI_WIDGET_TYPES } from "../constants";

// Lazy load widgets for better performance
const LineChartWidget = lazy(() => import("./widgets/LineChartWidget"));
const MultiLineChartWidget = lazy(() => import("./widgets/MultiLineChartWidget"));
const BarChartWidget = lazy(() => import("./widgets/BarChartWidget"));
const AreaChartWidget = lazy(() => import("./widgets/AreaChartWidget"));
const PieChartWidget = lazy(() => import("./widgets/PieChartWidget"));
const FunnelChartWidget = lazy(() => import("./widgets/FunnelChartWidget"));
const KPICardWidget = lazy(() => import("./widgets/KPICardWidget"));
const DataTableWidget = lazy(() => import("./widgets/DataTableWidget"));

// Professional widgets
const ProfessionalKPIWidget = lazy(() => import("./widgets/ProfessionalKPIWidget"));
const RevenueKPIWidget = lazy(() => import("./widgets/RevenueKPIWidget"));
const OrdersKPIWidget = lazy(() => import("./widgets/OrdersKPIWidget"));
const CustomersKPIWidget = lazy(() => import("./widgets/CustomersKPIWidget"));
const GradientBarChartWidget = lazy(() => import("./widgets/GradientBarChartWidget"));
const SmoothFunnelChartWidget = lazy(() => import("./widgets/SmoothFunnelChartWidget"));
const ProfessionalTableWidget = lazy(() => import("./widgets/ProfessionalTableWidget"));
const AdvancedFilterBarWidget = lazy(() => import("./widgets/AdvancedFilterBarWidget"));

const Canvas = () => {
  const {
    widgets,
    rows,
    selectedWidget,
    selectedRow,
    addWidget,
    addRow,
    setSelectedWidget,
    moveRowUp,
    moveRowDown,
    canMoveRowUp,
    canMoveRowDown,
  } = useBuilder();

  const { widgetsByRow, calculateWidgetSizes, getMaxWidgetsPerRow, getMaxKPIWidgetsPerRow } =
    useRowBasedLayout();

  // Add a widget into a specific row with auto size by occupancy
  const handleAddWidgetToRow = useCallback(
    (rowId, widgetType = WIDGET_TYPES.BAR_CHART) => {
      const rowWidgets = widgets.filter((w) => w.position.rowId === rowId);
      const count = rowWidgets.length;

      const isKpi = KPI_WIDGET_TYPES.includes(widgetType);
      const isTable = [WIDGET_TYPES.DATA_TABLE, WIDGET_TYPES.PROFESSIONAL_TABLE].includes(widgetType);
      const hasAnyKpi = rowWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
      const hasAnyTable = rowWidgets.some(w => [WIDGET_TYPES.DATA_TABLE, WIDGET_TYPES.PROFESSIONAL_TABLE].includes(w.type));
      const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));

      // Table exclusivity
      if (isTable) {
        if (count > 0) return;
      } else if (hasAnyTable) {
        return;
      }

      // Row capacity check based on widget type
      if (isKpi || hasAnyKpi) {
        // KPI rows can have up to 4 widgets
        if (count >= 4) return;
        // KPI capacity check
        if (isKpi) {
          const kpiCount = rowWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type)).length;
          if (kpiCount >= 4) return;
        }
      } else {
        // Non-KPI rows can have up to 2 widgets
        if (count >= 2) return;
      }

      // Exclusivity check
      if ((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi)) return;

      addWidget(
        widgetType,
        {
          rowId,
          row: rows.findIndex((r) => r.id === rowId),
          index: count,
          size: count >= 3 ? "small" : count >= 1 ? "medium" : "large",
        },
        rowId
      );
    },
    [widgets, rows, addWidget]
  );

  // Keep sizes consistent when widgets change
  useEffect(() => {
    calculateWidgetSizes();
  }, [widgets.length, calculateWidgetSizes]);

  // ---- Duplicate-drop guards (fix double creation) ----
  const isProcessingDropRef = useRef(false);
  const processedDragIdsRef = useRef(new Set());

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "widget",
    canDrop: () => true,
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;

      const clientOffset = monitor.getClientOffset();
      const dragId = item?.dragId;
      if (dragId && processedDragIdsRef.current.has(dragId)) return;
      if (isProcessingDropRef.current) return;
      isProcessingDropRef.current = true;

      try {
        let targetRowId = null;
        const isKpi = KPI_WIDGET_TYPES.includes(item.type);

        if (rows.length === 0) {
          const createdRowId = addRow();
          targetRowId =
            createdRowId || (rows[rows.length - 1] && rows[rows.length - 1].id);
        } else if (clientOffset) {
          const rowEls = document.querySelectorAll(".row-container");
          for (let i = 0; i < rowEls.length; i++) {
            const rect = rowEls[i].getBoundingClientRect();
            if (clientOffset.y >= rect.top && clientOffset.y <= rect.bottom) {
              const candidate = rows[i];
              if (candidate) {
                // Exclusivity and capacity checks
                const rowWidgets = widgets.filter(w => w.position.rowId === candidate.id);
                const hasAnyKpi = rowWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
                const hasAnyTable = rowWidgets.some(w => [WIDGET_TYPES.DATA_TABLE, WIDGET_TYPES.PROFESSIONAL_TABLE].includes(w.type));
                const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
                const capacity = isKpi ? getMaxKPIWidgetsPerRow(candidate.id) : getMaxWidgetsPerRow(candidate.id);

                // Table exclusivity on drop targeting
                const isTable = [WIDGET_TYPES.DATA_TABLE, WIDGET_TYPES.PROFESSIONAL_TABLE].includes(item.type);
                if (hasAnyTable) {
                  // Row already has a table, block any additional widgets
                  break;
                }
                if (isTable && rowWidgets.length > 0) {
                  // Cannot drop a table into a non-empty row
                  break;
                }

                if (capacity > 0 && !((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi))) {
                  targetRowId = candidate.id;
                }
              }
              break;
            }
          }
        }

        if (!targetRowId) {
          const withSpace = rows.find((r) => {
            const rowWidgets = widgets.filter(w => w.position.rowId === r.id);
            const hasAnyKpi = rowWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
            const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
            const cap = isKpi ? getMaxKPIWidgetsPerRow(r.id) : getMaxWidgetsPerRow(r.id);
            if (cap <= 0) return false;
            return !((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi));
          });
          if (withSpace) {
            targetRowId = withSpace.id;
          } else {
            const createdRowId = addRow();
            targetRowId =
              createdRowId || (rows[rows.length - 1] && rows[rows.length - 1].id);
          }
        }

        if (!targetRowId) return;

        handleAddWidgetToRow(targetRowId, item.type);

        if (dragId) processedDragIdsRef.current.add(dragId);
      } finally {
        setTimeout(() => {
          isProcessingDropRef.current = false;
        }, 0);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Memoized widget component map for better performance
  const widgetComponentMap = useMemo(() => ({
    [WIDGET_TYPES.ADVANCED_FILTER_BAR]: AdvancedFilterBarWidget,
    [WIDGET_TYPES.REVENUE_KPI]: RevenueKPIWidget,
    [WIDGET_TYPES.ORDERS_KPI]: OrdersKPIWidget,
    [WIDGET_TYPES.CUSTOMERS_KPI]: CustomersKPIWidget,
    [WIDGET_TYPES.GRADIENT_BAR_CHART]: GradientBarChartWidget,
    [WIDGET_TYPES.SMOOTH_FUNNEL_CHART]: SmoothFunnelChartWidget,
    [WIDGET_TYPES.PROFESSIONAL_TABLE]: ProfessionalTableWidget,
    [WIDGET_TYPES.PROFESSIONAL_KPI_CARD]: ProfessionalKPIWidget,
    [WIDGET_TYPES.PROFESSIONAL_KPI]: ProfessionalKPIWidget,
    [WIDGET_TYPES.LINE_CHART]: LineChartWidget,
    [WIDGET_TYPES.MULTI_LINE_CHART]: MultiLineChartWidget,
    [WIDGET_TYPES.BAR_CHART]: BarChartWidget,
    [WIDGET_TYPES.AREA_CHART]: AreaChartWidget,
    [WIDGET_TYPES.PIE_CHART]: PieChartWidget,
    [WIDGET_TYPES.FUNNEL_CHART]: FunnelChartWidget,
    [WIDGET_TYPES.KPI_CARD]: KPICardWidget,
    [WIDGET_TYPES.DATA_TABLE]: DataTableWidget,
  }), []);

  // Memoized widget renderer
  const WidgetRenderer = memo(({ widget, isSelected, onClick }) => {
    const WidgetComponent = widgetComponentMap[widget.type];

    if (!WidgetComponent) {
      return (
        <div className="widget-placeholder p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Unknown widget type: {widget.type}</p>
        </div>
      );
    }

    return (
      <Suspense fallback={
        <div className="widget-loading p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      }>
        <WidgetComponent 
          widget={widget}
          isSelected={isSelected}
          onClick={onClick}
        />
      </Suspense>
    );
  });

  // Render a widget by type with Suspense for lazy loading
  const renderWidget = useCallback(
    (widget) => {
      return (
        <WidgetRenderer
          widget={widget}
          isSelected={selectedWidget === widget.id}
          onClick={() => setSelectedWidget(widget.id)}
        />
      );
    },
    [selectedWidget, setSelectedWidget]
  );

  return (
    <div
      ref={drop}
      className={`canvas-container relative w-full h-full p-4 ${
        isOver && canDrop ? "aaaaaa dark:bg-blue-900/20" : ""
      }`}
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
              1 widget = full width • 2 widgets = half each • 3 widgets = third each • 4 KPI widgets = quarter each
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
            const rowWidgets = (widgetsByRow[row.id] || []).sort(
              (a, b) => a.position.index - b.position.index
            );

            const sizeClass =
              rowWidgets.length === 1
                ? "flex-1 w-full"
                : rowWidgets.length === 2
                ? "flex-1 w-1/2"
                : rowWidgets.length === 3
                ? "flex-1 w-1/3"
                : "flex-1 w-1/4";

            return (
              <DraggableRowContainer
                key={row.id}
                row={row}
                isSelected={selectedRow === row.id}
                canAddMore={getMaxWidgetsPerRow(row.id) > 0}
                index={rows.findIndex(r => r.id === row.id)}
                onMoveUp={() => moveRowUp(row.id)}
                onMoveDown={() => moveRowDown(row.id)}
                canMoveUp={canMoveRowUp(row.id)}
                canMoveDown={canMoveRowDown(row.id)}
              >
                {rowWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={`widget-container ${sizeClass} ${
                      selectedWidget === widget.id ? "ring-3 ring-blue-500" : ""
                    }`}
                    style={{
                      flexBasis:
                        rowWidgets.length === 1
                          ? "calc(100% - 8px)"
                          : rowWidgets.length === 2
                          ? "calc(50% - 16px)"
                          : rowWidgets.length === 3
                          ? "calc(33.333% - 16px)"
                          : "calc(25% - 16px)",
                      height: "100%",
                    }}
                  >
                    {renderWidget(widget)}
                  </div>
                ))}
              </DraggableRowContainer>
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

      {isOver && canDrop && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-500 bg-opacity-10 pointer-events-none rounded-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
              Drop widget here — widgets auto-resize per row
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
