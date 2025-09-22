// src/components/ThemeDemo.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useThemeStyles } from '../utils/themeUtils';
import StyleModeSelector from './StyleModeSelector';

const ThemeDemo = () => {
  const { theme, setTheme, styleMode, setStyleMode, isDark } = useTheme();
  const { getChartColors, getStyleProperties, getCSSVariables } = useThemeStyles();

  const colors = getChartColors();
  const styleProps = getStyleProperties();
  const cssVariables = getCSSVariables();

  return (
    <div 
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderRadius: styleProps.borderRadius,
        boxShadow: styleProps.shadow,
        fontFamily: styleProps.fontFamily,
        ...cssVariables
      }}
    >
      <h2 
        className="text-2xl font-bold mb-4"
        style={{ color: colors.text }}
      >
        Theme & Style Mode Demo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Controls */}
        <div className="space-y-4">
          <h3 
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Theme Controls
          </h3>
          
          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                borderRadius: styleProps.borderRadius,
                fontFamily: styleProps.fontFamily
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="space-y-2">
            <label 
              className="block text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              Style Mode
            </label>
            <StyleModeSelector />
          </div>
        </div>

        {/* Color Palette Preview */}
        <div className="space-y-4">
          <h3 
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Color Palette
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="p-3 rounded text-center text-sm font-medium"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                borderRadius: styleProps.borderRadius
              }}
            >
              Primary
            </div>
            <div 
              className="p-3 rounded text-center text-sm font-medium"
              style={{
                backgroundColor: colors.secondary,
                color: 'white',
                borderRadius: styleProps.borderRadius
              }}
            >
              Secondary
            </div>
            <div 
              className="p-3 rounded text-center text-sm font-medium"
              style={{
                backgroundColor: colors.accent,
                color: 'white',
                borderRadius: styleProps.borderRadius
              }}
            >
              Accent
            </div>
            <div 
              className="p-3 rounded text-center text-sm font-medium"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: styleProps.borderRadius
              }}
            >
              Surface
            </div>
          </div>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="mt-6 p-4 rounded" style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: styleProps.borderRadius
      }}>
        <h4 
          className="font-semibold mb-2"
          style={{ color: colors.text }}
        >
          Current Configuration
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span 
              className="font-medium"
              style={{ color: colors.textSecondary }}
            >
              Theme:
            </span>
            <span 
              className="ml-2"
              style={{ color: colors.text }}
            >
              {theme} {isDark ? '(Dark Mode)' : '(Light Mode)'}
            </span>
          </div>
          <div>
            <span 
              className="font-medium"
              style={{ color: colors.textSecondary }}
            >
              Style Mode:
            </span>
            <span 
              className="ml-2"
              style={{ color: colors.text }}
            >
              {styleMode}
            </span>
          </div>
          <div>
            <span 
              className="font-medium"
              style={{ color: colors.textSecondary }}
            >
              Font Family:
            </span>
            <span 
              className="ml-2"
              style={{ color: colors.text }}
            >
              {styleProps.fontFamily}
            </span>
          </div>
          <div>
            <span 
              className="font-medium"
              style={{ color: colors.textSecondary }}
            >
              Border Radius:
            </span>
            <span 
              className="ml-2"
              style={{ color: colors.text }}
            >
              {styleProps.borderRadius}
            </span>
          </div>
        </div>
      </div>

      {/* CSS Variables Preview */}
      <div className="mt-4 p-4 rounded" style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: styleProps.borderRadius
      }}>
        <h4 
          className="font-semibold mb-2"
          style={{ color: colors.text }}
        >
          CSS Variables Applied
        </h4>
        <div className="text-xs font-mono space-y-1" style={{ color: colors.textSecondary }}>
          {Object.entries(cssVariables).slice(0, 8).map(([key, value]) => (
            <div key={key}>
              <span style={{ color: colors.primary }}>{key}</span>: {value}
            </div>
          ))}
          {Object.keys(cssVariables).length > 8 && (
            <div style={{ color: colors.textSecondary }}>
              ... and {Object.keys(cssVariables).length - 8} more variables
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
