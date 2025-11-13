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

const LineChartWidget = ({ widget }) => {
  // Get theme configuration
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
  } = useThemeStyles();

  const config = widget?.config || {};
  const { excelData, excelHeaders } = useExcelData();

  const excelSeries = useMemo(
    () =>
      prepareChartSeries(excelData, excelHeaders, {
        maxValueSeries: config.comparisonPeriod ? 2 : 1,
      }),
    [excelData, excelHeaders, config.comparisonPeriod]
  );

  const fallbackData = useMemo(
    () =>
      generateMockData("time-series", {
        points: config.dataPoints || 12,
        trend: config.trend || "up",
        timeRange: config.timeRange || "monthly",
        includeComparison: config.comparisonPeriod,
      }),
    [config.dataPoints, config.trend, config.timeRange, config.comparisonPeriod]
  );

  const data = useMemo(() => {
    if (!excelSeries.hasExcelData) {
      return fallbackData;
    }

    const { data: seriesData, valueHeaders } = excelSeries;
    return seriesData.map((row, index, arr) => ({
      ...row,
      previousValue:
        config.comparisonPeriod && valueHeaders.length > 1
          ? row.value2 ?? row.value
          : config.comparisonPeriod && index > 0
          ? arr[index - 1].value
          : undefined,
    }));
  }, [excelSeries, fallbackData, config.comparisonPeriod]);

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
    if (!config.showAverage || data.length === 0) return null;
    const sum = data.reduce(
      (sumAcc, item) => sumAcc + (item.value ?? 0),
      0
    );
    return sum / data.length;
  }, [data, config.showAverage]);

  // Calculate total for header display
  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + (item.value ?? 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  const dataLength = data.length;
  const pointWidth = config.pointPixelWidth || 70;
  const minWidth = Math.max(dataLength * pointWidth, 600);
  const shouldScroll = dataLength * pointWidth > 600;

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
      <div
        style={{
          width: "100%",
          overflowX: shouldScroll ? "auto" : "visible",
        }}
      >
        <div
          style={{
            // width: shouldScroll ? minWidth : "100%",
            minWidth: "100%",
            height: chartHeight,
          }}
        >
          <ResponsiveContainer>
            <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
            {config.showGrid !== false && (
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
            {config.showLegend !== false && (
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
              type={config.smoothCurves !== false ? "monotone" : "linear"}
              dataKey="value"
              stroke={primaryColor}
              strokeWidth={3}
              dot={config.showDataPoints !== false ? { fill: primaryColor, strokeWidth: 2, r: 4 } : false}
              activeDot={{
                r: 6,
                stroke: primaryColor,
                strokeWidth: 2,
                fill: "white",
              }}
              animationDuration={config.animations !== false ? 1500 : 0}
            />
            {config.comparisonPeriod && (
              <Line
                name="Previous Period"
                type={config.smoothCurves !== false ? "monotone" : "linear"}
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
    </div>
  );
};

export default LineChartWidget;
