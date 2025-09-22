// src/pages/DashboardBuilder/utils/widgetExportRegistry.js

/**
 * Widget Export Registry
 * 
 * This registry defines how each widget type should be exported in generated code.
 * When a new widget is added to ComponentPalette, simply add its export configuration here
 * and it will automatically be included in exported dashboards.
 */

import { WIDGET_TYPES } from '../constants';

// Widget categories for automatic import detection
export const WIDGET_CATEGORIES_EXPORT = {
  RECHARTS_WIDGETS: [
    WIDGET_TYPES.LINE_CHART,
    WIDGET_TYPES.MULTI_LINE_CHART,
    WIDGET_TYPES.BAR_CHART,
    WIDGET_TYPES.AREA_CHART,
    WIDGET_TYPES.PIE_CHART,
    WIDGET_TYPES.FUNNEL_CHART,
    WIDGET_TYPES.GRADIENT_BAR_CHART,
    WIDGET_TYPES.SMOOTH_FUNNEL_CHART,
    WIDGET_TYPES.PROFESSIONAL_BAR_CHART,
  ],
  KPI_WIDGETS: [
    WIDGET_TYPES.KPI_CARD,
    WIDGET_TYPES.REVENUE_KPI,
    WIDGET_TYPES.ORDERS_KPI,
    WIDGET_TYPES.CUSTOMERS_KPI,
    WIDGET_TYPES.PROFESSIONAL_KPI,
    WIDGET_TYPES.PROFESSIONAL_KPI_CARD,
  ],
  TABLE_WIDGETS: [
    WIDGET_TYPES.DATA_TABLE,
    WIDGET_TYPES.PROFESSIONAL_TABLE,
  ],
  FILTER_WIDGETS: [
    WIDGET_TYPES.ADVANCED_FILTER_BAR,
  ],
};

// Default fallback data for each widget type
export const WIDGET_FALLBACK_DATA = {
  [WIDGET_TYPES.LINE_CHART]: [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 32 },
    { name: "Mar", value: 50 },
    { name: "Apr", value: 45 },
    { name: "May", value: 62 },
    { name: "Jun", value: 55 },
  ],
  [WIDGET_TYPES.MULTI_LINE_CHART]: [
    { name: "Jan", value: 40, value2: 32, value3: 28 },
    { name: "Feb", value: 32, value2: 28, value3: 35 },
    { name: "Mar", value: 50, value2: 45, value3: 38 },
    { name: "Apr", value: 45, value2: 38, value3: 42 },
    { name: "May", value: 62, value2: 55, value3: 48 },
    { name: "Jun", value: 55, value2: 48, value3: 52 },
  ],
  [WIDGET_TYPES.BAR_CHART]: [
    { name: "A", value: 24 },
    { name: "B", value: 18 },
    { name: "C", value: 32 },
    { name: "D", value: 28 },
  ],
  [WIDGET_TYPES.AREA_CHART]: [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 20 },
    { name: "Wed", value: 18 },
    { name: "Thu", value: 26 },
    { name: "Fri", value: 22 },
  ],
  [WIDGET_TYPES.PIE_CHART]: [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ],
  [WIDGET_TYPES.FUNNEL_CHART]: [
    { name: "Leads", value: 1000 },
    { name: "Qualified", value: 650 },
    { name: "Proposal", value: 420 },
    { name: "Closed", value: 250 },
  ],
  [WIDGET_TYPES.GRADIENT_BAR_CHART]: [
    { name: "A", value: 24 },
    { name: "B", value: 18 },
    { name: "C", value: 32 },
    { name: "D", value: 28 },
  ],
  [WIDGET_TYPES.SMOOTH_FUNNEL_CHART]: [
    { name: "Leads", value: 1000 },
    { name: "Qualified", value: 650 },
    { name: "Proposal", value: 420 },
    { name: "Closed", value: 250 },
  ],
  [WIDGET_TYPES.PROFESSIONAL_BAR_CHART]: [
    { name: "A", value: 24 },
    { name: "B", value: 18 },
    { name: "C", value: 32 },
    { name: "D", value: 28 },
  ],
  [WIDGET_TYPES.DATA_TABLE]: [
    { id: 1, col1: "Alpha", col2: "Foo", col3: 12 },
    { id: 2, col1: "Beta", col2: "Bar", col3: 22 },
    { id: 3, col1: "Gamma", col2: "Baz", col3: 18 },
  ],
  [WIDGET_TYPES.PROFESSIONAL_TABLE]: [
    { id: 1, order: "#1001", customer: "Acme Inc", status: "Delivered", amount: 1299.99 },
    { id: 2, order: "#1002", customer: "Globex", status: "Pending", amount: 549.50 },
    { id: 3, order: "#1003", customer: "Initech", status: "In-Transit", amount: 239.00 },
  ],
  [WIDGET_TYPES.KPI_CARD]: {
    title: "Total Revenue",
    value: 847293,
    prefix: "$",
    delta: +4.1,
    note: "vs last week",
  },
  [WIDGET_TYPES.REVENUE_KPI]: {
    title: "Revenue",
    value: 847293,
    prefix: "$",
    delta: +4.1,
    note: "vs last week",
  },
  [WIDGET_TYPES.ORDERS_KPI]: {
    title: "Orders",
    value: 2847,
    delta: +2.6,
    note: "vs last week",
  },
  [WIDGET_TYPES.CUSTOMERS_KPI]: {
    title: "Customers",
    value: 12483,
    delta: +2.8,
    note: "vs last week",
  },
  [WIDGET_TYPES.PROFESSIONAL_KPI]: {
    title: "Professional KPI",
    value: 42750,
    prefix: "$",
    delta: +3.2,
    note: "vs last week",
  },
  [WIDGET_TYPES.PROFESSIONAL_KPI_CARD]: {
    title: "Professional KPI",
    value: 42750,
    prefix: "$",
    delta: +3.2,
    note: "vs last week",
  },
  [WIDGET_TYPES.ADVANCED_FILTER_BAR]: {
    dateRange: { from: "", to: "" },
    product: "All",
    status: "All",
    amount: "$0-10K",
    qty: "1-100",
  },
};

