// src/pages/DashboardBuilder/components/widgets/MultiLineChartWidget.jsx
import React, { useMemo, memo, useCallback } from "react";
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
import { useGlobalColors } from "../../../../hooks/useGlobalColors";

const MultiLineChartWidget = ({ widget }) => {
  // Get theme configuration
  const { themeConfig, styleMode } = useTheme();
  // Get global colors
  const globalColors = useGlobalColors();
  // Memoize configuration values to prevent unnecessary recalculations
  const config = useMemo(() => ({
    dataPoints: widget?.config?.dataPoints || 12,
    trend: widget?.config?.trend || "up",
    timeRange: widget?.config?.timeRange || "monthly",
    includeComparison: widget?.config?.comparisonPeriod,
    seriesCount: widget?.config?.seriesCount || 3,
    seriesNames: widget?.config?.seriesNames || ["Revenue", "Expenses", "Profit"],
    showKPIs: widget?.config?.showKPIs !== false,
    showFilters: widget?.config?.showFilters !== false,
    showGrid: widget?.config?.showGrid !== false,
    showLegend: widget?.config?.showLegend !== false,
    showDataPoints: widget?.config?.showDataPoints !== false,
    showAverage: widget?.config?.showAverage,
    smoothCurves: widget?.config?.smoothCurves !== false,
    animations: widget?.config?.animations !== false,
    kpiPosition: widget?.config?.kpiPosition || "top",
  }), [widget?.config]);

  // Generate mock data with multiple series - optimized with stable data generation
  const data = useMemo(() => {
    // Use a stable seed for consistent data generation
    const seed = `${config.dataPoints}-${config.trend}-${config.timeRange}`;
    const baseData = generateMockData("time-series", {
      points: config.dataPoints,
      trend: config.trend,
      timeRange: config.timeRange,
      includeComparison: config.includeComparison,
      seed, // Add seed for stable data generation
    });

    // Pre-calculate series multipliers to avoid random calculations in map
    const seriesMultipliers = [];
    for (let i = 1; i < config.seriesCount && i < config.seriesNames.length; i++) {
      seriesMultipliers.push({
        variation: 0.3 + (i * 0.1), // More predictable variation
        trendMultiplier: i === 1 ? 0.8 : 0.6,
      });
    }

    return baseData.map((point) => {
      const multiLinePoint = { ...point };

      // Add multiple data series with pre-calculated multipliers
      seriesMultipliers.forEach((multiplier, i) => {
        const seriesKey = `value${i + 2}`;
        multiLinePoint[seriesKey] = Math.round(
          point.value * multiplier.variation * multiplier.trendMultiplier
        );
      });

      return multiLinePoint;
    });
  }, [config]);

  // Calculate KPIs from the primary data series - memoized with config
  const kpis = useMemo(() => {
    return calculateKPIs(data, config);
  }, [data, config]);

  // Memoized filter change handler
  const handleFilterChange = useCallback((key, value) => {
    console.log("Filter changed:", key, value);
  }, []);

  // Calculate height based on widget size - memoized
  const chartHeight = useMemo(() => {
    const size = widget?.position?.size || "medium";
    return size === "large" ? 350 : size === "medium" ? 300 : 250;
  }, [widget?.position?.size]);

  // Memoize series configuration with global colors support
  const seriesConfig = useMemo(() => {
    // Use global colors with fallbacks
    const defaultColors = [
      globalColors.primary,
      globalColors.secondary,
      globalColors.accent,
    ];
    
    return {
      colors: widget?.config?.seriesColors || defaultColors,
      styles: widget?.config?.seriesStyles || ["solid", "dashed", "dotted"],
      names: config.seriesNames,
      count: config.seriesCount,
    };
  }, [globalColors, widget?.config?.seriesColors, widget?.config?.seriesStyles, config]);

  // Calculate average for reference line (using primary series) - memoized
  const average = useMemo(() => {
    if (!config.showAverage) return null;
    return data.reduce((sum, item) => sum + item.value, 0) / data.length;
  }, [data, config.showAverage]);

  // Memoized stroke dash array function
  const getStrokeDashArray = useCallback((style) => {
    switch (style) {
      case "dashed":
        return "5 5";
      case "dotted":
        return "2 2";
      default:
        return "0";
    }
  }, []);

  return (
    <div
      className={`multi-line-chart-widget style-mode-${styleMode}`}
      style={{
        fontFamily: "var(--font-family)",
        color: themeConfig?.text,
        backgroundColor: themeConfig?.background,
      }}
    >
      {config.showKPIs && (
        <KPIDisplay
          metrics={kpis}
          config={config}
          position={config.kpiPosition}
        />
      )}

      {/* Chart */}
      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            {config.showGrid && (
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
              formatter={(value, name) => [`${value.toLocaleString()}`, name]}
            />
            {config.showLegend && (
              <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" />
            )}

            {/* Average reference line */}
            {average !== null && (
              <ReferenceLine
                y={average}
                stroke={globalColors.accent}
                strokeDasharray="3 3"
                label={{
                  value: "Average",
                  position: "insideTopRight",
                  fill: globalColors.accent,
                  fontSize: 12,
                  fontFamily: "var(--font-family)",
                }}
              />
            )}

            {/* Primary line */}
            <Line
              name={seriesConfig.names[0] || "Series 1"}
              type={config.smoothCurves ? "monotone" : "linear"}
              dataKey="value"
              stroke={seriesConfig.colors[0] || "#25CFFD"}
              strokeWidth={3}
              strokeDasharray={getStrokeDashArray(seriesConfig.styles[0] || "solid")}
              dot={
                config.showDataPoints
                  ? {
                      fill: seriesConfig.colors[0] || "#25CFFD",
                      strokeWidth: 2,
                      r: 4,
                    }
                  : false
              }
              activeDot={{
                r: 6,
                stroke: seriesConfig.colors[0] || "#25CFFD",
                strokeWidth: 2,
                fill: "white",
              }}
              animationDuration={config.animations ? 1500 : 0}
            />

            {/* Additional lines for multi-series */}
            {Array.from(
              { length: Math.min(seriesConfig.count - 1, seriesConfig.names.length - 1) },
              (_, i) => {
                const seriesIndex = i + 1;
                const dataKey = `value${seriesIndex + 1}`;

                return (
                  <Line
                    key={dataKey}
                    name={
                      seriesConfig.names[seriesIndex] || `Series ${seriesIndex + 1}`
                    }
                    type={config.smoothCurves ? "monotone" : "linear"}
                    dataKey={dataKey}
                    stroke={seriesConfig.colors[seriesIndex] || "#9CA3AF"}
                    strokeWidth={2.5}
                    strokeDasharray={getStrokeDashArray(
                      seriesConfig.styles[seriesIndex] || "solid"
                    )}
                    dot={
                      config.showDataPoints
                        ? {
                            fill: seriesConfig.colors[seriesIndex] || "#9CA3AF",
                            strokeWidth: 2,
                            r: 3,
                          }
                        : false
                    }
                    activeDot={{
                      r: 5,
                      stroke: seriesConfig.colors[seriesIndex] || "#9CA3AF",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                    animationDuration={
                      config.animations
                        ? 1500 + seriesIndex * 200
                        : 0
                    }
                  />
                );
              }
            )}

            {/* Comparison line if enabled */}
            {config.includeComparison && (
              <Line
                name="Previous Period"
                type={config.smoothCurves ? "monotone" : "linear"}
                dataKey="previousValue"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#9CA3AF",
                  strokeWidth: 1,
                  fill: "white",
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      {config.showFilters && (
        <FilterBar config={config} onChange={handleFilterChange} />
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MultiLineChartWidget);
