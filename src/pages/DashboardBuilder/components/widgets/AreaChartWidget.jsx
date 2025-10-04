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
import BaseWidget from "./BaseWidget";
import KPIDisplay from "./KPIDisplay";
import FilterBar from "./FilterBar";
import { generateMockData, calculateKPIs } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";

const AreaChartWidget = ({ widget, isSelected, onClick }) => {
  const {
    getChartColors,
    getStyleProperties,
    getCSSVariables,
    getChartHeight,
    getGradientColors,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();

  const data = useMemo(() => {
    return generateMockData("time-series", {
      points: widget.config?.dataPoints || 12,
      trend: "increasing",
    });
  }, [widget.config?.dataPoints]);

  const kpis = useMemo(() => {
    return calculateKPIs(data, widget.config);
  }, [data, widget.config]);

  const handleFilterChange = (key, value) => {
    console.log("Filter changed:", key, value);
  };

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || "medium");
  const gradientColors = getGradientColors(
    colors.primary
  );
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    widget.config?.animations !== false
  );

  return (
    <div
      style={{
        width: "100%",
        height: chartHeight,
        ...cssVariables,
      }}
      className="chart-container"
    >
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
  );
};

export default AreaChartWidget;
