# Theming System Guide

This guide explains how to use the comprehensive theming system implemented in the dashboard builder.

## Overview

The theming system provides:
- **Theme switching** (Light/Dark modes)
- **Style modes** (Default, Professional, Minimal, Colorful)
- **Global CSS variables** for consistent styling
- **Theme-aware components** that automatically adapt to theme changes
- **Utility functions** for easy theme integration

## Core Components

### 1. ThemeProvider

The `ThemeProvider` is the central component that manages theme state and provides theme context to all child components.

```jsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### 2. Theme Context

Access theme information using the `useTheme` hook:

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { 
    theme,           // 'light' or 'dark'
    styleMode,       // 'default', 'professional', 'minimal', 'colorful'
    isDark,          // boolean
    setTheme,        // function to change theme
    setStyleMode,    // function to change style mode
    themeConfig      // current theme configuration object
  } = useTheme();
}
```

### 3. Theme Utilities

Use the `useThemeStyles` hook for theme-aware styling:

```jsx
import { useThemeStyles } from './utils/themeUtils';

function MyComponent() {
  const {
    getChartColors,      // Get color palette
    getStyleProperties,  // Get style mode properties
    getCSSVariables,     // Get CSS custom properties
    getChartHeight,      // Get responsive chart height
    getColorPalette,     // Get color palette for charts
    getTooltipStyle,     // Get tooltip styling
    getAnimationConfig   // Get animation configuration
  } = useThemeStyles();
}
```

## Available Themes

### Light Theme
- Clean, bright appearance
- High contrast text
- Light backgrounds
- Professional color scheme

### Dark Theme
- Dark backgrounds
- Light text
- Reduced eye strain
- Modern appearance

## Available Style Modes

### Default
- Balanced design with modern aesthetics
- Standard border radius (6px)
- Subtle shadows
- System fonts

### Professional
- Clean, business-focused appearance
- Larger border radius (8px)
- Enhanced shadows
- Inter font family

### Minimal
- Simple, distraction-free interface
- No border radius (0px)
- No shadows
- Monospace fonts

### Colorful
- Vibrant, playful color scheme
- Large border radius (16px)
- Colorful shadows
- Poppins font family

## CSS Variables

The system provides comprehensive CSS variables that automatically update based on the current theme and style mode:

### Theme Variables
```css
--theme-primary: #25CFFD;
--theme-secondary: #A0FCAA;
--theme-accent: #63E6D4;
--theme-background: #ffffff;
--theme-surface: #f8fafc;
--theme-text: #1f2937;
--theme-textSecondary: #6b7280;
--theme-border: #e5e7eb;
--theme-chartGrid: #f3f4f6;
```

### Style Mode Variables
```css
--style-fontFamily: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
--style-borderRadius: 6px;
--style-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
--style-spacing: 1rem;
--style-animationDuration: 0.2s;
```

### Chart Variables
```css
--chart-primary: var(--theme-primary);
--chart-secondary: var(--theme-secondary);
--chart-accent: var(--theme-accent);
--chart-background: var(--theme-background);
--chart-surface: var(--theme-surface);
--chart-text: var(--theme-text);
--chart-text-secondary: var(--theme-text-secondary);
--chart-border: var(--theme-border);
--chart-grid: var(--theme-chartGrid);
```

## Usage Examples

### Basic Component Theming

```jsx
import { useThemeStyles } from './utils/themeUtils';

function ThemedComponent() {
  const { getChartColors, getStyleProperties, getCSSVariables } = useThemeStyles();
  
  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();

  return (
    <div 
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderRadius: styleProps.borderRadius,
        fontFamily: styleProps.fontFamily,
        ...cssVariables
      }}
    >
      Themed content
    </div>
  );
}
```

### Chart Component Theming

```jsx
import { useThemeStyles } from './utils/themeUtils';

function ThemedChart() {
  const { 
    getChartColors, 
    getTooltipStyle, 
    getAnimationConfig 
  } = useThemeStyles();
  
  const colors = getChartColors();
  const tooltipStyle = getTooltipStyle();
  const animationConfig = getAnimationConfig();

  return (
    <BarChart>
      <Bar 
        fill={colors.primary}
        animationDuration={animationConfig.duration}
      />
      <Tooltip contentStyle={tooltipStyle} />
    </BarChart>
  );
}
```

### Style Mode Classes

The system automatically applies style mode classes to the document:

```css
/* Professional style mode */
.style-mode-professional {
  --style-fontFamily: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --style-borderRadius: 8px;
  --style-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Minimal style mode */
.style-mode-minimal {
  --style-fontFamily: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  --style-borderRadius: 0px;
  --style-shadow: none;
}
```

## Widget Integration

All dashboard widgets automatically use the theming system:

- **BarChartWidget**: Theme-aware colors, animations, and styling
- **AreaChartWidget**: Gradient colors and smooth animations
- **PieChartWidget**: Color palette and tooltip styling
- **FunnelChartWidget**: Theme-consistent colors and labels
- **KPICardWidget**: Dynamic colors and typography
- **DataTableWidget**: Theme-aware table styling and interactions

## Best Practices

1. **Always use theme utilities**: Use `useThemeStyles()` instead of hardcoded values
2. **Leverage CSS variables**: Use CSS custom properties for consistent theming
3. **Test all style modes**: Ensure components work across all style modes
4. **Use semantic colors**: Use `colors.primary` instead of specific color values
5. **Respect user preferences**: The system automatically saves user preferences

## Migration Guide

To migrate existing components to use the theming system:

1. Import the theme utilities:
```jsx
import { useThemeStyles } from './utils/themeUtils';
```

2. Replace hardcoded styles with theme-aware values:
```jsx
// Before
const styles = {
  backgroundColor: '#ffffff',
  color: '#000000',
  borderRadius: '6px'
};

// After
const { getChartColors, getStyleProperties } = useThemeStyles();
const colors = getChartColors();
const styleProps = getStyleProperties();

const styles = {
  backgroundColor: colors.background,
  color: colors.text,
  borderRadius: styleProps.borderRadius
};
```

3. Use CSS variables for global styling:
```css
/* Before */
.my-component {
  background: #ffffff;
  color: #000000;
}

/* After */
.my-component {
  background: var(--chart-background);
  color: var(--chart-text);
}
```

## Troubleshooting

### Common Issues

1. **Theme not updating**: Ensure the component is wrapped in `ThemeProvider`
2. **Style mode not applying**: Check that the style mode class is applied to the document
3. **Colors not changing**: Verify that you're using theme-aware color functions
4. **CSS variables not working**: Ensure the variables are defined in the CSS

### Debug Tools

Use the `ThemeDemo` component to test theme switching and see current configuration:

```jsx
import ThemeDemo from './components/ThemeDemo';

// Add to your app for debugging
<ThemeDemo />
```

This comprehensive theming system provides a robust foundation for creating consistent, theme-aware dashboard components that automatically adapt to user preferences and style modes.
