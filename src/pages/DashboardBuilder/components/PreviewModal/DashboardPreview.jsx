// src/pages/DashboardBuilder/components/PreviewModal/DashboardPreview.jsx
import React, { useMemo } from "react";

// Import widget components
import LineChartWidget from "../widgets/LineChartWidget";
import MultiLineChartWidget from "../widgets/MultiLineChartWidget";
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
import { useTheme } from "../../../../context/ThemeContext";

const DashboardPreview = ({
  widgets,
  rows,
  viewMode,
  theme = "light",
  layout = "standard",
}) => {
  // Get theme context for proper theming
  const { themeConfig, isDark } = useTheme();
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
      isPreview: true,
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

      // Basic other widgets
      case WIDGET_TYPES.LINE_CHART:
        return <LineChartWidget {...props} />;
      case WIDGET_TYPES.MULTI_LINE_CHART:
        return <MultiLineChartWidget {...props} />;
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

  // Dynamic styles based on theme
  const containerStyles = {
    backgroundColor:
      themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#1f2937"),
    minHeight: "100%",
  };

  const headerStyles = {
    padding: "20px",
    borderBottom: `1px solid ${
      themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")
    }`,
    backgroundColor: themeConfig?.surface || (isDark ? "#111827" : "#f8fafc"),
  };

  const titleStyles = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#1f2937"),
    margin: "0 0 8px 0",
  };

  const subtitleStyles = {
    fontSize: "0.875rem",
    color: themeConfig?.textSecondary || (isDark ? "#d1d5db" : "#6b7280"),
    margin: 0,
  };

  return (
    <div style={containerStyles}>
      <div>
        {rows.map((row) => {
          const rowWidgets = (widgetsByRow[row.id] || []).sort(
            (a, b) => a.position.index - b.position.index
          );
          if (rowWidgets.length === 0) return null;

          return (
            <div key={row.id}>
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
                    <div
                      className={isDark ? "dark" : ""}
                      style={{
                        borderRadius: "8px",

                        height: "100%",
                      }}
                    >
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
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor:
              themeConfig?.surface || (isDark ? "#111827" : "#f8fafc"),
            borderRadius: "8px",
            margin: "20px",
            border: `1px solid ${
              themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")
            }`,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📊</div>
          <h3
            style={{
              color: themeConfig?.text || (isDark ? "#f9fafb" : "#1f2937"),
              margin: "0 0 8px 0",
              fontSize: "1.25rem",
            }}
          >
            No widgets to preview
          </h3>
          <p
            style={{
              color:
                themeConfig?.textSecondary || (isDark ? "#d1d5db" : "#6b7280"),
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            Add widgets to your dashboard to see a preview
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPreview;
