// src/pages/DashboardBuilder/index.jsx
import React, { useState, useContext } from 'react';
import { 
  FiGrid, FiEye, FiDownload, FiRotateCcw, FiRotateCw, 
  FiSave, FiSettings, FiHelpCircle 
} from 'react-icons/fi';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { ThemeContext } from '../../context/ThemeContext';
import Canvas from './components/Canvas';
import ComponentPalette from './components/ComponentPalette';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import ExportDialog from './components/ExportDialog';
import GridOverlay from './components/GridOverlay';
// import './styles/builder.css'; // Optional: for any custom styles

const DashboardBuilderContent = () => {
  const { theme } = useContext(ThemeContext);
  const { 
    widgets, 
    selectedWidget, 
    history, 
    historyIndex,
    undo,
    redo,
    clearCanvas 
  } = useBuilder();
  
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);

  const handlePreview = () => {
    if (widgets.length === 0) {
      alert('Please add at least one widget to preview the dashboard');
      return;
    }
    setPreviewModalOpen(true);
  };

  const handleExport = () => {
    if (widgets.length === 0) {
      alert('Please add at least one widget before exporting');
      return;
    }
    setExportDialogOpen(true);
  };

  const handleClearCanvas = () => {
    if (widgets.length > 0 && window.confirm('Are you sure you want to clear all widgets?')) {
      clearCanvas();
    }
  };

  // Auto-open properties panel when a widget is selected
  React.useEffect(() => {
    if (selectedWidget) {
      setPropertiesPanelOpen(true);
    }
  }, [selectedWidget]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiGrid className="text-blue-500" />
                  Dashboard Builder
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {widgets.length} widget{widgets.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                {/* Undo/Redo */}
                <div className="flex items-center gap-1 mr-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 
                             disabled:cursor-not-allowed transition-colors"
                    title="Undo (Ctrl+Z)"
                  >
                    <FiRotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 
                             disabled:cursor-not-allowed transition-colors"
                    title="Redo (Ctrl+Y)"
                  >
                    <FiRotateCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                {/* Grid Toggle */}
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded transition-colors ${
                    showGrid 
                      ? 'bg-gray-100 dark:bg-gray-700 text-blue-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Toggle Grid"
                >
                  <FiGrid className="w-4 h-4" />
                </button>

                {/* Clear Canvas */}
                <button
                  onClick={handleClearCanvas}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Clear Canvas"
                  disabled={widgets.length === 0}
                >
                  <FiRotateCcw className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                {/* Preview & Export */}
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded 
                           hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={widgets.length === 0}
                >
                  <FiEye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded 
                           hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={widgets.length === 0}
                >
                  <FiDownload className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-60px)]">
          {/* Component Palette - Left Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                        overflow-y-auto">
            <ComponentPalette />
          </div>

          {/* Canvas - Center */}
          <div className="flex-1 relative overflow-auto bg-gray-50 dark:bg-gray-900">
            {showGrid && <GridOverlay />}
            <Canvas />
          </div>

          {/* Properties Panel - Right Sidebar */}
          {propertiesPanelOpen && selectedWidget && (
            <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
                          overflow-y-auto">
              <PropertiesPanel onClose={() => setPropertiesPanelOpen(false)} />
            </div>
          )}
        </div>

        {/* Modals */}
        <PreviewModal 
          widgets={widgets}
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
        />
        
        <ExportDialog
          widgets={widgets}
          isOpen={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
        />
      </div>
    </DndProvider>
  );
};

// Main component with provider wrapper
const DashboardBuilder = () => {
  return (
    <BuilderProvider>
      <DashboardBuilderContent />
    </BuilderProvider>
  );
};

export default DashboardBuilder;