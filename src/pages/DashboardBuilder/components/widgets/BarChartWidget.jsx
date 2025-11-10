// src/pages/DashboardBuilder/components/widgets/BarChartWidget.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BaseWidget from "./BaseWidget";
import KPIDisplay from "./KPIDisplay";
import FilterBar from "./FilterBar";
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

const BarChartWidget = ({ widget }) => {
  const {
    getChartColors,
    getStyleProperties,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();

  // Generate realistic data based on widget config
  const data = useMemo(() => {
    return generateMockData("categories", {
      categories: widget.config?.dataPoints || 5,
      includeComparison: widget.config?.comparisonPeriod,
      timeRange: widget.config?.timeRange || "monthly",
      trend: widget.config?.trend || "up",
    });
  }, [widget.config]);

  // KPIs are available if needed in the future
  // const _kpis = useMemo(() => {
  //   return calculateKPIs(data, widget.config);
  // }, [data, widget.config]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || "medium");
  // const _colorPalette = getColorPalette();
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    widget.config?.animations !== false
  );

  // Determine bar color and styles - prioritize global colors
  const primaryColor = colors.primary;
  const secondaryColor = `${primaryColor}88`; // 50% opacity version

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + (item?.value ?? 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

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
          <h3 style={styles.title}>Bar Chart</h3>
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
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barGap={5}
            barCategoryGap={10}
          >
            {widget.config?.showGrid !== false && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.grid}
                vertical={false}
              />
            )}
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
              }}
              axisLine={{ stroke: colors.border }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            {widget.config?.showLegend !== false && (
              <Legend
                wrapperStyle={{
                  paddingTop: 10,
                  color: colors.text,
                }}
                iconType="circle"
              />
            )}
            <Bar
              name="Current Period"
              dataKey="value"
              fill={primaryColor}
              radius={[
                parseInt(styleProps.borderRadius),
                parseInt(styleProps.borderRadius),
                0,
                0,
              ]}
              animationDuration={animationConfig.duration}
              maxBarSize={60}
            />
            {widget.config?.comparisonPeriod && (
              <Bar
                name="Previous Period"
                dataKey="previousValue"
                fill={secondaryColor}
                radius={[
                  parseInt(styleProps.borderRadius),
                  parseInt(styleProps.borderRadius),
                  0,
                  0,
                ]}
                animationDuration={animationConfig.duration}
                maxBarSize={60}
              />
            )}
            {widget.config?.stacked && (
              <Bar
                name="Secondary Metric"
                dataKey="value2"
                fill={secondaryColor}
                radius={[
                  parseInt(styleProps.borderRadius),
                  parseInt(styleProps.borderRadius),
                  0,
                  0,
                ]}
                stackId="stack"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartWidget;
