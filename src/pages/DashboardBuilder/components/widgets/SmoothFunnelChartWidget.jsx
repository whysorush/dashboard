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
import { useThemeStyles } from "../../../../utils/themeUtils";
import { useExcelData } from "../ExcelDataContext";
import { prepareChartSeries } from "../../utils/excelDataTransforms";

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
  const { excelData, excelHeaders } = useExcelData();

  const excelSeries = useMemo(
    () =>
      prepareChartSeries(excelData, excelHeaders, {
        maxValueSeries: 1,
        limit: config.dataPoints ? Math.max(1, config.dataPoints) : undefined,
      }),
    [excelData, excelHeaders, config.dataPoints]
  );

  const fallbackStageData = useMemo(
    () => [
      { name: "Manufacturing", value: 30000 },
      { name: "Marketing", value: 25000 },
      { name: "Branding", value: 35000 },
      { name: "Sales", value: 20000 },
      { name: "Distribution", value: 15000 },
      { name: "Customer Service", value: 10000 },
      { name: "Retention", value: 5000 },
    ],
    []
  );

  const chartData = useMemo(() => {
    if (!excelSeries.hasExcelData) {
      return fallbackStageData.map((entry) => ({
        ...entry,
        display: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(entry.value ?? 0),
      }));
    }

    const sorted = [...excelSeries.data].sort(
      (a, b) => (b.value ?? 0) - (a.value ?? 0)
    );

    return sorted.slice(0, config.maxStages || 7).map((entry) => ({
      name: entry.name,
      value: Number.isFinite(entry.value) ? entry.value : 0,
      display: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(entry.value ?? 0),
    }));
  }, [excelSeries, fallbackStageData, config.maxStages]);

  const total = useMemo(() => {
    const sum = chartData.reduce((acc, item) => acc + (item.value ?? 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [chartData]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(config.animations !== false);

  // Stage data for the funnel (top -> bottom)
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
            <Funnel dataKey="value" data={chartData} width={600}>
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
              {chartData.map((entry, idx) => (
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
