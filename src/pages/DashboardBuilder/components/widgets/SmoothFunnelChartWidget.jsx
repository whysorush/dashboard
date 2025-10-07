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
import { useThemeStyles } from "../../../../utils/themeUtils";
import { generateMockData } from "../../utils/mockDataGenerator";

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
  total: {
    fontSize: 22,
    fontWeight: 700,
    margin: "6px 0 10px",
    color: "var(--text)",
  },
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
  const {
    styleMode,
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();

  const config = useMemo(
    () =>
      widget?.config || {
        title: "Funnel Chart",
        showGrid: false,
        showLegend: true,
        animations: true,
      },
    [widget?.config]
  );
  const data = useMemo(() => {
    return generateMockData("categories", {
      categories: config.dataPoints || 10,
      includeComparison: config.comparisonPeriod,
      timeRange: config.timeRange || "monthly",
      trend: config.trend || "random",
    });
  }, [config]);

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(config.animations !== false);

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

  // Colors using global theme colors
  const cellColors = useMemo(() => {
    return [
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.primary + "CC",
      colors.secondary + "CC",
      colors.accent + "CC",
      colors.primary + "99",
    ];
  }, [colors]);

  return (
    <div
      style={{
        ...cssVariables,
      }}
      className="chart-container"
    >
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Funnel Chart</h3>
          <div style={styles.total}>{total}</div>
        </div>

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
              contentStyle={tooltipStyle}
              formatter={(val) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(val)
              }
            />
            <Funnel dataKey="value" data={stageData} width={600}>
              <LabelList
                position="inside"
                fill={colors.text}
                stroke="none"
                dataKey="display"
                style={{ fontFamily: "var(--font-family)", fontSize: "12px" }}
              />
              <LabelList
                dataKey="name"
                position="right"
                fill={colors.textSecondary}
                style={{ fontFamily: "var(--font-family)", fontSize: "12px" }}
              />
              {stageData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={cellColors[idx % cellColors.length]}
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SmoothFunnelChartWidget;
