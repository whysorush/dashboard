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
// import "./styles/builder.css";
import PreviewPopupModal from "./components/PreviewModal";
import WarningNotification from "./components/WarningNotification";
import ThemeToggle from "../../components/ThemeToggle";
import StyleModeSelector from "../../components/StyleModeSelector";
import ColorPalette from "../../components/ColorPalette";
import UploadExcel from "./components/UploadExcel";
import ExcelUploadWithHeaderDropdown from "./components/ExcelUploadWithHeaderDropdown";
import InitialDataTable from "./components/InitialDataTable";
import * as XLSX from "xlsx";
import { ExcelDataProvider, useExcelData } from "./components/ExcelDataContext";

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "var(--panel)",
    borderBottom: "1px solid var(--border)",
    padding: "12px 16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "var(--text)",
    marginBottom: 8,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    // width: "100%",
    justifyContent: "end",
  },
  main: {
    display: "flex",
  },
  sidebarLeft: {
    width: 250,
    background: "var(--panel)",
    borderRight: "1px solid var(--border)",
    overflowY: "auto",
    height: "100vh",
  },
  canvas: {
    flex: 1,
    background: "var(--bg)",
    overflow: "auto",
    height: "100vh",
  },
  button: (bg, hoverBg) => ({
    padding: "5px 10px",
    background: bg,
    color: "white",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    transition: "background-color 0.2s",
    border: "none",
    cursor: "pointer",
  }),
  icon: { marginRight: 8 },
};

const DashboardBuilderContentInner = () => {
  const {
    widgets,
    rows,
    clearCanvas,
    loadTemplate,
    addRow,
    addWidget,
    notification,
    hideNotification,
  } = useBuilder();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [workbook, setWorkbook] = useState(null);
  const [uploadedSheetNames, setUploadedSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [showFinalTable, setShowFinalTable] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const { setExcelData, setExcelHeaders } = useExcelData();

  const loadReferenceTemplate = () => {
    clearCanvas();
    const { rows: templateRows, widgets: templateWidgets } =
      createReferenceDashboard();
    loadTemplate(templateRows, templateWidgets);
  };

  const handleExcelApply = (payload) => {
    // payload: { headers, selectedHeaders, rows, data, sheet }
    setExcelData(Array.isArray(payload?.data) ? payload.data : []);
    setExcelHeaders(Array.isArray(payload?.selectedHeaders) ? payload.selectedHeaders : []);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.title}>
            <FiGrid style={{ color: "var(--primary)" }} />
            <span style={{ display: "inline" }}>
              Row-Based Dashboard Builder
            </span>
          </div>

          {/* Header Actions */}
          <div style={styles.actions}>
            {/* <UploadExcel onUpload={handleUpload} /> */}
            <ColorPalette />
            <ThemeToggle />
            <button
              onClick={() => setShowPreview(true)}
              style={styles.button("#3b82f6")}
              title="Preview Dashboard"
            >
              <FiEye style={styles.icon} />

              <span style={{ display: "inline" }}>Preview</span>
            </button>

            <button
              onClick={() => setShowExport(true)}
              style={styles.button("#10b981")}
              title="Export Dashboard Code"
            >
              <FiCode style={styles.icon} />
              <span style={{ display: "inline" }}>Export</span>
            </button>

            <button
              onClick={loadReferenceTemplate}
              style={styles.button("#8b5cf6")}
              title="Load Reference Template"
            >
              <FiImage style={styles.icon} />
              <span style={{ display: "inline" }}>Template</span>
            </button>

            <button
              onClick={clearCanvas}
              style={styles.button("#ef4444")}
              title="Clear Dashboard"
            >
              <FiTrash2 style={styles.icon} />
              <span style={{ display: "inline" }}>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Left Sidebar - Component Palette */}
        <div style={styles.sidebarLeft}>
          <ComponentPalette />
        </div>

        {/* Canvas */}
        <div style={styles.canvas}>
          <Canvas />
        </div>
        <div style={styles.sidebarLeft}>
          <ExcelUploadWithHeaderDropdown onApply={handleExcelApply} />
          
        </div>
      </div>

      {showPreview && (
        <PreviewPopupModal
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

      <WarningNotification
        isOpen={!!notification}
        onClose={hideNotification}
        title={notification?.title}
        message={notification?.message}
        type={notification?.type}
      />
    </div>
  );
};

const DashboardBuilderContent = () => (
  <ExcelDataProvider>
    <DashboardBuilderContentInner />
  </ExcelDataProvider>
);

const DashboardBuilder = () => (
  <DndProvider backend={HTML5Backend}>
    <BuilderProvider>
      <DashboardBuilderContent />
    </BuilderProvider>
  </DndProvider>
);

export default DashboardBuilder;
