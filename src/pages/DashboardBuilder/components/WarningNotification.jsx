// src/pages/DashboardBuilder/components/WarningNotification.jsx
import React, { useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useTheme } from "../../../context/ThemeContext";

const WarningNotification = ({
  isOpen,
  onClose,
  title = "Warning",
  message = "Something went wrong.",
  autoClose = true,
  duration = 5000
}) => {
  const { themeConfig, isDark } = useTheme();

  // Auto-close notification after duration
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const overlayStyles = {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 10000,
    maxWidth: "400px",
    animation: "slideIn 0.3s ease-out",
  };

  const notificationStyles = {
    backgroundColor: themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    border: "1px solid #f59e0b",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    borderLeft: "4px solid #f59e0b",
  };

  const headerStyles = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "8px",
  };

  const titleStyles = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#92400e",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const closeButtonStyles = {
    background: "none",
    border: "none",
    color: "#92400e",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const messageStyles = {
    fontSize: "14px",
    color: "#92400e",
    lineHeight: "1.5",
    marginBottom: "12px",
  };

  const buttonStyles = {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
      <div style={overlayStyles}>
        <div style={notificationStyles}>
          <div style={headerStyles}>
            <div style={titleStyles}>
              <FiAlertTriangle size={18} />
              {title}
            </div>
            <button
              style={closeButtonStyles}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <FiX size={16} />
            </button>
          </div>

          <div style={messageStyles}>
            {message}
          </div>

          <button
            style={buttonStyles}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#d97706";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f59e0b";
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
};

export default WarningNotification;

