// src/pages/DashboardBuilder/components/PreviewModal/DashboardPreview.jsx
import React, { useMemo } from "react";

// Import widget components
import LineChartWidget from "../widgets/LineChartWidget";
import BarChartWidget from "../widgets/BarChartWidget";
import AreaChartWidget from "../widgets/AreaChartWidget";
import PieChartWidget from "../widgets/PieChartWidget";
import FunnelChartWidget from "../widgets/FunnelChartWidget";
import KPICardWidget from "../widgets/KPICardWidget";
import DataTableWidget from "../widgets/DataTableWidget";

// Import professional widget components
import ProfessionalKPIWidget from "../widgets/ProfessionalKPIWidget";
import RevenueKPIWidget from "../widgets/RevenueKPIWidget";
import OrdersKPIWidget from "../widgets/OrdersKPIWidget";
import CustomersKPIWidget from "../widgets/CustomersKPIWidget";
import GradientBarChartWidget from "../widgets/GradientBarChartWidget";
import SmoothFunnelChartWidget from "../widgets/SmoothFunnelChartWidget";
import ProfessionalTableWidget from "../widgets/ProfessionalTableWidget";
import AdvancedFilterBarWidget from "../widgets/AdvancedFilterBarWidget";

// Import exact design professional widgets

import { WIDGET_TYPES } from "../../constants";

const DashboardPreview = ({
  widgets,
  rows,
  viewMode,
  theme = "light",
  layout = "standard",
}) => {
  // Group widgets by row
  const widgetsByRow = useMemo(() => {
    const grouped = {};
    rows.forEach((row) => {
      grouped[row.id] = [];
    });
    widgets.forEach((widget) => {
      const rowId = (widget.position && widget.position.rowId) || rows[0]?.id;
      if (grouped[rowId]) grouped[rowId].push(widget);
    });
    return grouped;
  }, [widgets, rows]);

  // Width class logic replaced by inline-friendly tokens (no class names returned)
  const GAP_PX = 8;
  const getColumnsForRow = (count) => {
    if (viewMode === "mobile") return 1;
    if (viewMode === "tablet") return Math.min(2, count);
    return Math.min(3, count);
  };
  // Flex-basis style (kept)

  const getWidgetFlexBasis = (rowWidgets) => {
    const cols = getColumnsForRow(rowWidgets.length);
    const totalGap = (cols - 1) * GAP_PX;
    return { flexBasis: `calc((100% - ${totalGap}px) / ${cols})` };
  };
  // Render widget based on type
  const renderWidget = (widget) => {
    const props = {
      widget,
      isSelected: false,
      onClick: () => {},
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
     
      case WIDGET_TYPES.PROFESSIONAL_KPI_CARD:
        return <ProfessionalKPIWidget {...props} />;

      // Professional widgets
      case WIDGET_TYPES.PROFESSIONAL_KPI:
        return <ProfessionalKPIWidget {...props} />;
      default:
        return (
          <div className="widget-placeholder p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Unknown widget type: {widget.type}</p>
          </div>
        );
    }
  };

  // No-op spacing helper (since all class names removed)

  return (
    <div>
      {/* Header */}
      <div>
        <h1>
          <span />
          {viewMode === "desktop"
            ? "Desktop"
            : viewMode === "tablet"
            ? "Tablet"
            : "Mobile"}{" "}
          Preview
        </h1>
        <div>
          <span>
            {viewMode === "desktop"
              ? "Full Width"
              : viewMode === "tablet"
              ? "768px"
              : "375px"}
          </span>
          <span />
          <span>{layout}</span>
        </div>
      </div>

      {/* Rows */}
      <div>
        {rows.map((row) => {
          const rowWidgets = (widgetsByRow[row.id] || []).sort(
            (a, b) => a.position.index - b.position.index
          );
          if (rowWidgets.length === 0) return null;

          return (
            <div key={row.id}>
              {/* Row container */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "stretch",
                  margin: "24px 0px",
                  gap: `${GAP_PX}px`, // ✅ use gap instead of per-item margins
                }}
              >
                {rowWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    style={{
                      ...getWidgetFlexBasis(rowWidgets),
                      height: "100%",
                    }}
                  >
                    <div className={theme === "dark" ? "dark" : ""}>
                      {renderWidget(widget)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {widgets.length === 0 && (
        <div>
          <div>📊</div>
          <h3>No widgets to preview</h3>
          <p>Add widgets to your dashboard to see a preview</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPreview;
