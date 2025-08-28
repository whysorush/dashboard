// src/pages/DashboardBuilder/components/widgets/SmoothFunnelChartWidget.jsx
import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import BaseWidget from './BaseWidget';
import { generateMockData } from '../../utils/mockDataGenerator';
import { GRADIENT_CHART_COLORS } from '../../constants';

/**
 * Smooth Funnel Chart Widget
 * 
 * A professional funnel visualization with smooth curves, matching the reference design.
 * Features:
 * - Smooth gradient area chart styled as a funnel
 * - Value indicators at key points
 * - Clean, minimal styling
 * - Category labels at the bottom
 */
const SmoothFunnelChartWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};
  
  // Generate mock data for the funnel
  const data = useMemo(() => {
    // Create a smooth curve that looks like a funnel
    const stages = [
      { name: 'Manufacturing', value: 30000 },
      { name: 'Marketing', value: 25000 },
      { name: 'Branding', value: 35000 }
    ];
    
    // Create data points for a smooth curve
    const points = 20;
    const smoothData = [];
    
    for (let i = 0; i < points; i++) {
      const x = i / (points - 1);
      
      // Create a smooth funnel shape
      // Higher in the middle, lower at the ends
      let y;
      if (x < 0.33) {
        // First third - rise from stage 1 to stage 2
        y = stages[0].value + (stages[1].value - stages[0].value) * (x / 0.33);
      } else if (x < 0.66) {
        // Middle third - rise from stage 2 to stage 3
        const normalizedX = (x - 0.33) / 0.33;
        y = stages[1].value + (stages[2].value - stages[1].value) * normalizedX;
      } else {
        // Last third - fall back down
        const normalizedX = (x - 0.66) / 0.34;
        y = stages[2].value * (1 - normalizedX * 0.5);
      }
      
      smoothData.push({
        name: `p${i}`,
        value: Math.round(y)
      });
    }
    
    // Add markers for key points (these will be shown as labels)
    smoothData[0].marker = '$30K';
    smoothData[Math.floor(points * 0.33)].marker = '$25K';
    smoothData[Math.floor(points * 0.66)].marker = '$35K';
    smoothData[points - 1].marker = '$17K';
    
    return smoothData;
  }, []);
  
  // Extract stage data for the legend
  const stageData = useMemo(() => {
    return [
      { name: 'Manufacturing', value: '$30,000' },
      { name: 'Marketing', value: '$25,000' },
      { name: 'Branding', value: '$35,000' }
    ];
  }, []);
  
  // Get gradient colors
  const gradientColors = useMemo(() => {
    return {
      startColor: config.startColor || GRADIENT_CHART_COLORS.FUNNEL_CHART.startColor,
      endColor: config.endColor || GRADIENT_CHART_COLORS.FUNNEL_CHART.endColor
    };
  }, [config.startColor, config.endColor]);
  
  // Calculate height based on widget size
  const chartHeight = useMemo(() => {
    const size = widget.position?.size || 'medium';
    return size === 'large' ? 350 : size === 'medium' ? 300 : 250;
  }, [widget.position?.size]);

  return (
    <BaseWidget 
      widget={widget} 
      isSelected={isSelected} 
      onClick={onClick}
      className="p-0 overflow-hidden"
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
            Funnel Chart
          </h3>
        </div>
        
        {/* Chart */}
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientColors.startColor} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={gradientColors.endColor} stopOpacity={0.8} />
                </linearGradient>
              </defs>
              
              {/* Invisible axes - we're using custom labels */}
              <XAxis dataKey="name" hide={true} />
              <YAxis hide={true} />
              
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0
                          }).format(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* The smooth area that forms the funnel */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="url(#funnelGradient)"
                fillOpacity={1}
              />
              
              {/* Custom labels for key points */}
              {data
                .filter(d => d.marker)
                .map((point, index) => {
                  const dataIndex = data.findIndex(d => d === point);
                  const xPercent = (dataIndex / (data.length - 1)) * 100;
                  
                  return (
                    <text
                      key={index}
                      x={`${xPercent}%`}
                      y={30}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
                    >
                      {point.marker}
                    </text>
                  );
                })
              }
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {stageData.map((stage, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span 
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ 
                    backgroundColor: index === 0 
                      ? gradientColors.startColor 
                      : index === stageData.length - 1
                        ? gradientColors.endColor
                        : `rgba(0, 230, 220, ${0.7 - index * 0.2})`
                  }}
                ></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{stage.name}</span>
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {stage.value}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer text */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Lorem ipsum simply dummy text of the printing and typesetting industry.
        </div>
      </div>
    </BaseWidget>
  );
};

export default SmoothFunnelChartWidget;
