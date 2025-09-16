// src/pages/DashboardBuilder/components/Canvas.jsx
import React, { useCallback, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useBuilder } from "../context/BuilderContext";
import useRowBasedLayout from "../hooks/useRowBasedLayout";
import RowContainer from "./RowContainer";
import RowManager from "./RowManager";
import { WIDGET_TYPES, KPI_WIDGET_TYPES } from "../constants";

// Basic widgets
import LineChartWidget from "./widgets/LineChartWidget";
import BarChartWidget from "./widgets/BarChartWidget";
import AreaChartWidget from "./widgets/AreaChartWidget";
import PieChartWidget from "./widgets/PieChartWidget";
import FunnelChartWidget from "./widgets/FunnelChartWidget";
import KPICardWidget from "./widgets/KPICardWidget";
import DataTableWidget from "./widgets/DataTableWidget";

// Professional widgets
import ProfessionalKPIWidget from "./widgets/ProfessionalKPIWidget";
import RevenueKPIWidget from "./widgets/RevenueKPIWidget";
import OrdersKPIWidget from "./widgets/OrdersKPIWidget";
import CustomersKPIWidget from "./widgets/CustomersKPIWidget";
import GradientBarChartWidget from "./widgets/GradientBarChartWidget";
import SmoothFunnelChartWidget from "./widgets/SmoothFunnelChartWidget";
import ProfessionalTableWidget from "./widgets/ProfessionalTableWidget";
import AdvancedFilterBarWidget from "./widgets/AdvancedFilterBarWidget";
import ProfessionalBarChartWidget from "./widgets/ProfessionalBarChartWidget";

const Canvas = () => {
  const {
    widgets,
    rows,
    selectedWidget,
    selectedRow,
    addWidget,
    addRow,
    setSelectedWidget,
  } = useBuilder();

  const { widgetsByRow, calculateWidgetSizes, getMaxWidgetsPerRow, getMaxKPIWidgetsPerRow } =
    useRowBasedLayout();

  // Add a widget into a specific row with auto size by occupancy
  const handleAddWidgetToRow = useCallback(
    (rowId, widgetType = WIDGET_TYPES.BAR_CHART) => {
      const rowWidgets = widgets.filter((w) => w.position.rowId === rowId);
      const count = rowWidgets.length;

      const isKpi = KPI_WIDGET_TYPES.includes(widgetType);
      const hasAnyKpi = rowWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
      const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));

      // KPI capacity check
      if (isKpi) {
        const kpiCount = rowWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type)).length;
        if (kpiCount >= 4) return;
      }

      // Exclusivity check
      if ((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi)) return;

      addWidget(
        widgetType,
        {
          rowId,
          row: rows.findIndex((r) => r.id === rowId),
          index: count,
          size: count >= 2 ? "small" : count === 1 ? "medium" : "large",
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
                const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
                const capacity = isKpi ? getMaxKPIWidgetsPerRow(candidate.id) : getMaxWidgetsPerRow(candidate.id);

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

  // Render a widget by type
  const renderWidget = useCallback(
    (widget) => {
      const props = {
        widget,
        isSelected: selectedWidget === widget.id,
        onClick: () => setSelectedWidget(widget.id),
      };

      switch (widget.type) {
        // Professional / advanced
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
        case WIDGET_TYPES.PROFESSIONAL_BAR_CHART:
          return <ProfessionalBarChartWidget {...props} />;
        case WIDGET_TYPES.PROFESSIONAL_KPI_CARD:
        case WIDGET_TYPES.PROFESSIONAL_KPI:
          return <ProfessionalKPIWidget {...props} />;

        // Basic
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
            <div className="widget-placeholder p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Unknown widget type: {widget.type}</p>
            </div>
          );
      }
    },
    [selectedWidget, setSelectedWidget]
  );

  return (
    <div
      ref={drop}
      className={`canvas-container relative w-full h-full p-4 ${
        isOver && canDrop ? "bg-blue-50 dark:bg-blue-900/20" : ""
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
              1 chart = full width • 2 charts = half each • 3 charts = third each
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
                : "flex-1 w-1/3";

            return (
              <RowContainer
                key={row.id}
                row={row}
                isSelected={selectedRow === row.id}
                onAddWidget={(rowId) => handleAddWidgetToRow(rowId)}
                canAddMore={getMaxWidgetsPerRow(row.id) > 0}
              >
                {rowWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={`widget-container ${sizeClass} ${
                      selectedWidget === widget.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{
                      flexBasis:
                        rowWidgets.length === 1
                          ? "calc(100% - 8px)"
                          : rowWidgets.length === 2
                          ? "calc(50% - 16px)"
                          : "calc(33.333% - 16px)",
                      height: "100%",
                    }}
                  >
                    {renderWidget(widget)}
                  </div>
                ))}
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

      {isOver && canDrop && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-500 bg-opacity-10 pointer-events-none rounded-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
              Drop chart here — charts auto-resize per row
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
