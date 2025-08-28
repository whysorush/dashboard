// src/pages/DashboardBuilder/components/PreviewModal/DashboardPreview.jsx
import React, { useMemo } from 'react';

// Import widget components
import LineChartWidget from '../widgets/LineChartWidget';
import BarChartWidget from '../widgets/BarChartWidget';
import AreaChartWidget from '../widgets/AreaChartWidget';
import PieChartWidget from '../widgets/PieChartWidget';
import FunnelChartWidget from '../widgets/FunnelChartWidget';
import KPICardWidget from '../widgets/KPICardWidget';
import DataTableWidget from '../widgets/DataTableWidget';

// Import professional widget components
import ProfessionalKPIWidget from '../widgets/ProfessionalKPIWidget';
import RevenueKPIWidget from '../widgets/RevenueKPIWidget';
import OrdersKPIWidget from '../widgets/OrdersKPIWidget';
import CustomersKPIWidget from '../widgets/CustomersKPIWidget';
import GradientBarChartWidget from '../widgets/GradientBarChartWidget';
import SmoothFunnelChartWidget from '../widgets/SmoothFunnelChartWidget';
import ProfessionalTableWidget from '../widgets/ProfessionalTableWidget';
import AdvancedFilterBarWidget from '../widgets/AdvancedFilterBarWidget';

// Import exact design professional widgets
import ProfessionalBarChartWidget from '../widgets/ProfessionalBarChartWidget';

import { WIDGET_TYPES } from '../../constants';

