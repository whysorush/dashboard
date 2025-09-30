// src/pages/DashboardBuilder/components/RowManager.jsx
import React from 'react';
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiEdit2 } from 'react-icons/fi';
import { useBuilder } from '../context/BuilderContext';
import { useTheme } from '../../../context/ThemeContext';

const RowManager = () => {
  const { 
    rows, 
    widgets,
    addRow, 
    removeRow, 
    updateRow, 
    reorderRows,
    selectedRow,
    setSelectedRow
  } = useBuilder();
  
  const { themeConfig, isDark } = useTheme();

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
    border: `1px solid ${isSelected 
      ? themeConfig?.primary || "#3b82f6"
      : themeConfig?.border || (isDark ? "#374151" : "#e5e7eb")
    }`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isSelected 
      ? (isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)")
      : themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "8px",
  });

  const rowNumberStyles = {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeConfig?.surface || (isDark ? "#374151" : "#e5e7eb"),
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: "500",
    marginRight: "8px",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#374151"),
  };

  const inputStyles = {
    backgroundColor: themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    border: `1px solid ${themeConfig?.border || (isDark ? "#4b5563" : "#d1d5db")}`,
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "14px",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#374151"),
  };

  const rowTitleStyles = {
    fontWeight: "500",
    color: themeConfig?.text || (isDark ? "#f9fafb" : "#374151"),
  };

  const widgetCountStyles = {
    marginLeft: "8px",
    fontSize: "12px",
    color: themeConfig?.textSecondary || (isDark ? "#9ca3af" : "#6b7280"),
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

  // Count widgets in each row
  const getRowWidgetsCount = (rowId) => {
    return widgets.filter(w => w.position.rowId === rowId).length;
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    setSelectedRow(selectedRow === rowId ? null : rowId);
  };

  // Handle row title edit
  const handleRowTitleChange = (rowId, newTitle) => {
    updateRow(rowId, { title: newTitle });
  };

  // Handle row reordering
  const handleMoveRow = (rowId, direction) => {
    const currentIndex = rows.findIndex(r => r.id === rowId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < rows.length) {
      reorderRows(currentIndex, newIndex);
    }
  };

  return (
    <div className="row-manager" style={containerStyles}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>
          Rows
        </h3>
        <button
          onClick={addRow}
          style={addButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeConfig?.primary || "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = themeConfig?.primary || "#3b82f6";
          }}
        >
          <FiPlus style={{ marginRight: "4px" }} /> Add Row
        </button>
      </div>
      
      <div className="row-list">
        {rows.length === 0 ? (
          <div style={emptyStateStyles}>
            No rows yet. Add your first row to get started.
          </div>
        ) : (
          rows.map((row, index) => (
            <div 
              key={row.id}
              className="row-item"
              style={getRowItemStyles(selectedRow === row.id)}
              onClick={() => handleRowSelect(row.id)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={rowNumberStyles}>
                  {index + 1}
                </div>
                {selectedRow === row.id ? (
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) => handleRowTitleChange(row.id, e.target.value)}
                    style={inputStyles}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={rowTitleStyles}>{row.title}</span>
                    <span style={widgetCountStyles}>
                      ({getRowWidgetsCount(row.id)} widgets)
                    </span>
                  </div>
                )}
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {selectedRow === row.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowTitleChange(row.id, `Row ${index + 1}`);
                    }}
                    style={buttonStyles}
                    title="Edit title"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveRow(row.id, 'up');
                  }}
                  style={{
                    ...buttonStyles,
                    opacity: index === 0 ? 0.5 : 1,
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                  }}
                  disabled={index === 0}
                  title="Move up"
                >
                  <FiArrowUp size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveRow(row.id, 'down');
                  }}
                  style={{
                    ...buttonStyles,
                    opacity: index === rows.length - 1 ? 0.5 : 1,
                    cursor: index === rows.length - 1 ? 'not-allowed' : 'pointer',
                  }}
                  disabled={index === rows.length - 1}
                  title="Move down"
                >
                  <FiArrowDown size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete row "${row.title}"? This will remove all widgets in this row.`)) {
                      removeRow(row.id);
                    }
                  }}
                  style={deleteButtonStyles}
                  title="Delete row"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RowManager;
