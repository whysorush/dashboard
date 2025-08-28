// src/pages/DashboardBuilder/components/widgets/OrdersKPIWidget.jsx
import React from 'react';
import ProfessionalKPIWidget from './ProfessionalKPIWidget';
import { PROFESSIONAL_KPI_CONFIGS } from '../../constants';

/**
 * Orders KPI Widget Component
 * 
 * Pre-configured professional KPI widget for displaying order metrics
 * with default styling and configuration.
 */
const OrdersKPIWidget = ({ widget, isSelected, onClick }) => {
  // Merge default Orders KPI config with any custom config
  const mergedConfig = {
    ...PROFESSIONAL_KPI_CONFIGS.ORDERS,
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

export default OrdersKPIWidget;
