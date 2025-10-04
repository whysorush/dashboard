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
      primary: globalColors?.primary || themeConfig?.primary || "#25CFFD",
      secondary: globalColors?.secondary || themeConfig?.secondary || "#A0FCAA",
      accent: globalColors?.accent || themeConfig?.accent || "#63E6D4",
    };
  }, [themeConfig, globalColors]);
};

export default useGlobalColors;
