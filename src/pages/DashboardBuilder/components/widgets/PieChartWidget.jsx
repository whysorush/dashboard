import React, { useMemo, memo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BaseWidget from "./BaseWidget";
import KPIDisplay from "./KPIDisplay";
import FilterBar from "./FilterBar";
import { generateMockData, calculateKPIs } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";

const PieChartWidget = memo(({ widget, isSelected, onClick }) => {
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();

  const data = useMemo(() => {
    return generateMockData("pie", {
      segments: 5,
    });
  }, []);

  const kpis = useMemo(() => {
    return calculateKPIs(data, widget?.config);
  }, [data, widget?.config]);

  const handleFilterChange = useCallback((key, value) => {
    console.log("Filter changed:", key, value);
  }, []);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    widget?.config?.animations !== false
  );

  // Function to get colors dynamically based on percentage ranking
  const getDynamicColors = useCallback((data) => {
    // Calculate percentages for all segments
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const segmentsWithPercentages = data.map((entry, index) => ({
      ...entry,
      percentage: entry.value / total,
      originalIndex: index,
    }));

    // Sort by percentage (highest to lowest)
    const sortedSegments = [...segmentsWithPercentages].sort(
      (a, b) => b.percentage - a.percentage
    );

    // Define color palette (highest to lowest)
    const colorPalette = [
      "#27D0FC", // Highest percentage
      "#63E6D5", // Second highest
      "#92FE9D", // Third highest
      "#FFE066", // Fourth highest
      "#FFB3BA", // Fifth highest
      "#c0f0fc", // Lowest percentage
    ];

    // Create color mapping based on ranking
    const colorMap = {};
    sortedSegments.forEach((segment, rank) => {
      colorMap[segment.originalIndex] =
        colorPalette[rank] || colorPalette[colorPalette.length - 1];
    });

    return colorMap;
  }, []);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    },
    []
  );

  return (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      {widget?.config?.showKPIs !== false && (
        <KPIDisplay
          metrics={kpis}
          config={widget?.config}
          position={widget?.config?.kpiPosition || "top"}
        />
      )}

      <div
        style={{
          width: "100%",
          height: chartHeight,
          ...cssVariables,
        }}
        className="chart-container"
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill={colors.primary}
              dataKey="value"
              animationDuration={animationConfig.duration}
            >
              {(() => {
                // Get dynamic color mapping based on percentage ranking
                const colorMap = getDynamicColors(data);

                return data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[index]} />
                ));
              })()}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            {widget?.config?.showLegend !== false && (
              <Legend
                wrapperStyle={{
                  color: colors.text,
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <FilterBar config={widget?.config} onChange={handleFilterChange} />
    </BaseWidget>
  );
});

PieChartWidget.displayName = "PieChartWidget";

export default PieChartWidget;
