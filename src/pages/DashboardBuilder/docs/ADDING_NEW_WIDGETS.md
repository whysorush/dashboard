# Adding New Widgets to the Export System

This guide explains how to add new widget types to the dashboard export system so they automatically appear in generated code.

## Overview

The export system has been redesigned to be **completely dynamic**. When you add a new widget to ComponentPalette, it will automatically be included in the exported code by following these simple steps:

## Step 1: Add Widget Constants

First, add your new widget type to the constants file:

```javascript
// src/pages/DashboardBuilder/constants.js
export const WIDGET_TYPES = {
  // ... existing widgets
  NEW_CUSTOM_WIDGET: "new-custom-widget",
};
```

## Step 2: Register Widget in Export Registry

Add your widget to the export registry:

```javascript
// src/pages/DashboardBuilder/utils/widgetExportRegistry.js

// Add to WIDGET_FALLBACK_DATA
export const WIDGET_FALLBACK_DATA = {
  // ... existing widgets
  [WIDGET_TYPES.NEW_CUSTOM_WIDGET]: [
    { name: "Data 1", value: 100 },
    { name: "Data 2", value: 200 },
    // ... your fallback data
  ],
};

// Add to WIDGET_EXPORT_CONFIGS
export const WIDGET_EXPORT_CONFIGS = {
  // ... existing widgets
  [WIDGET_TYPES.NEW_CUSTOM_WIDGET]: {
    template: 'new-custom-widget',
    requiresRecharts: false, // or true if using Recharts
    dataType: 'array', // or 'object'
  },
};
```

## Step 3: Add Widget Template

Add your widget's JSX template to the template generator:

```javascript
// src/pages/DashboardBuilder/utils/widgetTemplateGenerator.js

// Add to the appropriate category checker
const isCustomWidget = (type) => {
  const customTypes = [
    WIDGET_TYPES.NEW_CUSTOM_WIDGET,
    // ... other custom widgets
  ];
  return customTypes.includes(type);
};

// Add template function
const getCustomTemplate = (customType) => {
  switch (customType) {
    case WIDGET_TYPES.NEW_CUSTOM_WIDGET:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
          <div style={styles.title}>${title}</div>
          {/* Your custom JSX here */}
          <div>Custom widget content using {${dataVar}}</div>
        </div>
      `;
    // ... other custom widgets
    default:
      return getUnknownTemplate();
  }
};

// Update getWidgetTemplate function
const getWidgetTemplate = (widgetType) => {
  // ... existing checks
  
  // Custom templates
  if (isCustomWidget(widgetType)) {
    return getCustomTemplate(widgetType);
  }
  
  // Fallback template
  return getUnknownTemplate();
};
```

## Step 4: Add to ComponentPalette

Add your widget to the ComponentPalette configuration:

```javascript
// src/pages/DashboardBuilder/constants.js
export const WIDGET_CATEGORIES = {
  // ... existing categories
  CUSTOM_WIDGETS: {
    label: "Custom Widgets",
    icon: "🎨",
    widgets: [
      {
        type: WIDGET_TYPES.NEW_CUSTOM_WIDGET,
        label: "New Custom Widget",
        icon: "🎨",
        description: "Description of your custom widget",
        defaultSize: { w: 6, h: 4 },
      },
    ],
  },
};
```

## Step 5: Add to Canvas and Preview

Add your widget to the Canvas renderer:

```javascript
// src/pages/DashboardBuilder/components/Canvas.jsx
import NewCustomWidget from "./widgets/NewCustomWidget";

// In renderWidget function
switch (widget.type) {
  // ... existing cases
  case WIDGET_TYPES.NEW_CUSTOM_WIDGET:
    return <NewCustomWidget {...props} />;
  // ... rest of cases
}
```

Add to the Preview component:

```javascript
// src/pages/DashboardBuilder/components/PreviewModal/DashboardPreview.jsx
import NewCustomWidget from "../widgets/NewCustomWidget";

// In renderWidget function
switch (widget.type) {
  // ... existing cases
  case WIDGET_TYPES.NEW_CUSTOM_WIDGET:
    return <NewCustomWidget {...props} />;
  // ... rest of cases
}
```

## That's It! 🎉

Once you complete these steps, your new widget will:

- ✅ Appear in ComponentPalette
- ✅ Be draggable to the canvas
- ✅ Show in preview mode
- ✅ **Automatically appear in exported code**
- ✅ Include proper imports (Recharts, etc.)
- ✅ Include fallback data
- ✅ Work with all export modes

## Widget Template Guidelines

### For Chart Widgets
- Set `requiresRecharts: true`
- Use `dataType: 'array'`
- Include proper Recharts components in template

### For KPI Widgets
- Set `requiresRecharts: false`
- Use `dataType: 'object'`
- Include KPI-style layout with value and delta

### For Table Widgets
- Set `requiresRecharts: false`
- Use `dataType: 'array'`
- Include table structure with headers and rows

### For Filter Widgets
- Set `requiresRecharts: false`
- Use `dataType: 'object'`
- Include form controls and styling

## Example: Adding a Gauge Chart

```javascript
// 1. Constants
GAUGE_CHART: "gauge-chart",

// 2. Registry
[WIDGET_TYPES.GAUGE_CHART]: [
  { name: "Progress", value: 75, max: 100 }
],

[WIDGET_TYPES.GAUGE_CHART]: {
  template: 'gauge-chart',
  requiresRecharts: true,
  dataType: 'array',
},

// 3. Template
case WIDGET_TYPES.GAUGE_CHART:
  return (widget, dataVar, widgetStyle, title) => `
    <div key="${widget.id}" style=${widgetStyle}>
      <div style={styles.title}>${title}</div>
      <ResponsiveContainer width="100%" height={260}>
        <RadialBarChart data={${dataVar}}>
          <RadialBar dataKey="value" fill="#8884d8" />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  `;
```

The widget will now automatically work in all parts of the system!

## Benefits of This System

1. **Automatic Export**: New widgets are automatically included in exports
2. **Maintainable**: All export logic is centralized
3. **Consistent**: Same template system for all widgets
4. **Extensible**: Easy to add new widget categories
5. **Type-Safe**: All widget types are defined in constants
6. **Future-Proof**: System handles new widgets without code changes to core export logic

## Troubleshooting

If your widget doesn't appear in exports:

1. Check that it's added to `WIDGET_EXPORT_CONFIGS`
2. Verify the widget type constant matches exactly
3. Ensure the template function returns valid JSX
4. Check that fallback data is properly structured
5. Verify imports are included if using external libraries
