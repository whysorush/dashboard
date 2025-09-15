// src/pages/DashboardBuilder/components/DashboardBuilder.jsx
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BuilderProvider, useBuilder } from "./context/BuilderContext";
import Canvas from "./components/Canvas";
import ComponentPalette from "./components/ComponentPalette";
import ExportDialog from "./components/ExportDialog";
import { WIDGET_TYPES } from "./constants";
import {
  FiGrid,
  FiEye,
  FiCode,
  FiImage,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import createReferenceDashboard from "./templates/referenceTemplate";
import "./styles/builder.css";
import PopupModal from "./components/PreviewModal";

const DashboardBuilderContent = () => {
  const { widgets, rows, clearCanvas, loadTemplate, addRow, addWidget } =
    useBuilder();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const loadReferenceTemplate = () => {
    clearCanvas();
    const { rows: templateRows, widgets: templateWidgets } =
      createReferenceDashboard();
    loadTemplate(templateRows, templateWidgets);
  };

  return (
    <div className="dashboard-builder-container">
      {/* Header */}
      <div className="db-header sticky top-0 z-50">
        <div className="db-header-content flex-wrap md:flex-nowrap">
          <div className="db-title mb-2 md:mb-0">
            <FiGrid style={{ color: "var(--primary)" }} />
            <span className="hidden sm:inline">
              Row-Based Dashboard Builder
            </span>
            <span className="sm:hidden">Dashboard Builder</span>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm transition-colors"
              title="Preview Dashboard"
            >
              <FiEye className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              onClick={() => setShowExport(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center text-sm transition-colors"
              title="Export Dashboard Code"
            >
              <FiCode className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={loadReferenceTemplate}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center text-sm transition-colors"
              title="Load Reference Template"
            >
              <FiImage className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Template</span>
            </button>

            <button
              onClick={() => {
                clearCanvas();
                const row1 = addRow();
                const row2 = addRow();
                const row3 = addRow();
                addWidget(WIDGET_TYPES.ADVANCED_FILTER_BAR, null, row1);
                addWidget(WIDGET_TYPES.REVENUE_KPI, null, row2);
                addWidget(WIDGET_TYPES.ORDERS_KPI, null, row2);
                addWidget(WIDGET_TYPES.CUSTOMERS_KPI, null, row2);
                addWidget(WIDGET_TYPES.GRADIENT_BAR_CHART, null, row3);
                addWidget(WIDGET_TYPES.SMOOTH_FUNNEL_CHART, null, row3);
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 flex items-center text-sm transition-colors"
              title="Quick Start with Sample Dashboard"
            >
              <FiZap className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Quick Start</span>
            </button>

            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center text-sm transition-colors"
              title="Clear Dashboard"
            >
              <FiTrash2 className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="db-main flex flex-col md:flex-row h-[calc(100vh-60px)]">
        {/* Left Sidebar - Component Palette */}
        <div className="db-sidebar-left">
          <ComponentPalette />
        </div>

        {/* Canvas */}
        <div className="db-canvas flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Canvas />
        </div>
      </div>

      {showPreview && (
        <PopupModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          widgets={widgets}
          rows={rows}
        />
      )}

      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        widgets={widgets}
        rows={rows}
      />
    </div>
  );
};

const DashboardBuilder = () => (
  <DndProvider backend={HTML5Backend}>
    <BuilderProvider>
      <DashboardBuilderContent />
    </BuilderProvider>
  </DndProvider>
);

export default DashboardBuilder;
