// src/pages/DashboardBuilder/components/widgets/ProfessionalBarChartWidget.jsx
import React from 'react';
import { PROFESSIONAL_WIDGET_CONFIGS } from '../../constants';

/**
 * Professional Bar Chart Widget with exact design standards
 * 
 * Features:
 * - White background, 32px border radius, 24px padding
 * - Gradient bars with linear-gradient(180deg, rgba(0, 201, 255, 0.85) 0%, rgba(146, 254, 157, 0.85) 100%)
 * - Light gray #F5F5F5 background bars with 16px border radius
 * - White highlight: 40px width, 3px height, white background, 100px border radius on each bar
 * - Figtree font family with specific weights and colors
 */
const ProfessionalBarChartWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};
  
  // Use default config or merge with widget config
  const chartData = config.data || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.data;
  const maxHeight = config.maxHeight || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.maxHeight;
  const title = config.title || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.title;
  const mainValue = config.mainValue || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.mainValue;
  const prefix = config.prefix || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.prefix;
  const timeFilter = config.timeFilter || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.timeFilter;
  const yAxisLabels = config.yAxisLabels || PROFESSIONAL_WIDGET_CONFIGS.BAR_CHART.yAxisLabels;
  
  return (
    <div 
      className="professional-widget-container professional-bar-chart-widget"
      onClick={onClick}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '1' }}>
          <div className="chart-title">
            {title}
          </div>
          <div className="main-value">
            {prefix}{mainValue?.toLocaleString()}
          </div>
        </div>
        
        {/* Time Filter Dropdown */}
        <div style={{
          padding: '4px 12px 4px 8px',
          background: '#F5F5F5',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          <div className="filter-text">{timeFilter}</div>
          <div style={{ width: '16px', height: '16px', position: 'relative' }}>
            <div style={{
              width: '8px',
              height: '4px',
              position: 'absolute',
              left: '4px',
              top: '6px',
              border: '1.45px solid #525252',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none'
            }} />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        {/* Main Chart Container */}
        <div style={{ display: 'flex', flex: '1', alignItems: 'center' }}>
          {/* Y-axis Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            paddingRight: '4px'
          }}>
            {yAxisLabels.map((label, index) => (
              <div key={index} className="axis-label">{label}</div>
            ))}
          </div>
          
          {/* Bars Container */}
          <div style={{
            flex: '1',
            height: maxHeight + 'px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '4px'
          }}>
            {chartData.map((data, index) => (
              <div
                key={data.month}
                style={{
                  flex: '1',
                  height: maxHeight + 'px',
                  position: 'relative',
                  background: '#F5F5F5',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
                className="professional-bar-background"
              >
                {/* Gradient Bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: data.height + 'px',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                  className="professional-bar-chart-gradient"
                >
                  {/* White Highlight */}
                  <div
                    className="professional-bar-highlight"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '4px',
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* X-axis Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '8px',
          paddingLeft: '44px'
        }}>
          {chartData.map((data) => (
            <div key={data.month} className="axis-label" style={{ flex: '1', textAlign: 'center' }}>
              {data.month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBarChartWidget;
