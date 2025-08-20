// src/pages/DashboardBuilder/constants.js

export const WIDGET_TYPES = {
    LINE_CHART: 'line-chart',
    BAR_CHART: 'bar-chart',
    AREA_CHART: 'area-chart',
    PIE_CHART: 'pie-chart',
    FUNNEL_CHART: 'funnel-chart',
    KPI_CARD: 'kpi-card',
    DATA_TABLE: 'data-table'
  };
  
  export const WIDGET_CATEGORIES = {
    CHARTS: {
      label: 'Charts',
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
      label: 'Metrics',
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
      label: 'Tables',
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