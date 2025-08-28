import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import Canvas from './components/Canvas';
import ComponentPalette from './components/ComponentPalette';
import PreviewModal from './components/PreviewModal';
import ExportDialog from './components/ExportDialog';
import { WIDGET_TYPES } from './constants';
import { FiGrid, FiEye, FiCode, FiImage, FiTrash2, FiZap } from 'react-icons/fi';
import createReferenceDashboard from './templates/referenceTemplate';
import './styles/builder.css';

// Preserved emergency styles for compatibility
const emergencyStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .dashboard-builder-container {
    min-height: 100vh;
    background: #f3f4f6;
    display: flex;
    flex-direction: column;
  }
  
  .db-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 12px 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .db-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .db-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: bold;
    color: #111827;
  }
  
  .db-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .db-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .db-button-primary {
    background: #3b82f6;
    color: white;
  }
  
  .db-button-primary:hover {
    background: #2563eb;
  }
  
  .db-button-success {
    background: #10b981;
    color: white;
  }
  
  .db-button-success:hover {
    background: #059669;
  }
  
  .db-button-icon {
    padding: 8px;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }
  
  .db-button-icon:hover {
    background: #f3f4f6;
  }
  
  .db-main {
    display: flex;
    flex: 1;
    height: calc(100vh - 60px);
    overflow: hidden;
  }
  
  .db-sidebar-left {
    width: 250px;
    background: white;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
    padding: 16px;
  }
  
  .db-canvas {
    flex: 1;
    background: #f9fafb;
    overflow: auto;
    padding: 20px;
    position: relative;
  }
  
  .db-sidebar-right {
    width: 320px;
    background: white;
    border-left: 1px solid #e5e7eb;
    overflow-y: auto;
    padding: 16px;
  }
  
  .widget-palette-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #111827;
  }
  
  .widget-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    cursor: move;
    transition: all 0.2s;
  }
  
  .widget-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .widget-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .widget-icon {
    font-size: 24px;
  }
  
  .widget-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }
  
  .widget-info p {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
  
  .canvas-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
  }
  
  .canvas-empty-content {
    text-align: center;
    padding: 40px;
  }
  
  .canvas-empty-icon {
    font-size: 64px;
    opacity: 0.2;
    margin-bottom: 16px;
  }
  
  .canvas-empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 8px;
  }
  
  .canvas-empty-text {
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  .properties-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .properties-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
  }
  
  .close-button:hover {
    background: #f3f4f6;
  }
  
  .property-group {
    margin-bottom: 20px;
  }
  
  .property-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }
  
  .property-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .property-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-body {
    flex: 1;
    overflow: auto;
    padding: 20px;
    background: #f9fafb;
  }
  
  .preview-content {
    background: white;
    border-radius: 8px;
    padding: 24px;
    min-height: 500px;
  }
  
  .widget-container {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .widget-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #111827;
  }
  
  .divider {
    width: 1px;
    height: 24px;
    background: #d1d5db;
    margin: 0 8px;
  }
  
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
    min-height: 400px;
  }
  
  .grid-item {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
`;

// Inner component to access context
const DashboardBuilderContent = () => {
  const { widgets, rows, clearCanvas, loadTemplate, addRow, addWidget } = useBuilder();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  // Load reference dashboard template
  const loadReferenceTemplate = () => {
    // First clear the canvas
    clearCanvas();
    
    // Get reference template data
    const { rows: templateRows, widgets: templateWidgets } = createReferenceDashboard();
    
    // Load the template
    loadTemplate(templateRows, templateWidgets);
  };
  
  return (
    <div className="dashboard-builder-container">
      {/* Header */}
      <div className="db-header sticky top-0 z-50">
        <div className="db-header-content flex-wrap md:flex-nowrap">
          <div className="db-title mb-2 md:mb-0">
            <FiGrid style={{ color: '#3b82f6' }} />
            <span className="hidden sm:inline">Row-Based Dashboard Builder</span>
            <span className="sm:hidden">Dashboard Builder</span>
          </div>
          
          {/* Header Actions */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm transition-colors"
              title="Preview Dashboard"
            >
              <FiEye className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center text-sm transition-colors"
              title="Export Dashboard Code"
            >
              <FiCode className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={loadReferenceTemplate}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center text-sm transition-colors"
              title="Load Reference Template"
            >
              <FiImage className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Template</span>
            </button>
            <button
              onClick={() => {
                clearCanvas();
                // Create a sample dashboard with 3 rows
                const row1 = addRow();
                const row2 = addRow();
                const row3 = addRow();
                
                // Add filter widget to row 1
                addWidget(WIDGET_TYPES.ADVANCED_FILTER_BAR, null, row1);
                
                // Add 3 KPI widgets to row 2
                addWidget(WIDGET_TYPES.REVENUE_KPI, null, row2);
                addWidget(WIDGET_TYPES.ORDERS_KPI, null, row2);
                addWidget(WIDGET_TYPES.CUSTOMERS_KPI, null, row2);
                
                // Add 2 chart widgets to row 3
                addWidget(WIDGET_TYPES.GRADIENT_BAR_CHART, null, row3);
                addWidget(WIDGET_TYPES.SMOOTH_FUNNEL_CHART, null, row3);
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 flex items-center text-sm transition-colors"
              title="Quick Start with Sample Dashboard"
            >
              <FiZap className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Quick Start</span>
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center text-sm transition-colors"
              title="Clear Dashboard"
            >
              <FiTrash2 className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="db-main flex flex-col md:flex-row h-[calc(100vh-60px)]">
        {/* Left Sidebar - Component Palette */}
        <div className="db-sidebar-left w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 md:h-full overflow-y-auto">
          <ComponentPalette />
        </div>

        {/* Canvas */}
        <div className="db-canvas flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Canvas />
        </div>
      </div>
      
      {/* Modals */}
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        widgets={widgets}
        rows={rows}
      />
      
      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        widgets={widgets}
      />
    </div>
  );
};

const DashboardBuilder = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderProvider>
        <DashboardBuilderContent />
      </BuilderProvider>
    </DndProvider>
  );
};

export default DashboardBuilder;