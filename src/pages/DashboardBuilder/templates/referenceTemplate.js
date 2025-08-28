// src/pages/DashboardBuilder/templates/referenceTemplate.js
import { WIDGET_TYPES } from '../constants';
import { generateUniqueId } from '../utils/gridHelpers';

/**
 * Creates a sample dashboard that matches the reference image exactly
 */
export const createReferenceDashboard = () => {
  // Create row IDs
  const rowIds = {
    filterRow: `row-${generateUniqueId()}`,
    kpiRow: `row-${generateUniqueId()}`,
    chartRow: `row-${generateUniqueId()}`,
    tableRow: `row-${generateUniqueId()}`
  };
  
  // Create rows
  const rows = [
    { id: rowIds.filterRow, title: 'Filter Row' },
    { id: rowIds.kpiRow, title: 'KPI Row' },
    { id: rowIds.chartRow, title: 'Chart Row' },
    { id: rowIds.tableRow, title: 'Table Row' }
  ];
  
  // Create widgets
  const widgets = [
    // Row 1: Filter Bar
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.ADVANCED_FILTER_BAR,
      position: {
        rowId: rowIds.filterRow,
        row: 0,
        index: 0,
        size: 'large'
      },
      config: {
        title: 'Filters'
      }
    },
    
    // Row 2: KPI Cards
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.REVENUE_KPI,
      position: {
        rowId: rowIds.kpiRow,
        row: 1,
        index: 0,
        size: 'small'
      },
      config: {
        title: 'Total Revenue',
        value: 847293,
        currency: '$',
        growth: 4.1,
        icon: '💰',
        iconBgColor: 'rgba(16, 185, 129, 0.1)', // Emerald bg with opacity
        iconColor: '#10B981', // Emerald
        subtitle: 'from last week',
        formatType: 'currency'
      }
    },
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.ORDERS_KPI,
      position: {
        rowId: rowIds.kpiRow,
        row: 1,
        index: 1,
        size: 'small'
      },
      config: {
        title: 'Orders',
        value: 2847,
        currency: '',
        growth: 2.6,
        icon: '📦',
        iconBgColor: 'rgba(59, 130, 246, 0.1)', // Blue bg with opacity
        iconColor: '#3B82F6', // Blue
        subtitle: 'from last week',
        formatType: 'number'
      }
    },
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.CUSTOMERS_KPI,
      position: {
        rowId: rowIds.kpiRow,
        row: 1,
        index: 2,
        size: 'small'
      },
      config: {
        title: 'Customers',
        value: 12483,
        currency: '',
        growth: 2.8,
        icon: '👥',
        iconBgColor: 'rgba(139, 92, 246, 0.1)', // Purple bg with opacity
        iconColor: '#8B5CF6', // Purple
        subtitle: 'from last week',
        formatType: 'number'
      }
    },
    
    // Row 3: Charts
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.GRADIENT_BAR_CHART,
      position: {
        rowId: rowIds.chartRow,
        row: 2,
        index: 0,
        size: 'medium'
      },
      config: {
        title: 'Bar Chart',
        value: 242673,
        startColor: '#00E5FF',
        endColor: '#00FF85',
        showGrid: true,
        showLegend: true,
        animations: true
      }
    },
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.SMOOTH_FUNNEL_CHART,
      position: {
        rowId: rowIds.chartRow,
        row: 2,
        index: 1,
        size: 'medium'
      },
      config: {
        title: 'Funnel Chart',
        startColor: '#00E5FF',
        endColor: '#00FF85',
        showGrid: false,
        showLegend: true,
        animations: true
      }
    },
    
    // Row 4: Table
    {
      id: generateUniqueId(),
      type: WIDGET_TYPES.PROFESSIONAL_TABLE,
      position: {
        rowId: rowIds.tableRow,
        row: 3,
        index: 0,
        size: 'large'
      },
      config: {
        title: 'Orders Table',
        showFilters: true,
        pageSize: 10,
        sortable: true
      }
    }
  ];
  
  return { rows, widgets };
};

export default createReferenceDashboard;
