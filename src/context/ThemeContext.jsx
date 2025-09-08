// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create and export the context
export const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Prefer saved theme; otherwise fall back to system preference
    const stored = (() => {
      try { return localStorage.getItem('theme'); } catch { return null; }
    })();
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Update localStorage and document class when theme changes
  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync with system preference changes when user hasn't explicitly chosen
  useEffect(() => {
    const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (!media) return;
    const stored = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
    if (stored === 'light' || stored === 'dark') return; // user preference takes precedence
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    media.addEventListener ? media.addEventListener('change', onChange) : media.addListener(onChange);
    return () => {
      media.removeEventListener ? media.removeEventListener('change', onChange) : media.removeListener(onChange);
    };
  }, []);

  // Sync across tabs (storage events)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export default provider
export default ThemeProvider;