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

const FunnelChartWidget = ({ widget }) => {
  const {
    getChartColors,
    getCSSVariables,
    getChartHeight,
    getColorPalette,
    getTooltipStyle,
  } = useThemeStyles();

  const data = useMemo(() => {
    return generateMockData("funnel", {
      stages: 5,
    });
  }, []);


  // Get theme-aware colors and styles
  const colors = getChartColors();
  const cssVariables = getCSSVariables();
  const chartHeight = getChartHeight(widget.position?.size || "medium");
  const colorPalette = getColorPalette(5);
  const tooltipStyle = getTooltipStyle();

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
        <FunnelChart>
          <Tooltip contentStyle={tooltipStyle} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive={widget.config?.animations !== false}
          >
            <LabelList
              position="center"
              fill={colors.text}
              formatter={(value) => `${value.toLocaleString()}`}
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
  );
};

export default FunnelChartWidget;
