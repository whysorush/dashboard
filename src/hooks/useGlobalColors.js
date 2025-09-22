// src/hooks/useGlobalColors.js
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Custom hook to get global colors with fallbacks
 * @returns {Object} Object containing primary, secondary, and accent colors
 */
export const useGlobalColors = () => {
  const { themeConfig, globalColors } = useTheme();

  return useMemo(() => {
    // Use global colors if available, otherwise fall back to theme colors
    return {
      primary: globalColors?.primary || themeConfig?.primary || "#27D0FC",
      secondary: globalColors?.secondary || themeConfig?.secondary || "#10B981",
      accent: globalColors?.accent || themeConfig?.accent || "#F59E0B",
    };
  }, [themeConfig, globalColors]);
};

export default useGlobalColors;
