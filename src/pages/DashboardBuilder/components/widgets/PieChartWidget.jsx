import React, { useMemo, memo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateMockData } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";
import { useExcelData } from "../ExcelDataContext";
import { prepareChartSeries } from "../../utils/excelDataTransforms";

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

const PieChartWidget = memo(({ widget }) => {
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();
  const config = widget?.config || {};
  const { excelData, excelHeaders } = useExcelData();

  const excelSeries = useMemo(
    () =>
      prepareChartSeries(excelData, excelHeaders, {
        maxValueSeries: 1,
      }),
    [excelData, excelHeaders]
  );

  const fallbackData = useMemo(
    () =>
      generateMockData("pie", {
        segments: 5,
      }),
    []
  );

  const data = useMemo(() => {
    if (!excelSeries.hasExcelData) {
      return fallbackData;
    }
    const sorted = [...excelSeries.data].sort(
      (a, b) => (b.value ?? 0) - (a.value ?? 0)
    );
    const maxSegments = config.maxSegments || 6;
    if (sorted.length <= maxSegments) {
      return sorted;
    }
    const visible = sorted.slice(0, maxSegments - 1);
    const remainder = sorted.slice(maxSegments - 1);
    const otherTotal = remainder.reduce(
      (sum, item) => sum + (item.value ?? 0),
      0
    );
    return [
      ...visible,
      {
        name: "Other",
        value: otherTotal,
      },
    ];
  }, [excelSeries, fallbackData, config.maxSegments]);

  // const _kpis = useMemo(() => {
  //   return calculateKPIs(data, config);
  // }, [data, config]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    config.animations !== false
  );

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + (item?.value ?? 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  // Function to get colors dynamically based on percentage ranking
  const getDynamicColors = useCallback(
    (data) => {
      const colors = getChartColors();

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

      // Define color palette using global colors (highest to lowest)
      const colorPalette = [
        colors.primary, // Highest percentage
        colors.secondary, // Second highest
        colors.accent, // Third highest
        "#B100CC", // Fourth highest
        "#E044A7", // Fifth highest
        "#c0f0fc", // Lowest percentage
      ];

      // Create color mapping based on ranking
      const colorMap = {};
      sortedSegments.forEach((segment, rank) => {
        colorMap[segment.originalIndex] =
          colorPalette[rank] || colorPalette[colorPalette.length - 1];
      });

      return colorMap;
    },
    [getChartColors]
  );

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
    [RADIAN]
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
          <h3 style={styles.title}>Pie Chart</h3>
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
            {config.showLegend !== false && (
              <Legend
                wrapperStyle={{
                  color: colors.text,
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

PieChartWidget.displayName = "PieChartWidget";

export default PieChartWidget;
