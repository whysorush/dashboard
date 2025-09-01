// Modal.jsx
import React from "react";
import "./Modal.css";
import DashboardPreview from "./DashboardPreview";

const PopupModal = ({
  isOpen,
  onClose,
  title,
//   children,
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {showCloseButton && (
            <button
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
          )}
        </div>
        <div className="modal-body">
          <DashboardPreview
            widgets={widgets}
            rows={rows}
            viewMode={""}
            // theme={theme}
            // layout={layout}
          />
          {/* {children} */}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
