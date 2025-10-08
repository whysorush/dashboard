// src/pages/DashboardBuilder/components/RowManager.jsx
import React from "react";
import { useDrop, useDrag } from "react-dnd";
import {
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiEdit2,
} from "react-icons/fi";
import { useBuilder } from "../context/BuilderContext";
import { useTheme } from "../../../context/ThemeContext";

// Draggable Row Item Component
const DraggableRowItem = ({
  row,
  index,
  isSelected,
  onSelect,
  themeConfig,
  isDark,
}) => {
  const { widgets } = useBuilder();

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "row",
    item: { id: row.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const rowWidgets = widgets.filter((w) => w.position.rowId === row.id);

  const rowItemStyles = {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    marginBottom: "4px",
    borderRadius: "6px",
    backgroundColor: isSelected
      ? isDark
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(59, 130, 246, 0.05)"
      : themeConfig?.surface || (isDark ? "#374151" : "#f9fafb"),
    border: `1px solid ${
      isSelected
        ? themeConfig?.primary || "#3b82f6"
        : themeConfig?.border || (isDark ? "#4b5563" : "#e5e7eb")
    }`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    opacity: isDragging ? 0.5 : 1,
  };

  const rowNumberStyles = {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeConfig?.primary || "#3b82f6",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: "500",
    marginRight: "8px",
    color: "#ffffff",
  };

  const rowTitleStyles = {
    flex: 1,
    fontSize: "14px",
    fontWeight: "500",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#374151"),
  };

  const widgetCountStyles = {
    fontSize: "12px",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    marginRight: "8px",
  };

  const dragHandleStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "4px",
    borderRadius: "4px",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    transition: "all 0.2s ease",
    cursor: "grab",
    backgroundColor: themeConfig?.surface || (isDark ? "#4b5563" : "#f3f4f6"),
    border: `1px solid ${
      themeConfig?.border || (isDark ? "#6b7280" : "#d1d5db")
    }`,
    minWidth: "24px",
  };

  return (
    <div
      style={rowItemStyles}
      onClick={() => onSelect(row.id)}
      title={`${row.title} (${rowWidgets.length} widgets)`}
    >
      <div style={rowNumberStyles}>{index + 1}</div>
      <div style={rowTitleStyles}>{row.title}</div>
      <div style={widgetCountStyles}>
        {rowWidgets.length} widget{rowWidgets.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

const RowManager = () => {
  const {
    rows,
    widgets,
    addRow,
    removeRow,
    updateRow,
    reorderRows,
    selectedRow,
    setSelectedRow,
  } = useBuilder();

  const { themeConfig, isDark } = useTheme();

  // Drop target for row reordering
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "row",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        const sourceIndex = item.index;
        const targetIndex = rows.length - 1; // Drop at the end if no specific target

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

  // Handle row selection
  const handleRowSelect = (rowId) => {
    setSelectedRow(selectedRow === rowId ? null : rowId);
  };

  // Dynamic styles based on theme
  const containerStyles = {
    marginBottom: "16px",
  };

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  };

  const titleStyles = {
    fontSize: "18px",
    fontWeight: "500",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#374151"),
  };

  const addButtonStyles = {
    display: "flex",
    alignItems: "center",
    padding: "4px 8px",
    fontSize: "14px",
    backgroundColor: themeConfig?.primary || "#3b82f6",
    color: "#ffffff",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const emptyStateStyles = {
    textAlign: "center",
    padding: "16px 0",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
  };

  const getRowItemStyles = (isSelected) => ({
    padding: "8px",
    border: `1px solid ${
      isSelected
        ? themeConfig?.primary || "#3b82f6"
        : themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")
    }`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isSelected
      ? isDark
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(59, 130, 246, 0.05)"
      : themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "8px",
  });

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
  };

  const buttonStyles = {
    padding: "4px",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "all 0.2s ease",
  };

  const deleteButtonStyles = {
    ...buttonStyles,
    color: themeConfig?.accent || "#ef4444",
  };

  const rowListStyles = {
    maxHeight: "300px",
    overflowY: "auto",
    border: `1px solid ${
      themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")
    }`,
    borderRadius: "8px",
    backgroundColor:
      themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    padding: "8px",
  };

  return (
    <div className="row-manager" style={containerStyles}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>Rows ({rows.length})</h3>
        <button
          onClick={addRow}
          style={addButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              themeConfig?.primary || "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              themeConfig?.primary || "#3b82f6";
          }}
        >
          <FiPlus style={{ marginRight: "4px" }} /> Add Row
        </button>
      </div>

      {rows.length > 0 && (
        <div ref={drop} style={rowListStyles}>
          {rows.map((row, index) => {
            const isRowSelected = selectedRow === row.id;

            return (
              <DraggableRowItem
                key={row.id}
                row={row}
                index={index}
                isSelected={isRowSelected}
                onSelect={handleRowSelect}
                themeConfig={themeConfig}
                isDark={isDark}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RowManager;
