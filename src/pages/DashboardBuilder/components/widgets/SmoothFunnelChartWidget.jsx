// src/pages/DashboardBuilder/components/widgets/SmoothFunnelChartWidget?.jsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  Cell,
} from "recharts";
import BaseWidget from "./BaseWidget";
import { GRADIENT_CHART_COLORS } from "../../constants";

const styles = {
  container: {
    background: "var(--stat-card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { margin: 0, fontSize: 16, color: "var(--text)" },
  select: {
    background: "var(--bg)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "6px 8px",
  },
};

/**
 * Funnel Chart Widget (Recharts FunnelChart)
 */
const SmoothFunnelChartWidget = ({ widget, isSelected, onClick }) => {
  const config = widget?.config || {
    id: "widget-1757576664743-8kc63guf7",
    type: "smooth-funnel-chart",
    position: {
      rowId: "row-widget-1757576664743-hkiu1k3ul",
      row: 2,
      index: 1,
      size: "medium",
    },
    config: {
      title: "Funnel Chart",
      startColor: "#00E5FF",
      endColor: "#00FF85",
      showGrid: false,
      showLegend: true,
      animations: true,
    },
  };

  // Stage data for the funnel (top -> bottom)
  const stageData = useMemo(
    () => [
      { name: "Manufacturing", value: 30000, display: "30,000" },
      { name: "Marketing", value: 25000, display: "25,000" },
      { name: "Branding", value: 35000, display: "35,000" },
      { name: "Sales", value: 20000, display: "20,000" },
      { name: "Distribution", value: 15000, display: "15,000" },
      { name: "Customer Service", value: 10000, display: "10,000" },
      { name: "Retention", value: 5000, display: "5,000" },
    ],
    []
  );

  // Colors
  const gradientColors = useMemo(() => {
    return {
      startColor:
        config.startColor || GRADIENT_CHART_COLORS.FUNNEL_CHART.startColor,
      endColor: config.endColor || GRADIENT_CHART_COLORS.FUNNEL_CHART.endColor,
    };
  }, [config.startColor, config.endColor]);

  // Build a small palette from start->end for cells
  const cellColors = useMemo(() => {
    return [
      gradientColors.startColor,
      gradientColors.endColor + "CC",
      gradientColors.endColor,
    ];
  }, [gradientColors]);

  // Height by widget size
  const chartHeight = useMemo(() => {
    const size = widget?.position?.size || "medium";
    return size === "large" ? 350 : size === "medium" ? 300 : 250;
  }, [widget?.position?.size]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Funnel Chart</h3>
        <select style={styles.select}>
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>
      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer>
          <FunnelChart>
            <Tooltip
              formatter={(val) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(val)
              }
            />
            <Funnel dataKey="value" data={stageData} width={600}>
              <LabelList position="inside" fill="#fff" stroke="none" dataKey="display" />
              <LabelList dataKey="name" position="right" fill="#525252" />
              {stageData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={cellColors[idx % cellColors.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SmoothFunnelChartWidget;
