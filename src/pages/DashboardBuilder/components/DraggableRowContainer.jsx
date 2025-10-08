// src/pages/DashboardBuilder/components/DraggableRowContainer.jsx
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  FiPlus,
  FiMove,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { useBuilder } from "../context/BuilderContext";
import { useTheme } from "../../../context/ThemeContext";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const DraggableRowContainer = ({
  row,
  children,
  isSelected,
  canAddMore = true,
  index,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const { setSelectedRow, updateRow, removeRow, reorderRows } = useBuilder();
  const { themeConfig, isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(row.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Drag and drop functionality - only for the drag handle
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "row",
    item: { id: row.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "row",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        const sourceIndex = item.index;
        const targetIndex = index;
        
        if (sourceIndex !== targetIndex) {
          reorderRows(sourceIndex, targetIndex);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Dynamic styles based on theme
  const containerStyles = {
    position: "relative",
    marginBottom: "16px",
    padding: "8px",
    borderRadius: "8px",
    border: `2px dashed ${
      isSelected
        ? themeConfig?.primary || "#3b82f6"
        : isOver && canDrop
        ? themeConfig?.accent || "#10b981"
        : themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")
    }`,
    backgroundColor: isSelected
      ? isDark
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(59, 130, 246, 0.05)"
      : isOver && canDrop
      ? isDark
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(16, 185, 129, 0.05)"
      : "transparent",
    transition: "all 0.2s ease",
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? "rotate(2deg)" : "none",
  };

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    padding: "0 8px",
  };

  const dragHandleStyles = {
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: "4px",
    backgroundColor: themeConfig?.surface || (isDark ? "#374151" : "#e5e7eb"),
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    transition: "all 0.2s ease",
  };

  const iconStyles = {
    width: "auto",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeConfig?.surface || (isDark ? "#374151" : "#e5e7eb"),
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: "500",
    marginRight: "8px",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
  };

  const titleStyles = {
    fontSize: "14px",
    fontWeight: "500",
    color: themeConfig?.text || (isDark ? "#d1d5db" : "#374151"),
  };

  const maxReachedStyles = {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    padding: "4px 8px",
    backgroundColor: themeConfig?.surface || (isDark ? "#374151" : "#e5e7eb"),
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    borderRadius: "4px",
    cursor: "not-allowed",
  };

  const contentStyles = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: "16px",
    width: "100%",
    minHeight: "100px",
    overflowX: "auto",
    alignItems: "stretch",
    padding: "8px 0",
  };

  const emptyStateStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "96px",
    backgroundColor:
      themeConfig?.surface || (isDark ? "rgba(17, 24, 39, 0.5)" : "#f9fafb"),
    borderRadius: "8px",
    border: `1px dashed ${
      themeConfig?.border || (isDark ? "#4b5563" : "#d1d5db")
    }`,
  };

  const emptyTextStyles = {
    fontSize: "14px",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
  };

  const buttonStyles = {
    padding: "4px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const editButtonStyles = {
    ...buttonStyles,
    color: themeConfig?.primary || "#3b82f6",
  };

  const deleteButtonStyles = {
    ...buttonStyles,
    color: themeConfig?.accent || "#ef4444",
  };

  const moveButtonStyles = {
    ...buttonStyles,
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    opacity: 0.7,
  };

  const inputStyles = {
    backgroundColor:
      themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    border: `1px solid ${
      themeConfig?.border || (isDark ? "#4b5563" : "#d1d5db")
    }`,
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "14px",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#374151"),
    outline: "none",
  };

  const buttonGroupStyles = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const handleRowClick = (e) => {
    // Don't handle click if we're dragging
    if (isDragging) return;
    
    // Don't handle click if clicking on the drag handle
    if (e.target.closest('[title="Drag to reorder row"]')) return;
    
    // Only select row if clicking directly on the row container (not on widgets or buttons)
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("row-container")
    ) {
      setSelectedRow(row.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(row.title);
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    updateRow(row.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditTitle(row.title);
    setIsEditing(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    removeRow(row.id);
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit(e);
    } else if (e.key === "Escape") {
      handleCancelEdit(e);
    }
  };

  const handleMoveUpClick = (e) => {
    e.stopPropagation();
    if (onMoveUp) onMoveUp();
  };

  const handleMoveDownClick = (e) => {
    e.stopPropagation();
    if (onMoveDown) onMoveDown();
  };

  return (
    <div
      ref={drop}
      className={`row-container draggable-row ${isDragging ? "dragging" : ""} ${
        isOver && canDrop ? "drag-over" : ""
      }`}
      style={containerStyles}
      onClick={handleRowClick}
      data-row-id={row.id}
    >
      {/* Row header */}
      <div className="row-header" style={headerStyles}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Drag handle */}
          <div
            ref={(node) => {
              drag(node);
              dragPreview(node);
            }}
            style={{
              ...iconStyles,
              cursor: "grab",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "#374151" : "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            title="Drag to reorder row"
          >
            <FiMove size={16} />
          </div>

          <div style={iconStyles}>
            {/* Move up/down buttons */}
            <button
              onClick={handleMoveUpClick}
              className="row-control-button"
              style={moveButtonStyles}
              disabled={!canMoveUp}
              title="Move row up"
            >
              <FiArrowUp size={14} />
            </button>
            <button
              onClick={handleMoveDownClick}
              className="row-control-button"
              style={moveButtonStyles}
              disabled={!canMoveDown}
              title="Move row down"
            >
              <FiArrowDown size={14} />
            </button>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
              style={inputStyles}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <h4 style={titleStyles}>{row.title}</h4>
          )}
        </div>

        <div className="row-controls" style={buttonGroupStyles}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                style={editButtonStyles}
                title="Save changes"
              >
                <FiCheck size={14} />
              </button>
              <button
                onClick={handleCancelEdit}
                style={buttonStyles}
                title="Cancel editing"
              >
                <FiX size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                style={editButtonStyles}
                title="Edit row title"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={handleDeleteClick}
                style={deleteButtonStyles}
                title="Delete row"
              >
                <FiTrash2 size={14} />
              </button>
            </>
          )}

          {!canAddMore && (
            <div
              style={maxReachedStyles}
              title="Max 2 widgets/row for charts; Max 4 widgets/row for KPIs; KPI rows cannot mix with other types"
            >
              <FiAlertCircle style={{ marginRight: "4px" }} size={12} /> Max
              Reached
            </div>
          )}
        </div>
      </div>

      {/* Row content - widgets container */}
      {React.Children.count(children) === 0 ? (
        <div className="empty-row" style={emptyStateStyles}>
          <p style={emptyTextStyles}>Drag widgets here or click "Add Widget"</p>
        </div>
      ) : (
        <div style={contentStyles}>{children}</div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Row"
        message="Are you sure you want to delete this row? This will remove all widgets in this row and cannot be undone."
        rowTitle={row.title}
      />
    </div>
  );
};

export default DraggableRowContainer;