const DashboardPreview = ({ widgets, rows, viewMode, theme = 'light', layout = 'standard' }) => {
  // Group widgets by row
  const widgetsByRow = useMemo(() => {
    const grouped = {};
    
    // Initialize with empty arrays for all rows
    rows.forEach(row => {
      grouped[row.id] = [];
    });
    
    // Add widgets to their rows
    widgets.forEach(widget => {
      const rowId = widget.position.rowId || rows[0]?.id;
      if (grouped[rowId]) {
        grouped[rowId].push(widget);
      }
    });
    
    return grouped;
  }, [widgets, rows]);
  
  // Get CSS class for widget size based on row occupancy (matches Canvas.jsx logic)
  const getWidgetSizeClass = (widget, rowWidgets) => {
    const widgetsInRow = rowWidgets.length;
    
    // For mobile, always full width
    if (viewMode === 'mobile') {
      return 'flex-1 w-full';
    }
    
    // For tablet, max 2 widgets per row
    if (viewMode === 'tablet') {
      if (widgetsInRow === 1) return 'flex-1 w-full';
      return 'flex-1 w-1/2';
    }
    
    // For desktop, use the exact same logic as Canvas.jsx
    if (widgetsInRow === 1) return 'flex-1 w-full';
    if (widgetsInRow === 2) return 'flex-1 w-1/2';
    return 'flex-1 w-1/3';
  };
  
  // Get flex basis style (matches Canvas.jsx logic)
  const getWidgetFlexBasis = (rowWidgets) => {
    const widgetsInRow = rowWidgets.length;
    
    if (viewMode === 'mobile') {
      return { flexBasis: 'calc(100% - 8px)' };
    }
    
    if (viewMode === 'tablet') {
      if (widgetsInRow === 1) return { flexBasis: 'calc(100% - 8px)' };
      return { flexBasis: 'calc(50% - 16px)' };
    }
    
    // Desktop logic (matches Canvas.jsx exactly)
    if (widgetsInRow === 1) return { flexBasis: 'calc(100% - 8px)' };
    if (widgetsInRow === 2) return { flexBasis: 'calc(50% - 16px)' };
    return { flexBasis: 'calc(33.333% - 16px)' };
  };
  
  // Render widget based on type
  const renderWidget = (widget) => {
    // Create a preview version of the widget (no controls, no selection)
    const props = {
      widget,
      isSelected: false,
      onClick: () => {} // No-op function
    };

    switch (widget.type) {
      // Exact Design Professional Widgets
      case WIDGET_TYPES.PROFESSIONAL_BAR_CHART:
        return <ProfessionalBarChartWidget {...props} />;
      case WIDGET_TYPES.PROFESSIONAL_KPI_CARD:
        return <ProfessionalKPIWidget {...props} />;
        
      // Professional widgets
      case WIDGET_TYPES.PROFESSIONAL_KPI:
        return <ProfessionalKPIWidget {...props} />;
      case WIDGET_TYPES.REVENUE_KPI:
        return <RevenueKPIWidget {...props} />;
      case WIDGET_TYPES.ORDERS_KPI:
        return <OrdersKPIWidget {...props} />;
      case WIDGET_TYPES.CUSTOMERS_KPI:
        return <CustomersKPIWidget {...props} />;
      case WIDGET_TYPES.GRADIENT_BAR_CHART:
        return <GradientBarChartWidget {...props} />;
      case WIDGET_TYPES.SMOOTH_FUNNEL_CHART:
        return <SmoothFunnelChartWidget {...props} />;
      case WIDGET_TYPES.PROFESSIONAL_TABLE:
        return <ProfessionalTableWidget {...props} />;
      case WIDGET_TYPES.ADVANCED_FILTER_BAR:
        return <AdvancedFilterBarWidget {...props} />;
      
      // Basic widgets
      case WIDGET_TYPES.LINE_CHART:
        return <LineChartWidget {...props} />;
      case WIDGET_TYPES.BAR_CHART:
        return <BarChartWidget {...props} />;
      case WIDGET_TYPES.AREA_CHART:
        return <AreaChartWidget {...props} />;
      case WIDGET_TYPES.PIE_CHART:
        return <PieChartWidget {...props} />;
      case WIDGET_TYPES.FUNNEL_CHART:
        return <FunnelChartWidget {...props} />;
      case WIDGET_TYPES.KPI_CARD:
        return <KPICardWidget {...props} />;
      case WIDGET_TYPES.DATA_TABLE:
        return <DataTableWidget {...props} />;
      default:
        return (
          <div className="widget-placeholder p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
            <p>Unknown widget type: {widget.type}</p>
          </div>
        );
    }
  };
  
  // Get layout spacing
  const getLayoutSpacing = () => {
    switch(layout) {
      case 'compact':
        return 'space-y-2';
      case 'spacious':
        return 'space-y-8';
      case 'standard':
      default:
        return 'space-y-6';
    }
  };
  
  // Apply theme class to the entire preview
  const themeClass = theme === 'light' ? '' : 'dark';
  
  return (
    <div className={`dashboard-preview ${themeClass}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} flex items-center`}>
          <span className={`inline-block h-3 w-3 rounded-full mr-2 ${viewMode === 'desktop' ? 'bg-green-500' : viewMode === 'tablet' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
          {viewMode === 'desktop' ? 'Desktop' : viewMode === 'tablet' ? 'Tablet' : 'Mobile'} Preview
        </h1>
        <div className={`text-sm ${theme === 'light' ? 'text-gray-500 bg-gray-100' : 'text-gray-400 bg-gray-700'} px-3 py-1 rounded-full flex items-center gap-2`}>
          <span>{viewMode === 'desktop' ? 'Full Width' : viewMode === 'tablet' ? '768px' : '375px'}</span>
          <span className="h-3 w-3 rounded-full bg-blue-500"></span>
          <span>{layout}</span>
        </div>
      </div>
      
      <div className={getLayoutSpacing()}>
        {rows.map(row => {
          const rowWidgets = widgetsByRow[row.id] || [];
          
          // Skip empty rows
          if (rowWidgets.length === 0) return null;
          
          // Sort widgets by their index in the row
          rowWidgets.sort((a, b) => a.position.index - b.position.index);
          
          // Get gap based on layout
          const gapClass = layout === 'compact' ? 'gap-2' : layout === 'spacious' ? 'gap-6' : 'gap-4';
          
          return (
            <div key={row.id} className="row-preview">
              {/* Row container that matches Canvas.jsx RowContainer styling */}
              <div className={`row-container-preview ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-lg border p-4 mb-4`}>
                <div className={`row-content-preview flex flex-row flex-nowrap ${gapClass} justify-center items-stretch`}>
                  {rowWidgets.map(widget => (
                    <div 
                      key={widget.id}
                      className={`widget-container-preview ${getWidgetSizeClass(widget, rowWidgets)} transition-all duration-300`}
                      style={{
                        ...getWidgetFlexBasis(rowWidgets),
                        height: '100%',
                        margin: '0 4px' // Match Canvas.jsx margin
                      }}
                    >
                      <div className="h-full" data-theme={theme}>
                        {renderWidget(widget)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {widgets.length === 0 && (
        <div className={`text-center py-12 ${theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-800/50 border-gray-700'} rounded-lg border border-dashed`}>
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
            No widgets to preview
          </h3>
          <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-500'}>
            Add widgets to your dashboard to see a preview
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPreview;