// src/pages/DashboardBuilder/components/widgets/GradientBarChartWidget?.jsx
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
import BaseWidget from "./BaseWidget";
import { generateMockData } from "../../utils/mockDataGenerator";
import { useThemeStyles } from "../../../../utils/themeUtils";

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

  const config = useMemo(() => widget?.config || {}, [widget?.config]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget?.position?.size || "medium");
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig(config.animations !== false);

  const data = useMemo(() => {
    return generateMockData("categories", {
      categories: config.dataPoints || 10,
      includeComparison: config.comparisonPeriod,
      timeRange: config.timeRange || "monthly",
      trend: config.trend || "random",
    });
  }, [config]);

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  return (
      <div
        className={`gradient-bar-chart-widget style-mode-${styleMode}`}
        style={{
          fontFamily: "var(--font-family)",
          color: colors.text,
          backgroundColor: colors.background,
          ...cssVariables,
        }}
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

        <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
                fontFamily: "var(--font-family)"
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 12,
                fill: colors.textSecondary,
                fontFamily: "var(--font-family)"
              }}
              width={30}
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value.toLocaleString()}`, ""]}
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

      <div style={{ marginTop: "16px", fontSize: "14px", color: colors.textSecondary }}>
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            marginRight: "8px",
            background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        ></span>
        Revenue by Category
      </div>
    </div>
  );
};

export default GradientBarChartWidget;
