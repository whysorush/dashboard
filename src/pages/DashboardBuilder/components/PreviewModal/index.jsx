// src/pages/DashboardBuilder/components/PreviewModal/index.jsx
import React, { useState } from 'react';
import { FiX, FiMonitor, FiSmartphone, FiTablet, FiMaximize2, FiMinimize2, FiSun, FiMoon, FiLayout } from 'react-icons/fi';
import DashboardPreview from './DashboardPreview';

const PreviewModal = ({ isOpen, onClose, widgets, rows }) => {
  const [viewMode, setViewMode] = useState('desktop');
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [layout, setLayout] = useState('standard'); // 'standard', 'compact', or 'spacious'
  
  if (!isOpen) return null;
  
  const getViewportClass = () => {
    switch(viewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-xl';
      case 'desktop':
      default:
        return 'max-w-full';
    }
  };
  
  const getLayoutClass = () => {
    switch(layout) {
      case 'compact':
        return 'gap-2 p-2';
      case 'spacious':
        return 'gap-6 p-6';
      case 'standard':
      default:
        return 'gap-4 p-4';
    }
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl ${
          fullscreen ? 'fixed inset-0 m-0 rounded-none' : 'max-w-7xl w-full max-h-[90vh] m-4'
        } flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-sm mr-2"></span>
            Dashboard Preview
          </h3>
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-2 md:px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                  viewMode === 'desktop' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
                title="Desktop view"
              >
                <FiMonitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`px-2 md:px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                  viewMode === 'tablet' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
                title="Tablet view"
              >
                <FiTablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-2 md:px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                  viewMode === 'mobile' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
                title="Mobile view"
              >
                <FiSmartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === 'light' ? 
                <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : 
                <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              }
            </button>
            
            {/* Layout Options */}
            <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLayout('compact')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  layout === 'compact' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
                title="Compact layout"
              >
                Compact
              </button>
              <button
                onClick={() => setLayout('standard')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  layout === 'standard' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
                title="Standard layout"
              >
                Standard
              </button>
              <button
                onClick={() => setLayout('spacious')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  layout === 'spacious' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
                title="Spacious layout"
              >
                Spacious
              </button>
            </div>
            
            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <FiMinimize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <FiMaximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors"
              title="Close preview"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className={`flex-1 overflow-auto p-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
          <div 
            className={`mx-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-sm border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} transition-all duration-300 ${getViewportClass()} ${getLayoutClass()}`}
            style={{
              boxShadow: viewMode !== 'desktop' ? '0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
            }}
          >
            <DashboardPreview 
              widgets={widgets} 
              rows={rows} 
              viewMode={""} 
              theme={theme}
              layout={layout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
