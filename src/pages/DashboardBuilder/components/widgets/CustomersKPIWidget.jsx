// src/pages/DashboardBuilder/components/widgets/CustomersKPIWidget.jsx
import React from 'react';
import ProfessionalKPIWidget from './ProfessionalKPIWidget';
import { PROFESSIONAL_KPI_CONFIGS } from '../../constants';

/**
 * Customers KPI Widget Component
 * 
 * Pre-configured professional KPI widget for displaying customer metrics
 * with default styling and configuration.
 */
const CustomersKPIWidget = ({ widget, isSelected, onClick }) => {
  // Merge default Customers KPI config with any custom config
  const mergedConfig = {
    ...PROFESSIONAL_KPI_CONFIGS.CUSTOMERS,
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

export default CustomersKPIWidget;
