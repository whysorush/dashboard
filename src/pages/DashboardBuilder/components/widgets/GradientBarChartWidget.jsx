// src/pages/DashboardBuilder/components/widgets/GradientBarChartWidget?.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BaseWidget from "./BaseWidget";
import { generateMockData } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";
import { useExcelData } from "../ExcelDataContext";

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

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(config.animations !== false);

  // Build chart data from Excel when available, else fallback to mock
  const { chartData, categoryHeader, valueHeader } = useMemo(() => {
    const hasExcel = Array.isArray(excelData) && excelData.length > 0 && Array.isArray(excelHeaders) && excelHeaders.length > 0;

    if (!hasExcel) {
      const fallback = generateMockData("categories", {
        categories: config.dataPoints || 10,
        includeComparison: config.comparisonPeriod,
        timeRange: config.timeRange || "monthly",
        trend: config.trend || "random",
      });
      return { chartData: fallback, categoryHeader: "name", valueHeader: "value" };
    }

    // Heuristic: choose a numeric column as value, else known names
    const preferredValueNames = ["value", "amount", "order amount", "quantity", "qty", "total"];
    const headerLc = excelHeaders.map((h) => String(h || "").toLowerCase());

    let chosenValue = null;
    for (const p of preferredValueNames) {
      const idx = headerLc.indexOf(p);
      if (idx >= 0) {
        chosenValue = excelHeaders[idx];
        break;
      }
    }

    if (!chosenValue) {
      // Pick the column with most numeric-like values
      let bestHeader = null;
      let bestScore = -1;
      for (const h of excelHeaders) {
        let score = 0;
        for (let i = 0; i < Math.min(excelData.length, 20); i++) {
          const v = excelData[i]?.[h];
          const num = Number(v);
          if (!Number.isNaN(num) && v !== "" && v !== null && v !== undefined) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          bestHeader = h;
        }
      }
      chosenValue = bestHeader || excelHeaders[0];
    }

    // Category: first non-value header
    const chosenCategory = excelHeaders.find((h) => h !== chosenValue) || excelHeaders[0];

    const mapped = excelData.map((row) => ({
      name: String(row?.[chosenCategory] ?? ""),
      value: Number(row?.[chosenValue] ?? 0) || 0,
    }));

    return { chartData: mapped, categoryHeader: chosenCategory, valueHeader: chosenValue };
  }, [excelData, excelHeaders, config]);

  const total = useMemo(() => {
    const sum = chartData.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [chartData]);

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

        <select style={styles.select} aria-label="Time range">
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>

      <div style={{ width: "100%", height: chartHeight }}>
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
  );
};

export default GradientBarChartWidget;
