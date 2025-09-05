// src/pages/DashboardBuilder/constants.js

export const WIDGET_TYPES = {
    // Basic widgets
    LINE_CHART: 'line-chart',
    BAR_CHART: 'bar-chart',
    AREA_CHART: 'area-chart',
    PIE_CHART: 'pie-chart',
    FUNNEL_CHART: 'funnel-chart',
    KPI_CARD: 'kpi-card',
    DATA_TABLE: 'data-table',
    
    // Professional widgets
    PROFESSIONAL_KPI: 'professional-kpi',
    REVENUE_KPI: 'revenue-kpi',
    ORDERS_KPI: 'orders-kpi',
    CUSTOMERS_KPI: 'customers-kpi',
    GRADIENT_BAR_CHART: 'gradient-bar-chart',
    SMOOTH_FUNNEL_CHART: 'smooth-funnel-chart',
    PROFESSIONAL_TABLE: 'professional-table',
    ADVANCED_FILTER_BAR: 'advanced-filter-bar',
    
    // New Professional Widgets with Exact Design Standards
    PROFESSIONAL_BAR_CHART: 'professional-bar-chart',
    PROFESSIONAL_KPI_CARD: 'professional-kpi-card'
  };
  
  export const WIDGET_CATEGORIES = {
    // Professional widgets first
    EXACT_DESIGN_WIDGETS: {
      label: 'Exact Design Widgets',
      icon: '✨',
      widgets: [
        {
          type: WIDGET_TYPES.PROFESSIONAL_BAR_CHART,
          label: 'Professional Bar Chart',
          icon: '📊',
          description: 'Bar chart with exact design standards and gradients',
          defaultSize: { w: 6, h: 6 }
        },
        {
          type: WIDGET_TYPES.PROFESSIONAL_KPI_CARD,
          label: 'Professional KPI Card',
          icon: '💰',
          description: 'KPI card with exact design standards',
          defaultSize: { w: 4, h: 4 }
        }
      ]
    },
    PROFESSIONAL_KPIS: {
      label: 'Professional KPIs',
      icon: '💰',
      widgets: [
        {
          type: WIDGET_TYPES.REVENUE_KPI,
          label: 'Revenue KPI Card',
          icon: '💰',
          description: 'Professional revenue display with growth trends',
          defaultSize: { w: 4, h: 2 }
        },
        {
          type: WIDGET_TYPES.ORDERS_KPI,
          label: 'Orders KPI Card',
          icon: '📦',
          description: 'Track orders with growth indicators',
          defaultSize: { w: 4, h: 2 }
        },
        {
          type: WIDGET_TYPES.CUSTOMERS_KPI,
          label: 'Customers KPI Card',
          icon: '👥',
          description: 'Monitor customer metrics with trends',
          defaultSize: { w: 4, h: 2 }
        }
      ]
    },
    PROFESSIONAL_CHARTS: {
      label: 'Professional Charts',
      icon: '📊',
      widgets: [
        {
          type: WIDGET_TYPES.GRADIENT_BAR_CHART,
          label: 'Gradient Bar Chart',
          icon: '📊',
          description: 'Modern bar chart with gradient styling',
          defaultSize: { w: 6, h: 4 }
        },
        {
          type: WIDGET_TYPES.SMOOTH_FUNNEL_CHART,
          label: 'Smooth Funnel Chart',
          icon: '🔻',
          description: 'Elegant funnel visualization with smooth curves',
          defaultSize: { w: 6, h: 4 }
        }
      ]
    },
    PROFESSIONAL_TABLES: {
      label: 'Professional Tables',
      icon: '📋',
      widgets: [
        {
          type: WIDGET_TYPES.PROFESSIONAL_TABLE,
          label: 'Professional Table',
          icon: '📋',
          description: 'Modern table with status badges and sorting',
          defaultSize: { w: 12, h: 6 }
        }
      ]
    },
    PROFESSIONAL_FILTERS: {
      label: 'Advanced Filters',
      icon: '🔍',
      widgets: [
        {
          type: WIDGET_TYPES.ADVANCED_FILTER_BAR,
          label: 'Advanced Filter Bar',
          icon: '🔍',
          description: 'Complete filter system with date pickers and dropdowns',
          defaultSize: { w: 12, h: 2 }
        }
      ]
    },
    // Basic widgets
    CHARTS: {
      label: 'Basic Charts',
      icon: '📊',
      widgets: [
        {
          type: WIDGET_TYPES.LINE_CHART,
          label: 'Line Chart',
          icon: '📈',
          description: 'Show trends over time',
          defaultSize: { w: 6, h: 4 }
        },
        {
          type: WIDGET_TYPES.BAR_CHART,
          label: 'Bar Chart',
          icon: '📊',
          description: 'Compare categories',
          defaultSize: { w: 6, h: 4 }
        },
        {
          type: WIDGET_TYPES.AREA_CHART,
          label: 'Area Chart',
          icon: '📉',
          description: 'Show cumulative trends',
          defaultSize: { w: 6, h: 4 }
        },
        {
          type: WIDGET_TYPES.PIE_CHART,
          label: 'Pie Chart',
          icon: '🥧',
          description: 'Show proportions',
          defaultSize: { w: 4, h: 4 }
        },
        {
          type: WIDGET_TYPES.FUNNEL_CHART,
          label: 'Funnel Chart',
          icon: '🔻',
          description: 'Show conversion rates',
          defaultSize: { w: 4, h: 4 }
        }
      ]
    },
    METRICS: {
      label: 'Basic Metrics',
      icon: '🎯',
      widgets: [
        {
          type: WIDGET_TYPES.KPI_CARD,
          label: 'KPI Card',
          icon: '🎯',
          description: 'Display key metrics',
          defaultSize: { w: 3, h: 2 }
        }
      ]
    },
    TABLES: {
      label: 'Basic Tables',
      icon: '📋',
      widgets: [
        {
          type: WIDGET_TYPES.DATA_TABLE,
          label: 'Data Table',
          icon: '📋',
          description: 'Display tabular data',
          defaultSize: { w: 8, h: 4 }
        }
      ]
    }
  };
  
  export const COLOR_SCHEMES = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Teal', value: '#14B8A6' }
  ];
  
  export const TIME_RANGES = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' }
  ];
  
  export const COMPARISON_PERIODS = [
    { label: 'Day over Day', value: 'dod' },
    { label: 'Week over Week', value: 'wow' },
    { label: 'Month over Month', value: 'mom' },
    { label: 'Year over Year', value: 'yoy' }
  ];
  
  export const AGGREGATION_TYPES = [
    { label: 'Sum', value: 'sum' },
    { label: 'Average', value: 'average' },
    { label: 'Count', value: 'count' },
    { label: 'Min', value: 'min' },
    { label: 'Max', value: 'max' }
  ];
  
  export const NUMBER_FORMATS = [
    { label: 'Number', value: 'number' },
    { label: 'Currency', value: 'currency' },
    { label: 'Percentage', value: 'percentage' },
    { label: 'Abbreviated', value: 'abbreviated' }
  ];
  
  export const KPI_METRICS = [
    { label: 'Total', value: 'total', icon: '📊' },
    { label: 'Average', value: 'average', icon: '📈' },
    { label: 'Growth', value: 'growth', icon: '📉' },
    { label: 'Trend', value: 'trend', icon: '📈' },
    { label: 'Min', value: 'min', icon: '⬇️' },
    { label: 'Max', value: 'max', icon: '⬆️' },
    { label: 'Count', value: 'count', icon: '🔢' }
  ];
  
  export const REFRESH_INTERVALS = [
    { label: 'Off', value: 0 },
    { label: '5 seconds', value: 5000 },
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 },
    { label: '5 minutes', value: 300000 }
  ];
  
  export const GRID_CONFIG = {
    cols: { lg: 12, md: 8, sm: 4, xs: 2 },
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480 },
    rowHeight: 100,
    margin: [10, 10],
    containerPadding: [20, 20],
    compactType: 'vertical',
    preventCollision: false
  };
  
  export const DEFAULT_WIDGET_CONFIG = {
    title: 'New Widget',
    subtitle: '',
    showKPIs: true,
    showFilters: true,
    showLegend: true,
    showGrid: true,
    animations: true,
    color: '#3B82F6',
    dataPoints: 12,
    refreshInterval: 0,
    aggregation: 'sum',
    timeRange: 'monthly',
    comparisonPeriod: null,
    kpiMetrics: ['total', 'average', 'growth'],
    numberFormat: 'number',
    theme: 'inherit' // inherit, light, dark
  };
  
  export const PROFESSIONAL_KPI_CONFIGS = {
    REVENUE: {
      title: 'Total Revenue',
      value: 847293,
      currency: '$',
      growth: 4.1,
      icon: '💰',
      iconBgColor: 'rgba(16, 185, 129, 0.1)', // Emerald bg with opacity
      iconColor: '#10B981', // Emerald
      subtitle: 'from last week',
      formatType: 'currency'
    },
    ORDERS: {
      title: 'Orders',
      value: 2847,
      currency: '',
      growth: 2.6,
      icon: '📦',
      iconBgColor: 'rgba(59, 130, 246, 0.1)', // Blue bg with opacity
      iconColor: '#3B82F6', // Blue
      subtitle: 'from last week',
      formatType: 'number'
    },
    CUSTOMERS: {
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
  };
  
  export const GRADIENT_CHART_COLORS = {
  BAR_CHART: {
    startColor: '#00E5FF',
    endColor: '#00FF85'
  },
  FUNNEL_CHART: {
    startColor: '#00E5FF',
    endColor: '#00FF85'
  },
  PROFESSIONAL_BAR_CHART: {
    startColor: 'rgba(0, 201, 255, 0.85)',
    endColor: 'rgba(146, 254, 157, 0.85)'
  }
};

export const PROFESSIONAL_WIDGET_CONFIGS = {
  BAR_CHART: {
    title: 'Bar Chart',
    mainValue: 242673,
    prefix: '$',
    timeFilter: 'Week',
    data: [
      { month: 'JAN', value: 75000, height: 131 },
      { month: 'MAR', value: 58000, height: 100 },
      { month: 'MAY', value: 42000, height: 73 },
      { month: 'JUL', value: 67000, height: 111 }
    ],
    yAxisLabels: ['100K', '50K', '10K', '0'],
    maxHeight: 178
  },
  KPI_CARD: {
    title: 'Total Revenue',
    value: 847293,
    prefix: '$',
    growth: 4.1,
    growthDirection: 'up',
    growthText: 'from last week',
    icon: '💰',
    iconBg: '#E6F7FF',
    growthColor: '#F0F9FF',
    growthTextColor: '#0EA5E9'
  }
};
  
  export const SAMPLE_TEMPLATES = [
    {
      id: 'sales-dashboard',
      name: 'Sales Dashboard',
      description: 'Track sales performance and revenue',
      thumbnail: '💰',
      widgets: [
        {
          type: WIDGET_TYPES.KPI_CARD,
          position: { x: 0, y: 0, w: 3, h: 2 },
          config: { title: 'Total Revenue', kpiMetrics: ['total'] }
        },
        {
          type: WIDGET_TYPES.KPI_CARD,
          position: { x: 3, y: 0, w: 3, h: 2 },
          config: { title: 'Average Order', kpiMetrics: ['average'] }
        },
        {
          type: WIDGET_TYPES.KPI_CARD,
          position: { x: 6, y: 0, w: 3, h: 2 },
          config: { title: 'Growth Rate', kpiMetrics: ['growth'] }
        },
        {
          type: WIDGET_TYPES.KPI_CARD,
          position: { x: 9, y: 0, w: 3, h: 2 },
          config: { title: 'Conversion', kpiMetrics: ['percentage'] }
        },
        {
          type: WIDGET_TYPES.LINE_CHART,
          position: { x: 0, y: 2, w: 6, h: 4 },
          config: { title: 'Revenue Trend', timeRange: 'monthly' }
        },
        {
          type: WIDGET_TYPES.BAR_CHART,
          position: { x: 6, y: 2, w: 6, h: 4 },
          config: { title: 'Sales by Category' }
        }
      ]
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      description: 'Website and user analytics',
      thumbnail: '📊',
      widgets: [
        {
          type: WIDGET_TYPES.LINE_CHART,
          position: { x: 0, y: 0, w: 8, h: 4 },
          config: { title: 'Traffic Overview', timeRange: 'daily' }
        },
        {
          type: WIDGET_TYPES.PIE_CHART,
          position: { x: 8, y: 0, w: 4, h: 4 },
          config: { title: 'Traffic Sources' }
        },
        {
          type: WIDGET_TYPES.FUNNEL_CHART,
          position: { x: 0, y: 4, w: 4, h: 4 },
          config: { title: 'Conversion Funnel' }
        },
        {
          type: WIDGET_TYPES.BAR_CHART,
          position: { x: 4, y: 4, w: 8, h: 4 },
          config: { title: 'Page Views' }
        }
      ]
    }
  ];