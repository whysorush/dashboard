// src/pages/DashboardBuilder/components/widgets/LineChartWidget.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
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

const LineChartWidget = ({ widget }) => {
  // Get theme configuration
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
  } = useThemeStyles();

  // Generate mock data based on configuration
  const data = useMemo(() => {
    return generateMockData("time-series", {
      points: widget?.config?.dataPoints || 12,
      trend: widget?.config?.trend || "up",
      timeRange: widget?.config?.timeRange || "monthly",
      includeComparison: widget?.config?.comparisonPeriod,
    });
  }, [widget?.config]);


  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();

  // Determine line colors and styles - prioritize global colors over widget config
  const primaryColor = colors.primary;
  const secondaryColor = colors.secondary;

  // Calculate average for reference line
  const average = useMemo(() => {
    if (!widget?.config?.showAverage) return null;
    return data.reduce((sum, item) => sum + item.value, 0) / data.length;
  }, [data, widget?.config?.showAverage]);

  // Calculate total for header display
  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  return (
    <div
      style={{ width: "100%", ...cssVariables }}
      className="chart-container"
    >
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Line Chart</h3>
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
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            {widget?.config?.showGrid !== false && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.grid}
                horizontal={true}
                vertical={false}
              />
            )}
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
                fontFamily: "var(--font-family)",
              }}
              axisLine={{ stroke: colors.border }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
                fontFamily: "var(--font-family)",
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{
                stroke: colors.textSecondary,
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              formatter={(value) => [`${value.toLocaleString()}`, ""]}
            />
            {widget?.config?.showLegend !== false && (
              <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" />
            )}
            {average !== null && (
              <ReferenceLine
                y={average}
                stroke={colors.accent}
                strokeDasharray="3 3"
                label={{
                  value: "Average",
                  position: "insideTopRight",
                  fill: colors.accent,
                  fontSize: 12,
                  fontFamily: "var(--font-family)",
                }}
              />
            )}
            <Line
              name="Current Period"
              type={
                widget?.config?.smoothCurves !== false ? "monotone" : "linear"
              }
              dataKey="value"
              stroke={primaryColor}
              strokeWidth={3}
              dot={
                widget?.config?.showDataPoints !== false
                  ? { fill: primaryColor, strokeWidth: 2, r: 4 }
                  : false
              }
              activeDot={{
                r: 6,
                stroke: primaryColor,
                strokeWidth: 2,
                fill: "white",
              }}
              animationDuration={widget?.config?.animations !== false ? 1500 : 0}
            />
            {widget?.config?.comparisonPeriod && (
              <Line
                name="Previous Period"
                type={
                  widget?.config?.smoothCurves !== false ? "monotone" : "linear"
                }
                dataKey="previousValue"
                stroke={secondaryColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: secondaryColor,
                  strokeWidth: 1,
                  fill: "white",
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartWidget;
