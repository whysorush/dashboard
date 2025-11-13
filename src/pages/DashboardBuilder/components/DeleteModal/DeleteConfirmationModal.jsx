// src/pages/DashboardBuilder/components/DeleteConfirmationModal.jsx
import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useTheme } from "../../../../context/ThemeContext";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Row",
  message = "Are you sure you want to delete this row? This action cannot be undone.",
  rowTitle = ""
}) => {
  const { themeConfig, isDark } = useTheme();

  if (!isOpen) return null;

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyles = {
    backgroundColor: themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: `1px solid ${themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")}`,
  };

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  };

  const titleStyles = {
    fontSize: "18px",
    fontWeight: "600",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#111827"),
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const closeButtonStyles = {
    background: "none",
    border: "none",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
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
    color: themeConfig?.textSecondary || (isDark ? "#d1d5db" : "#374151"),
    lineHeight: "1.5",
    marginBottom: "20px",
  };

  const rowTitleStyles = {
    fontWeight: "500",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#111827"),
  };

  const buttonContainerStyles = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  };

  const buttonStyles = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const cancelButtonStyles = {
    ...buttonStyles,
    backgroundColor: themeConfig?.surface || (isDark ? "#374151" : "#f3f4f6"),
    color: themeConfig?.text || (isDark ? "#d1d5db" : "#374151"),
    border: `1px solid ${themeConfig?.border || (isDark ? "#4b5563" : "#d1d5db")}`,
  };

  const deleteButtonStyles = {
    ...buttonStyles,
    backgroundColor: themeConfig?.accent || "#ef4444",
    color: "#ffffff",
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div style={overlayStyles} onClick={handleOverlayClick}>
      <div style={modalStyles}>
        <div style={headerStyles}>
          <h3 style={titleStyles}>
            <FiAlertTriangle size={20} />
            {title}
          </h3>
          <button
            style={closeButtonStyles}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeConfig?.surface || (isDark ? "#374151" : "#f3f4f6");
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        <div style={messageStyles}>
          {message}
          {rowTitle && (
            <div style={{ marginTop: "8px" }}>
              <strong style={rowTitleStyles}>"{rowTitle}"</strong>
            </div>
          )}
        </div>

        <div style={buttonContainerStyles}>
          <button
            style={cancelButtonStyles}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeConfig?.border || (isDark ? "#4b5563" : "#e5e7eb");
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = themeConfig?.surface || (isDark ? "#374151" : "#f3f4f6");
            }}
          >
            Cancel
          </button>
          <button
            style={deleteButtonStyles}
            onClick={handleConfirm}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = themeConfig?.accent || "#ef4444";
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
