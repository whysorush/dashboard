// Modal.jsx
import React, { useState } from "react";
// import "./Modal.css";
import DashboardPreview from "./DashboardPreview";
import Canvas from "../Canvas";
import { useTheme } from "../../../../context/ThemeContext";

// Dynamic styles based on theme
const getStyles = (theme, themeConfig) => ({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
  },
  content: {
    background: themeConfig?.background || (theme === "dark" ? "#1f2937" : "white"),
    borderRadius: 8,
    boxShadow: theme === "dark" 
      ? "0 10px 25px rgba(0, 0, 0, 0.5)" 
      : "0 10px 25px rgba(0, 0, 0, 0.3)",
    maxWidth: "100%",
    maxHeight: "90%",
    width: "90%",
    overflow: "hidden",
    animation: "slideIn 0.3s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottom: `1px solid ${themeConfig?.border || (theme === "dark" ? "#374151" : "#e0e0e0")}`,
    backgroundColor: themeConfig?.surface || (theme === "dark" ? "#111827" : "#f8f9fa"),
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    color: themeConfig?.text || (theme === "dark" ? "#f9fafb" : "#333"),
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    color: themeConfig?.textSecondary || (theme === "dark" ? "#d1d5db" : "#666"),
    padding: 0,
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  themeToggleButton: {
    background: "none",
    border: `1px solid ${themeConfig?.border || (theme === "dark" ? "#374151" : "#e0e0e0")}`,
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
    color: themeConfig?.text || (theme === "dark" ? "#f9fafb" : "#333"),
    fontSize: "0.875rem",
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  body: {
    padding: 20,
    overflowY: "auto",
    maxHeight: "calc(90vh - 100px)",
    backgroundColor: themeConfig?.background || (theme === "dark" ? "#1f2937" : "white"),
  },
});

const PreviewPopupModal = ({
  isOpen,
  onClose,
  title,
  children,
  widgets,
  rows,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  // Use global theme context instead of local state
  const { theme, toggleTheme, themeConfig } = useTheme();
  const [layout] = useState("standard"); // 'standard', 'compact', or 'spacious'

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Get dynamic styles based on current theme
  const styles = getStyles(theme, themeConfig);
  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.content}>
        <div style={styles.header}>
          {title && <h2 style={styles.title}>{title}</h2>}
          <div style={{ display: "flex", alignItems: "center" }}>
         
            {showCloseButton && (
              <button
                style={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === "dark" ? "#374151" : "#e9ecef";
                  e.currentTarget.style.color = theme === "dark" ? "#f9fafb" : "#333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme === "dark" ? "#d1d5db" : "#666";
                }}
              >
                &times;
              </button>
            )}
          </div>
        </div>
        <div style={styles.body}>
          <DashboardPreview
            widgets={widgets}
            rows={rows}
            viewMode={""}
            theme={theme}
            layout={layout}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default PreviewPopupModal;
