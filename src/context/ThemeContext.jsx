// src/context/ThemeContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

// Define available themes and style modes
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

export const STYLE_MODES = {
  DEFAULT: "default",
  PROFESSIONAL: "professional",
  MINIMAL: "minimal",
  COLORFUL: "colorful",
};

// Theme configurations for different style modes
export const THEME_CONFIGS = {
  [STYLE_MODES.DEFAULT]: {
    light: {
      primary: "#25CFFD",
      secondary: "#A0FCAA",
      accent: "#63E6D4",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#181D28",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      chartGrid: "#f3f4f6",
    },
    dark: {
      primary: "#60A5FA",
      secondary: "#34D399",
      accent: "#FBBF24",
      background: "#181D28",
      surface: "#111827",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#374151",
      chartGrid: "#374151",
    },
  },
  [STYLE_MODES.PROFESSIONAL]: {
    light: {
      primary: "#1e40af",
      secondary: "#059669",
      accent: "#d97706",
      background: "#ffffff",
      surface: "#f1f5f9",
      text: "#0f172a",
      textSecondary: "#475569",
      border: "#cbd5e1",
      chartGrid: "#e2e8f0",
    },
    dark: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#f59e0b",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#cbd5e1",
      border: "#475569",
      chartGrid: "#334155",
    },
  },
  [STYLE_MODES.MINIMAL]: {
    light: {
      primary: "#000000",
      secondary: "#4b5563",
      accent: "#6b7280",
      background: "#ffffff",
      surface: "#fafafa",
      text: "#000000",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      chartGrid: "#f5f5f5",
    },
    dark: {
      primary: "#ffffff",
      secondary: "#d1d5db",
      accent: "#9ca3af",
      background: "#000000",
      surface: "#111111",
      text: "#ffffff",
      textSecondary: "#9ca3af",
      border: "#374151",
      chartGrid: "#181D28",
    },
  },
  [STYLE_MODES.COLORFUL]: {
    light: {
      primary: "#8b5cf6",
      secondary: "#06b6d4",
      accent: "#f59e0b",
      background: "#ffffff",
      surface: "#fef3c7",
      text: "#181D28",
      textSecondary: "#4b5563",
      border: "#d1d5db",
      chartGrid: "#fef3c7",
    },
    dark: {
      primary: "#a78bfa",
      secondary: "#22d3ee",
      accent: "#fbbf24",
      background: "#0f0f23",
      surface: "#1e1b4b",
      text: "#f8fafc",
      textSecondary: "#cbd5e1",
      border: "#4338ca",
      chartGrid: "#312e81",
    },
  },
};

// Style mode specific configurations
const getStyleModeConfig = (styleMode) => {
  const configs = {
    [STYLE_MODES.DEFAULT]: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial',
      borderRadius: "6px",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      spacing: "1rem",
      animationDuration: "0.2s",
    },
    [STYLE_MODES.PROFESSIONAL]: {
      fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
      borderRadius: "8px",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      spacing: "1.25rem",
      animationDuration: "0.15s",
    },
    [STYLE_MODES.MINIMAL]: {
      fontFamily: "SF Mono, Monaco, Inconsolata, monospace",
      borderRadius: "0px",
      shadow: "none",
      spacing: "0.75rem",
      animationDuration: "0.1s",
    },
    [STYLE_MODES.COLORFUL]: {
      fontFamily: 'Poppins, "Comic Sans MS", cursive',
      borderRadius: "16px",
      shadow: "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)",
      spacing: "1.5rem",
      animationDuration: "0.3s",
    },
  };

  return configs[styleMode] || configs[STYLE_MODES.DEFAULT];
};

