// src/pages/DashboardBuilder/components/widgets/AreaChartWidget.jsx
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateMockData } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";

const styles = {
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

const AreaChartWidget = ({ widget }) => {
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();

  const data = useMemo(() => {
    return generateMockData("time-series", {
      points: widget.config?.dataPoints || 12,
      trend: "increasing",
    });
  }, [widget.config?.dataPoints]);

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + (item?.value ?? 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  // const _styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || "medium");
  // const _gradientColors = getGradientColors(colors.primary);
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    widget.config?.animations !== false
  );

  return (
    <div
      style={{
        width: "100%",
        ...cssVariables,
      }}
      className="chart-container"
    >
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Area Chart</h3>
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
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            {widget.config?.showGrid !== false && (
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            )}
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
              }}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
              }}
            />
            <Tooltip contentStyle={tooltipStyle} />
            {widget.config?.showLegend !== false && (
              <Legend
                wrapperStyle={{
                  color: colors.text,
                }}
              />
            )}
            <Area
              type={widget.config?.smoothCurves ? "monotone" : "linear"}
              dataKey="value"
              stroke={colors.primary}
              fill={colors.primary}
              fillOpacity={0.6}
              animationDuration={animationConfig.duration}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartWidget;
