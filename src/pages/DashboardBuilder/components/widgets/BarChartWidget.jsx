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
import KPIDisplay from "./KPIDisplay";
import FilterBar from "./FilterBar";
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

const BarChartWidget = ({ widget }) => {
  const {
    getChartColors,
    getStyleProperties,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();
  const { excelData, excelHeaders } = useExcelData();

  const config = widget?.config || {};

  const neededSeries =
    1 + (config.stacked ? 1 : 0) + (config.comparisonPeriod ? 1 : 0);

  const excelSeries = useMemo(
    () =>
      prepareChartSeries(excelData, excelHeaders, {
        maxValueSeries: neededSeries,
      }),
    [excelData, excelHeaders, neededSeries]
  );

  // Generate realistic data based on widget config
  const fallbackData = useMemo(
    () =>
      generateMockData("categories", {
        categories: config.dataPoints || 5,
        includeComparison: config.comparisonPeriod,
        timeRange: config.timeRange || "monthly",
        trend: config.trend || "up",
      }),
    [config.dataPoints, config.comparisonPeriod, config.timeRange, config.trend]
  );

  const data = useMemo(() => {
    if (!excelSeries.hasExcelData) {
      return fallbackData;
    }

    const { data: seriesData, valueHeaders } = excelSeries;
    const stackedIndex = config.stacked ? 1 : null;
    const comparisonIndex =
      config.comparisonPeriod && config.stacked ? 2 : config.comparisonPeriod ? 1 : null;

    return seriesData.map((row, index, arr) => {
      const enriched = { ...row };

      if (config.stacked) {
        enriched.value2 =
          stackedIndex !== null && valueHeaders.length > stackedIndex
            ? row[`value${stackedIndex + 1}`] ?? row.value2 ?? 0
            : row.value2 ?? 0;
      }

      if (config.comparisonPeriod) {
        if (comparisonIndex !== null && valueHeaders.length > comparisonIndex) {
          const columnKey = comparisonIndex === 0 ? "value" : `value${comparisonIndex + 1}`;
          enriched.previousValue = row[columnKey] ?? 0;
        } else {
          enriched.previousValue = index > 0 ? arr[index - 1].value : row.value;
        }
      }

      return enriched;
    });
  }, [excelSeries, fallbackData, config.stacked, config.comparisonPeriod]);

  // KPIs are available if needed in the future
  // const _kpis = useMemo(() => {
  //   return calculateKPIs(data, config);
  // }, [data, config]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || "medium");
  // const _colorPalette = getColorPalette();
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(
    config.animations !== false
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

  const dataLength = data.length;
  const barWidth = config.barPixelWidth || 80;
  const minWidth = Math.max(dataLength * barWidth, 600);
  const shouldScroll = dataLength * barWidth > 600;

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
            <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barGap={5}
            barCategoryGap={10}
            >
            {config.showGrid !== false && (
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
            {config.showLegend !== false && (
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
            {config.comparisonPeriod && (
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
            {config.stacked && (
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
    </div>
  );
};

export default BarChartWidget;
