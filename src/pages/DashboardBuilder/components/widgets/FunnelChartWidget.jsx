// src/pages/DashboardBuilder/components/widgets/FunnelChartWidget.jsx
import React, { useMemo } from "react";
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

const FunnelChartWidget = ({ widget }) => {
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getColorPalette,
    getTooltipStyle,
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
      generateMockData("funnel", {
        stages: 5,
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
    return sorted.slice(0, config.maxStages || 6).map((entry) => ({
      ...entry,
      value: Number.isFinite(entry.value) ? entry.value : 0,
    }));
  }, [excelSeries, fallbackData, config.maxStages]);

  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || "medium");
  const colorPalette = getColorPalette(5);
  const tooltipStyle = getTooltipStyle();

  const total = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + (item.value ?? 0), 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(sum);
  }, [data]);
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
          <h3 style={styles.title}>Funnel Chart</h3>
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
          <FunnelChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive={config.animations !== false}
              width={600}
            >
              <LabelList
                position="center"
                fill={colors.text}
                formatter={(value) => `${value.toLocaleString()}`}
                style={{ fontFamily: "var(--font-family)", fontSize: "12px" }}
              />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorPalette[index % colorPalette.length]}
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunnelChartWidget;
