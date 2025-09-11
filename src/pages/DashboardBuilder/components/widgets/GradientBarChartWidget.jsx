// src/pages/DashboardBuilder/components/widgets/GradientBarChartWidget.jsx
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
import KPIDisplay from "./KPIDisplay";
import FilterBar from "./FilterBar";
import { generateMockData, calculateKPIs } from "../../utils/mockDataGenerator";
import { GRADIENT_CHART_COLORS } from "../../constants";

const GradientBarChartWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};

  const data = useMemo(() => {
    return generateMockData("categories", {
      categories: config.dataPoints || 10,
      includeComparison: config.comparisonPeriod,
      timeRange: config.timeRange || "monthly",
      trend: config.trend || "random",
    });
  }, [config]);

  const kpis = useMemo(() => {
    return calculateKPIs(data, config);
  }, [data, config]);

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);

  const handleFilterChange = (key, value) => {
    console.log("Filter changed:", key, value);
  };

  const chartHeight = useMemo(() => {
    const size = widget.position?.size || "medium";
    return size === "large" ? 350 : size === "medium" ? 300 : 250;
  }, [widget.position?.size]);

  const gradientColors = useMemo(() => {
    return {
      startColor:
        config.startColor || GRADIENT_CHART_COLORS.BAR_CHART.startColor,
      endColor: config.endColor || GRADIENT_CHART_COLORS.BAR_CHART.endColor,
    };
  }, [config.startColor, config.endColor]);

  return (
    // <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
    <div className="chart-container">
      {console.log("dddddddddddddddddddddddddddddddddd", data)}
      <div className="chart-header bar-chart-header">
        <div className="figma-heading">
          <h3>Bar Chart</h3>
          <div>{total}</div>
        </div>

        <select
          className="time-filter"
          // value={range}
          // onChange={(e) => setRange(e.target.value)}
        >
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
        </select>
      </div>

      <div className="bar-chart" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap="18%"
            barGap={6}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            // barCategoryGap={16}
          >
            <CartesianGrid stroke={"rgba(0,0,0,0.06)"} vertical={false} />

            {/* {config.showGrid !== false && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
              )} */}

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={30}
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`${value.toLocaleString()}`, ""]}
            />

            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 201, 255, 0.85)" />

                <stop offset="100%" stopColor="rgba(146, 254, 157, 0.85)" />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[16, 16, 0, 0]}
              maxBarSize={60}
              animationDuration={config.animations !== false ? 1500 : 0}
              background={{
                fill: "var(--bar-track)",
                radius: [16, 16, 0, 0],
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            marginRight: "4px",
            background: "linear-gradient(180deg, #00E5FF 0%, #00FF85 100%)",
          }}
        ></span>
        Lorem ipsum simply dummy text of the printing and typesetting industry.
      </div>
    </div>
    // </BaseWidget>
  );
};

export default GradientBarChartWidget;
