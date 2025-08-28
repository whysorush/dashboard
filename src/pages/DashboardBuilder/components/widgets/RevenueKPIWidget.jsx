// src/pages/DashboardBuilder/components/widgets/RevenueKPIWidget.jsx
import React from 'react';
import ProfessionalKPIWidget from './ProfessionalKPIWidget';
import { PROFESSIONAL_KPI_CONFIGS } from '../../constants';

/**
 * Revenue KPI Widget Component
 * 
 * Pre-configured professional KPI widget for displaying revenue metrics
 * with default styling and configuration.
 */
const RevenueKPIWidget = ({ widget, isSelected, onClick }) => {
  // Merge default Revenue KPI config with any custom config
  const mergedConfig = {
    ...PROFESSIONAL_KPI_CONFIGS.REVENUE,
    ...widget.config
  };
  
  // Create a new widget with the merged config
  const enhancedWidget = {
    ...widget,
    config: mergedConfig
  };
  
  return (
    <ProfessionalKPIWidget 
      widget={enhancedWidget}
      isSelected={isSelected}
      onClick={onClick}
    />
  );
};

export default RevenueKPIWidget;
