// src/pages/DashboardBuilder/components/widgets/GradientBarChartWidget?.jsx
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateMockData } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";
import { useExcelData } from "../ExcelDataContext";
import { prepareChartSeries } from "../../utils/excelDataTransforms";

const styles = {
  container: {
    background: "var(--stat-card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 16,
  },
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

const GradientBarChartWidget = ({ widget, isSelected, onClick }) => {
  const {
    styleMode,
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getTooltipStyle,
    getAnimationConfig,
  } = useThemeStyles();

  const { excelData, excelHeaders } = useExcelData();

  const config = useMemo(() => widget?.config || {}, [widget?.config]);

  // State for time range selection
  const [selectedTimeRange, setSelectedTimeRange] = useState(() => {
    // Map config timeRange to dropdown value
    const timeRangeMap = {
      weekly: "Week",
      monthly: "Month",
      yearly: "Year",
    };
    return timeRangeMap[config.timeRange] || "Month";
  });

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(config.animations !== false);

  // Map dropdown value to timeRange parameter
  const timeRangeMap = {
    Week: "weekly",
    Month: "monthly",
    Year: "yearly",
  };
  const currentTimeRange = timeRangeMap[selectedTimeRange] || "monthly";

  // Build chart data from Excel when available, else fallback to mock
  const excelSeries = useMemo(
    () =>
      prepareChartSeries(excelData, excelHeaders, {
        maxValueSeries: config.comparisonPeriod ? 2 : 1,
      }),
    [excelData, excelHeaders, config.comparisonPeriod]
  );

  const fallbackData = useMemo(
    () =>
      generateMockData("categories", {
        categories: config.dataPoints || 10,
        includeComparison: config.comparisonPeriod,
        timeRange: currentTimeRange,
        trend: config.trend || "random",
      }),
    [config.dataPoints, config.comparisonPeriod, config.trend, currentTimeRange]
  );

  const chartData = useMemo(() => {
    if (!excelSeries.hasExcelData) {
      return fallbackData;
    }

    const { data, valueHeaders } = excelSeries;

    if (!config.comparisonPeriod) {
      return data;
    }

    return data.map((row, index, arr) => ({
      ...row,
      previousValue: valueHeaders.length > 1
        ? row.value2 ?? row.value
        : index > 0
          ? arr[index - 1].value
          : row.value,
    }));
  }, [excelSeries, fallbackData, config.comparisonPeriod]);

  const total = useMemo(() => {
    const sum = chartData.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [chartData]);

  const dataWidth = chartData.length * (config.barPixelWidth || 80);
  const scrollWidth = Math.max(dataWidth, 600);
  const shouldScroll = dataWidth > 600;

  return (
    <div
      style={{
        
        ...cssVariables,
      }}
      className="chart-container"
    >
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Bar Chart</h3>
          <div style={styles.total}>{total}</div>
        </div>

        <select
          style={styles.select}
          aria-label="Time range"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </select>
      </div>

      <div style={{ width: "100%", height: chartHeight, overflowX: shouldScroll ? "auto" : "visible" }}>
        <div style={{ width: shouldScroll ? scrollWidth : "100%", minWidth: "100%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
            data={chartData}
            barCategoryGap="18%"
            barGap={6}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            >
            <CartesianGrid stroke={colors.grid} vertical={false} />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
                fontFamily: "var(--font-family)",
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: colors.textSecondary,
                fontFamily: "var(--font-family)",
              }}
              width={30}
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={tooltipStyle}
              formatter={(value) => [`${Number(value || 0).toLocaleString()}`, ""]}
            />

            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor={colors.secondary} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[16, 16, 0, 0]}
              maxBarSize={60}
              animationDuration={animationConfig.duration}
              background={{
                fill: colors.grid,
                radius: [16, 16, 0, 0],
              }}
            />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GradientBarChartWidget;
