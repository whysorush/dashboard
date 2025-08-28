// src/pages/DashboardBuilder/components/widgets/ProfessionalKPIWidget.jsx
import React from 'react';
import { PROFESSIONAL_WIDGET_CONFIGS } from '../../constants';

/**
 * Professional KPI Widget with exact design standards
 * 
 * Features:
 * - White background, 32px border radius, 24px padding
 * - Icon with colored background
 * - Large value display with proper number formatting
 * - Growth percentage with up/down arrows and colors
 * - Figtree font family with specific weights and colors
 */
const ProfessionalKPIWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};
  
  // Use default config or merge with widget config
  const title = config.title || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.title;
  const value = config.value || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.value;
  const prefix = config.prefix || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.prefix;
  const growth = config.growth || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growth;
  const growthDirection = config.growthDirection || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthDirection;
  const growthText = config.growthText || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthText;
  const icon = config.icon || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.icon;
  const iconBg = config.iconBg || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.iconBg;
  const growthColor = config.growthColor || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthColor;
  const growthTextColor = config.growthTextColor || PROFESSIONAL_WIDGET_CONFIGS.KPI_CARD.growthTextColor;
  
  return (
    <div 
      className="professional-widget-container professional-kpi-widget"
      onClick={onClick}
    >
      {/* Icon and Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div 
          className="professional-kpi-icon"
          style={{
            background: iconBg
          }}
        >
          {icon}
        </div>
        <div className="chart-title">
          {title}
        </div>
      </div>
      
      {/* Main Value */}
      <div className="main-value" style={{ marginBottom: '8px' }}>
        {prefix}{value?.toLocaleString()}
      </div>
      
      {/* Growth Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div 
          className="professional-kpi-growth"
          style={{
            background: growthColor
          }}
        >
          <span style={{ color: growthTextColor, fontSize: '12px' }}>
            {growthDirection === 'up' ? '↗' : '↘'} +{growth}%
          </span>
        </div>
        <div className="axis-label">
          {growthText}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalKPIWidget;