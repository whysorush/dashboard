// Modal.jsx
import React, { useState } from "react";
// import "./Modal.css";
import DashboardPreview from "./DashboardPreview";
import Canvas from "../Canvas";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
  },
  content: {
    background: "white",
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
    maxWidth: "100%",
    maxHeight: "90%",
    width: "auto",
    overflow: "hidden",
    animation: "slideIn 0.3s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#333",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    color: "#666",
    padding: 0,
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  body: {
    padding: 20,
    overflowY: "auto",
    maxHeight: "calc(90vh - 100px)",
  },
};

const PopupModal = ({
  isOpen,
  onClose,
  title,
  children,
  widgets,
  rows,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'
  const [layout, setLayout] = useState("standard"); // 'standard', 'compact', or 'spacious'

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.content}>
        <div style={styles.header}>
          {title && <h2 style={styles.title}>{title}</h2>}
          {showCloseButton && (
            <button
              style={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e9ecef";
                e.currentTarget.style.color = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }}
            >
              &times;
            </button>
          )}
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

          {/* <Canvas /> */}

          {console.log("widgetsssssssssssssss", widgets)}
          {console.log("rowssssssssssssssss", rows)}
          {console.log("themeeeeeeeeeeeeeeeeeeeeeee", theme)}
          {console.log("layoutttttttttttttttttttttttttttttttt", layout)}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
