import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import './styles/grid-layout.css'
import App from './App.jsx'

function Root() {
  useEffect(() => {
    const root = document.documentElement;
    const vars = {
      '--bg': '#f5f5f5',
      '--panel': '#ffffff',
      '--stat-card-bg': '#ffffff',
      '--stat-change-info': '#00000066',
      '--sidebar': '#ffffff',
      '--text': '#525252',
      '--muted': '#6b7280',
      '--table-th-font': '#ffffff',
      '--table-td-font': '#454545',
      '--primary': '#00c9ff',
      '--border': 'rgba(0, 0, 0, 0.08)',
      '--bar-track': '#f5f5f5',
      '--status-pending-bg': '#fff0db',
      '--status-pending-text': '#ff9500',
      '--status-delivered-bg': '#e6fee9',
      '--status-delivered-text': '#07d91e',
      '--status-in-transit-bg': '#e6f9ff',
      '--status-in-transit-text': '#25cffd',
      '--icon-stat-bg': '#e5faff',
      '--icon-stat-font': '#00c9ff',
      '--search-bar-bg': '#f5f5f5',
      '--search-bar-border': '#e7e7e7',
    };
    Object.entries(vars).forEach(([k,v]) => root.style.setProperty(k, v));
  }, []);

  // Base body resets
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial';
    document.body.style.background = 'var(--bg)';
    document.body.style.color = 'var(--text)';
  }, []);

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