// Create and export the context
export const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Prefer saved theme; otherwise fall back to system preference
    const stored = (() => {
      try {
        return localStorage.getItem("theme");
      } catch {
        return null;
      }
    })();
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  const [styleMode, setStyleMode] = useState(() => {
    // Prefer saved style mode; otherwise default
    const stored = (() => {
      try {
        return localStorage.getItem("styleMode");
      } catch {
        return null;
      }
    })();
    return stored && Object.values(STYLE_MODES).includes(stored)
      ? stored
      : STYLE_MODES.DEFAULT;
  });

  const [globalColors, setGlobalColors] = useState(() => {
    // Prefer saved global colors; otherwise default
    const stored = (() => {
      try {
        return localStorage.getItem("globalColors");
      } catch {
        return null;
      }
    })();
    return stored ? JSON.parse(stored) : null;
  });

  // Update localStorage and document class when theme changes
  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    // Update document class for Tailwind dark mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Update localStorage when style mode changes
  useEffect(() => {
    try {
      localStorage.setItem("styleMode", styleMode);
    } catch {}
  }, [styleMode]);

  // Update localStorage when global colors change
  useEffect(() => {
    try {
      if (globalColors) {
        localStorage.setItem("globalColors", JSON.stringify(globalColors));
      }
    } catch {}
  }, [globalColors]);

  // Memoized theme application to prevent unnecessary re-renders
  const applyTheme = useCallback(() => {
    const currentThemeConfig = THEME_CONFIGS[styleMode]?.[theme];
    if (currentThemeConfig && typeof window !== "undefined") {
      const root = document.documentElement;

      // Merge global colors with theme config
      const mergedThemeConfig = {
        ...currentThemeConfig,
        ...(globalColors && {
          primary: globalColors.primary,
          secondary: globalColors.secondary,
          accent: globalColors.accent,
        }),
      };

      // Batch DOM updates for better performance
      requestAnimationFrame(() => {
        // Apply theme variables
        Object.entries(mergedThemeConfig).forEach(([key, value]) => {
          root.style.setProperty(`--theme-${key}`, value);
        });

        // Apply additional CSS variables for comprehensive theming
        root.style.setProperty("--chart-primary", mergedThemeConfig.primary);
        root.style.setProperty(
          "--chart-secondary",
          mergedThemeConfig.secondary
        );
        root.style.setProperty("--chart-accent", mergedThemeConfig.accent);
        root.style.setProperty(
          "--chart-background",
          mergedThemeConfig.background
        );
        root.style.setProperty("--chart-surface", mergedThemeConfig.surface);
        root.style.setProperty("--chart-text", mergedThemeConfig.text);
        root.style.setProperty(
          "--chart-text-secondary",
          mergedThemeConfig.textSecondary
        );
        root.style.setProperty("--chart-border", mergedThemeConfig.border);
        root.style.setProperty("--chart-grid", mergedThemeConfig.chartGrid);

        // Apply global colors as CSS custom properties
        if (globalColors) {
          root.style.setProperty("--global-primary", globalColors.primary);
          root.style.setProperty("--global-secondary", globalColors.secondary);
          root.style.setProperty("--global-accent", globalColors.accent);

          // Also set legacy variables for DashboardBuilder compatibility
          root.style.setProperty("--primary", globalColors.primary);
          root.style.setProperty("--secondary", globalColors.secondary);
          root.style.setProperty("--accent", globalColors.accent);
        }

        // Set DashboardBuilder-specific CSS variables
        root.style.setProperty("--bg", mergedThemeConfig.background);
        root.style.setProperty("--panel", mergedThemeConfig.surface);
        root.style.setProperty("--text", mergedThemeConfig.text);
        root.style.setProperty("--border", mergedThemeConfig.border);
        root.style.setProperty("--muted", mergedThemeConfig.textSecondary);
        root.style.setProperty("--stat-card-bg", mergedThemeConfig.surface);
        root.style.setProperty("--search-bar-bg", mergedThemeConfig.background);
        root.style.setProperty("--table-th-font", mergedThemeConfig.text);
        root.style.setProperty("--table-td-font", mergedThemeConfig.text);
        root.style.setProperty("--bar-track", mergedThemeConfig.chartGrid);
        // Apply style mode specific variables
        const styleModeConfig = getStyleModeConfig(styleMode);
        root.style.setProperty("--font-family", styleModeConfig.fontFamily);
        Object.entries(styleModeConfig).forEach(([key, value]) => {
          root.style.setProperty(`--style-${key}`, value);
        });

        // Add style mode class to document
        document.documentElement.className =
          document.documentElement.className.replace(/style-mode-\w+/g, "") +
          ` style-mode-${styleMode}`;
      });
    }
  }, [theme, styleMode, globalColors]);

  // Apply CSS custom properties based on current theme and style mode
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Sync with system preference changes when user hasn't explicitly chosen
  useEffect(() => {
    const media = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    if (!media) return;
    const stored = (() => {
      try {
        return localStorage.getItem("theme");
      } catch {
        return null;
      }
    })();
    if (stored === "light" || stored === "dark") return; // user preference takes precedence
    const onChange = (e) => setTheme(e.matches ? "dark" : "light");
    media.addEventListener
      ? media.addEventListener("change", onChange)
      : media.addListener(onChange);
    return () => {
      media.removeEventListener
        ? media.removeEventListener("change", onChange)
        : media.removeListener(onChange);
    };
  }, []);

  // Sync across tabs (storage events)
  useEffect(() => {
    const onStorage = (e) => {
      if (
        e.key === "theme" &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Get current theme configuration
  const currentThemeConfig =
    THEME_CONFIGS[styleMode]?.[theme] ||
    THEME_CONFIGS[STYLE_MODES.DEFAULT][theme];

  const value = {
    theme,
    styleMode,
    isDark: theme === "dark",
    setTheme,
    setStyleMode,
    toggleTheme,
    themeConfig: currentThemeConfig,
    globalColors,
    setGlobalColors,
    availableStyleModes: STYLE_MODES,
    availableThemes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Export default provider
export default ThemeProvider;
