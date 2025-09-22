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
import { useTheme } from "../../../../context/ThemeContext";

const LineChartWidget = ({ widget, isSelected, onClick }) => {
  // Get theme configuration
  const { themeConfig, styleMode } = useTheme();

  // Generate mock data based on configuration
  const data = useMemo(() => {
    return generateMockData("time-series", {
      points: widget.config?.dataPoints || 12,
      trend: widget.config?.trend || "up",
      timeRange: widget.config?.timeRange || "monthly",
      includeComparison: widget.config?.comparisonPeriod,
    });
  }, [widget.config]);

  // Calculate KPIs from data
  const kpis = useMemo(() => {
    return calculateKPIs(data, widget.config);
  }, [data, widget.config]);

  const handleFilterChange = (key, value) => {
    console.log("Filter changed:", key, value);
  };

  // Calculate height based on widget size
  const chartHeight = useMemo(() => {
    const size = widget.position?.size || "medium";
    return size === "large" ? 350 : size === "medium" ? 300 : 250;
  }, [widget.position?.size]);

  // Determine line colors and styles with theme-aware defaults
  const primaryColor =
    widget.config?.color || themeConfig?.primary || "#27D0FC";
  const secondaryColor =
    widget.config?.secondaryColor || themeConfig?.textSecondary || "#9CA3AF";

  // Calculate average for reference line
  const average = useMemo(() => {
    if (!widget.config?.showAverage) return null;
    return data.reduce((sum, item) => sum + item.value, 0) / data.length;
  }, [data, widget.config?.showAverage]);

  return (
    <div
      className={`line-chart-widget style-mode-${styleMode}`}
      style={{
        fontFamily: "var(--font-family)",
        color: themeConfig?.text,
        backgroundColor: themeConfig?.background,
      }}
    >
      {/* KPIs */}
      {widget.config?.showKPIs !== false && (
        <KPIDisplay
          metrics={kpis}
          config={widget.config}
          position={widget.config?.kpiPosition || "top"}
        />
      )}

      {/* Chart */}
      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            {widget.config?.showGrid !== false && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeConfig?.chartGrid || "#e5e7eb"}
                horizontal={true}
                vertical={false}
              />
            )}
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: themeConfig?.textSecondary || "#6b7280",
                fontFamily: "var(--font-family)",
              }}
              axisLine={{ stroke: themeConfig?.border || "#e5e7eb" }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: themeConfig?.textSecondary || "#6b7280",
                fontFamily: "var(--font-family)",
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: themeConfig?.background || "#ffffff",
                border: `1px solid ${themeConfig?.border || "#e5e7eb"}`,
                borderRadius: "var(--border-radius, 6px)",
                boxShadow: "var(--shadow, 0 2px 5px rgba(0,0,0,0.1))",
                color: themeConfig?.text || "#1f2937",
                fontFamily: "var(--font-family)",
              }}
              cursor={{
                stroke: themeConfig?.textSecondary || "#9CA3AF",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              formatter={(value) => [`${value.toLocaleString()}`, ""]}
            />
            {widget.config?.showLegend !== false && (
              <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" />
            )}

            {/* Average reference line */}
            {average !== null && (
              <ReferenceLine
                y={average}
                stroke={themeConfig?.accent || "#F59E0B"}
                strokeDasharray="3 3"
                label={{
                  value: "Average",
                  position: "insideTopRight",
                  fill: themeConfig?.accent || "#F59E0B",
                  fontSize: 12,
                  fontFamily: "var(--font-family)",
                }}
              />
            )}

            <Line
              name="Current Period"
              type={
                widget.config?.smoothCurves !== false ? "monotone" : "linear"
              }
              dataKey="value"
              stroke={primaryColor}
              strokeWidth={3}
              dot={
                widget.config?.showDataPoints !== false
                  ? { fill: primaryColor, strokeWidth: 2, r: 4 }
                  : false
              }
              activeDot={{
                r: 6,
                stroke: primaryColor,
                strokeWidth: 2,
                fill: "white",
              }}
              animationDuration={widget.config?.animations !== false ? 1500 : 0}
            />

            {/* Second line for comparison if needed */}
            {widget.config?.comparisonPeriod && (
              <Line
                name="Previous Period"
                type={
                  widget.config?.smoothCurves !== false ? "monotone" : "linear"
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

      {/* Filters */}
      {widget.config?.showFilters !== false && (
        <FilterBar config={widget.config} onChange={handleFilterChange} />
      )}
    </div>
  );
};

export default LineChartWidget;
