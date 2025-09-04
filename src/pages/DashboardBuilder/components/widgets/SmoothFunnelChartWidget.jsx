// src/pages/DashboardBuilder/components/widgets/SmoothFunnelChartWidget.jsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  Cell,
} from "recharts";
import BaseWidget from "./BaseWidget";
import { GRADIENT_CHART_COLORS } from "../../constants";

/**
 * Funnel Chart Widget (Recharts FunnelChart)
 *
 * - Uses Recharts <FunnelChart> with <Funnel>, <Cell>, and <LabelList>
 * - Clean, minimal styling with responsive container
 * - Legend below the chart (matches your previous layout)
 */
const SmoothFunnelChartWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};

  // Stage data for the funnel (top -> bottom)
  const stageData = useMemo(
    () => [
      { name: "Manufacturing", value: 30000, display: "30,000" },
      { name: "Marketing", value: 25000, display: "25,000" },
      { name: "Branding", value: 35000, display: "35,000" },
      { name: "Sales", value: 20000, display: "20,000" },
      { name: "Distribution", value: 15000, display: "15,000" },
      { name: "Customer Service", value: 10000, display: "10,000" },
      { name: "Retention", value: 5000, display: "5,000" },
    ],
    []
  );

  // Colors
  const gradientColors = useMemo(() => {
    return {
      startColor:
        config.startColor || GRADIENT_CHART_COLORS.FUNNEL_CHART.startColor,
      endColor: config.endColor || GRADIENT_CHART_COLORS.FUNNEL_CHART.endColor,
    };
  }, [config.startColor, config.endColor]);

  // Build a small palette from start->end for cells
  const cellColors = useMemo(() => {
    // simple interpolation between start and end in HSL-ish space via CSS opacity steps
    // (You can replace with a proper color interpolator if you have one.)
    return [
      gradientColors.startColor,
      gradientColors.endColor + "CC", // ~80% opacity
      gradientColors.endColor,
    ];
  }, [gradientColors]);

  // Height by widget size
  const chartHeight = useMemo(() => {
    const size = widget.position?.size || "medium";
    return size === "large" ? 350 : size === "medium" ? 300 : 250;
  }, [widget.position?.size]);

  return (
    <div className="chart-container">
      {/*     
    <BaseWidget
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      className="p-0 overflow-hidden"
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
            Funnel Chart
          </h3>
        </div> */}

      {/* Chart */}

      <div className="chart-header">
        <h3>Funnel Chart</h3>
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
      <div
        className="funnel-chart"
        style={{ width: "100%", height: chartHeight }}
      >
        <ResponsiveContainer>
          <FunnelChart>
            <Tooltip
              formatter={(val) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(val)
              }
            />
            <Funnel
              dataKey="value"
              data={stageData}
              // isAnimationActive={true}
              // Optional: adjust shape / width
              width={600}
              // "trapezoid" is default; could use custom shape if needed
            >
              {/* Value labels inside each segment */}
              <LabelList
                position="inside"
                fill="#fff"
                stroke="none"
                dataKey="display"
              />
              {/* Stage labels to the right */}
              <LabelList
                dataKey="name"
                position="right"
                fill="#525252"
                className="text-xs"
              />
              {stageData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={cellColors[idx % cellColors.length]}
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {/* <div className="mt-6 grid grid-cols-3 gap-4">
          {stageData.map((stage, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span
                  className="w-3 h-3 rounded-full mr-1"
                  style={{
                    backgroundColor: cellColors[index % cellColors.length],
                  }}
                ></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {stage.name}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {stage.display}
              </div>
            </div>
          ))}
        </div> */}

      {/* Footer text */}
      {/* <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
           Lorem ipsum simply dummy text of the printing and typesetting
           industry.
         </div>
       </div>
     </BaseWidget> */}
    </div>
  );
};

export default SmoothFunnelChartWidget;