// Widget export configurations
export const WIDGET_EXPORT_CONFIGS = {
  [WIDGET_TYPES.LINE_CHART]: {
    template: 'line-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.MULTI_LINE_CHART]: {
    template: 'multi-line-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.BAR_CHART]: {
    template: 'bar-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.AREA_CHART]: {
    template: 'area-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.PIE_CHART]: {
    template: 'pie-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.FUNNEL_CHART]: {
    template: 'funnel-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.GRADIENT_BAR_CHART]: {
    template: 'gradient-bar-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.SMOOTH_FUNNEL_CHART]: {
    template: 'smooth-funnel-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.PROFESSIONAL_BAR_CHART]: {
    template: 'professional-bar-chart',
    requiresRecharts: true,
    dataType: 'array',
  },
  [WIDGET_TYPES.KPI_CARD]: {
    template: 'kpi-card',
    requiresRecharts: false,
    dataType: 'object',
  },
  [WIDGET_TYPES.REVENUE_KPI]: {
    template: 'revenue-kpi',
    requiresRecharts: false,
    dataType: 'object',
  },
  [WIDGET_TYPES.ORDERS_KPI]: {
    template: 'orders-kpi',
    requiresRecharts: false,
    dataType: 'object',
  },
  [WIDGET_TYPES.CUSTOMERS_KPI]: {
    template: 'customers-kpi',
    requiresRecharts: false,
    dataType: 'object',
  },
  [WIDGET_TYPES.PROFESSIONAL_KPI]: {
    template: 'professional-kpi',
    requiresRecharts: false,
    dataType: 'object',
  },
  [WIDGET_TYPES.PROFESSIONAL_KPI_CARD]: {
    template: 'professional-kpi-card',
    requiresRecharts: false,
    dataType: 'object',
  },
  [WIDGET_TYPES.DATA_TABLE]: {
    template: 'data-table',
    requiresRecharts: false,
    dataType: 'array',
  },
  [WIDGET_TYPES.PROFESSIONAL_TABLE]: {
    template: 'professional-table',
    requiresRecharts: false,
    dataType: 'array',
  },
  [WIDGET_TYPES.ADVANCED_FILTER_BAR]: {
    template: 'advanced-filter-bar',
    requiresRecharts: false,
    dataType: 'object',
  },
};

// Helper functions
export const needsRecharts = (widgets = []) => {
  return widgets.some((w) => {
    const config = WIDGET_EXPORT_CONFIGS[w.type];
    return config && config.requiresRecharts;
  });
};

export const getFallbackData = (widgetType) => {
  return WIDGET_FALLBACK_DATA[widgetType] || [];
};

export const getWidgetConfig = (widgetType) => {
  return WIDGET_EXPORT_CONFIGS[widgetType] || {
    template: 'unknown',
    requiresRecharts: false,
    dataType: 'object',
  };
};

export const getAllSupportedWidgetTypes = () => {
  return Object.keys(WIDGET_EXPORT_CONFIGS);
};

export const isWidgetSupported = (widgetType) => {
  return widgetType in WIDGET_EXPORT_CONFIGS;
};
