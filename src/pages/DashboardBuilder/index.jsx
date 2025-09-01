import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BuilderProvider, useBuilder } from "./context/BuilderContext";
import Canvas from "./components/Canvas";
import ComponentPalette from "./components/ComponentPalette";
import PreviewModal from "./components/PreviewModal";
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
import PopupModal from "./components/PreviewModal/popupModal";

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
    <div className="top-header-section">
      {/* Header */}
      {/* Header */}
      <header className="db-header">
        <div className="db-header-content">
          <div className="db-title">
            <FiGrid className="db-title-icon" />
            <span>Row-Based Dashboard Builder</span>
          </div>

          <div className="db-toolbar">
            <button
              onClick={() => setShowPreview(true)}
              className="db-button db-button-primary"
              title="Preview Dashboard"
            >
              <FiEye /> <span className="btn-text">Preview</span>
            </button>

            <button
              onClick={() => setShowExport(true)}
              className="db-button db-button-success"
              title="Export Dashboard Code"
            >
              <FiCode /> <span className="btn-text">Export</span>
            </button>

            <button
              onClick={loadReferenceTemplate}
              className="db-button db-button-accent"
              title="Load Reference Template"
            >
              <FiImage /> <span className="btn-text">Template</span>
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
              className="db-button db-button-warn"
              title="Quick Start with Sample Dashboard"
            >
              <FiZap /> <span className="btn-text">Quick Start</span>
            </button>

            <button
              onClick={clearCanvas}
              className="db-button db-button-danger"
              title="Clear Dashboard"
            >
              <FiTrash2 /> <span className="btn-text">Clear</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="db-main">
        <aside className="db-sidebar-left">
          <ComponentPalette />
        </aside>
        <main className="db-canvas">
          <Canvas />
        </main>
      </div>

      {/* Modals */}
      {/* <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        widgets={widgets}
        rows={rows}
      /> */}

      {showPreview && (
        <PopupModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          widgets={widgets}
          rows={rows}
        />
      )}

      {/* Modals */}
      {/* <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        widgets={widgets}
        rows={rows}
      /> */}
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
