// src/utils/themeUtils.js
import { useTheme } from '../context/ThemeContext';
import { useMemo, useCallback } from 'react';

/**
 * Hook to get theme-aware styling utilities
 */
export const useThemeStyles = () => {
  const { theme, styleMode, themeConfig, isDark, globalColors } = useTheme();

  /**
   * Get chart colors based on current theme and style mode
   */
  const getChartColors = useCallback(() => {
    // Use global colors if available, otherwise fall back to theme colors
    return {
      primary: globalColors?.primary || themeConfig.primary,
      secondary: globalColors?.secondary || themeConfig.secondary,
      accent: globalColors?.accent || themeConfig.accent,
      background: themeConfig.background,
      surface: themeConfig.surface,
      text: themeConfig.text,
      textSecondary: themeConfig.textSecondary,
      border: themeConfig.border,
      grid: themeConfig.chartGrid
    };
  }, [themeConfig, globalColors]);

  /**
   * Get style mode specific properties
   */
  const getStyleProperties = () => {
    const styleConfigs = {
      default: {
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial',
        borderRadius: '6px',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        spacing: '1rem',
        animationDuration: '0.2s'
      },
      professional: {
        fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
        borderRadius: '8px',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        spacing: '1.25rem',
        animationDuration: '0.15s'
      },
      minimal: {
        fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
        borderRadius: '0px',
        shadow: 'none',
        spacing: '0.75rem',
        animationDuration: '0.1s'
      },
      colorful: {
        fontFamily: 'Poppins, "Comic Sans MS", cursive',
        borderRadius: '16px',
        shadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
        spacing: '1.5rem',
        animationDuration: '0.3s'
      }
    };

    return styleConfigs[styleMode] || styleConfigs.default;
  };

  /**
   * Generate CSS custom properties object for inline styles
   */
  const getCSSVariables = () => {
    const colors = getChartColors();
    const styleProps = getStyleProperties();
    
    return {
      '--chart-primary': colors.primary,
      '--chart-secondary': colors.secondary,
      '--chart-accent': colors.accent,
      '--chart-background': colors.background,
      '--chart-surface': colors.surface,
      '--chart-text': colors.text,
      '--chart-text-secondary': colors.textSecondary,
      '--chart-border': colors.border,
      '--chart-grid': colors.grid,
      '--style-fontFamily': styleProps.fontFamily,
      '--style-borderRadius': styleProps.borderRadius,
      '--style-shadow': styleProps.shadow,
      '--style-spacing': styleProps.spacing,
      '--style-animationDuration': styleProps.animationDuration
    };
  };

  /**
   * Get responsive chart height based on widget size
   */
  const getChartHeight = (size = 'medium') => {
    const heights = {
      small: 200,
      medium: 300,
      large: 400
    };
    return heights[size] || heights.medium;
  };

  /**
   * Get color palette for charts with multiple data series
   */
  const getColorPalette = (count = 5) => {
    const colors = getChartColors();
    const baseColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#10B981', // emerald
      '#EF4444'  // red
    ];

    return baseColors.slice(0, count);
  };

  /**
   * Generate gradient colors for area charts and fills
   */
  const getGradientColors = (baseColor) => {
    const colors = getChartColors();
    const primaryColor = baseColor || colors.primary;
    if (isDark) {
      return {
        start: `${primaryColor}40`,
        end: `${primaryColor}10`
      };
    }
    return {
      start: `${primaryColor}60`,
      end: `${primaryColor}20`
    };
  };

  /**
   * Get tooltip styling based on theme
   */
  const getTooltipStyle = () => {
    return {
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      border: `1px solid ${themeConfig.border}`,
      borderRadius: getStyleProperties().borderRadius,
      boxShadow: isDark 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 2px 5px rgba(0, 0, 0, 0.1)',
      color: themeConfig.text
    };
  };

  /**
   * Get animation configuration based on style mode
   */
  const getAnimationConfig = (enabled = true) => {
    const duration = getStyleProperties().animationDuration;
    return {
      duration: enabled ? parseInt(duration) * 1000 : 0,
      easing: 'ease-in-out'
    };
  };

  return {
    theme,
    styleMode,
    isDark,
    themeConfig,
    getChartColors,
    getStyleProperties,
    getCSSVariables,
    getChartHeight,
    getColorPalette,
    getGradientColors,
    getTooltipStyle,
    getAnimationConfig
  };
};

/**
 * Utility function to generate theme-aware className strings
 */
export const getThemeClasses = (baseClasses = '', theme = 'light', styleMode = 'default') => {
  const themeClass = `theme-${theme}`;
  const styleClass = `style-mode-${styleMode}`;
  
  return `${baseClasses} ${themeClass} ${styleClass}`.trim();
};

/**
 * Utility function to generate responsive chart configuration
 */
export const getResponsiveChartConfig = (width, height, themeConfig) => {
  return {
    width,
    height,
    margin: {
      top: 20,
      right: 30,
      left: 20,
      bottom: 20
    },
    colors: {
      primary: themeConfig.primary,
      secondary: themeConfig.secondary,
      accent: themeConfig.accent
    }
  };
};

/**
 * Utility function to generate chart axis configuration
 */
export const getAxisConfig = (themeConfig, isDark = false) => {
  return {
    tick: {
      fontSize: 12,
      fill: themeConfig.textSecondary
    },
    axisLine: {
      stroke: themeConfig.border
    },
    tickLine: {
      stroke: themeConfig.border
    }
  };
};

export default useThemeStyles;
