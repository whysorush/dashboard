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
import BaseWidget from "./BaseWidget";
import KPIDisplay from "./KPIDisplay";
import FilterBar from "./FilterBar";
import { generateMockData, calculateKPIs } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";

const LineChartWidget = ({ widget, isSelected, onClick }) => {
  // Get theme configuration
  const {
    styleMode,
    themeConfig,
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
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

  // Calculate KPIs from data
  const kpis = useMemo(() => {
    return calculateKPIs(data, widget?.config);
  }, [data, widget?.config]);

  const handleFilterChange = (key, value) => {
    console.log("Filter changed:", key, value);
  };

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    widget?.config?.animations !== false
  );

  // Determine line colors and styles with theme-aware defaults
  const primaryColor = widget?.config?.color || colors.primary;
  const secondaryColor = widget?.config?.secondaryColor || colors.textSecondary;

  // Calculate average for reference line
  const average = useMemo(() => {
    if (!widget?.config?.showAverage) return null;
    return data.reduce((sum, item) => sum + item.value, 0) / data.length;
  }, [data, widget?.config?.showAverage]);

  return (
    <div
      style={{ width: "100%", height: chartHeight, ...cssVariables }}
      className="chart-container"
    >
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

          {/* Average reference line */}
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

          {/* Second line for comparison if needed */}
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
  );
};

export default LineChartWidget;
