import React, { useState, useCallback } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiFilter,
  FiX,
  FiMove,
} from "react-icons/fi";
import BaseWidget from "./BaseWidget";
import { useBuilder } from "../../context/BuilderContext";

const styles = {
  section: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  group: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "10px 12px",
    position: "relative",
    transition: "all 0.2s ease",
  },
  groupPreview: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "10px 12px",
    position: "relative",
    transition: "all 0.2s ease",
    cursor: "default",
  },
  groupSelected: {
    background: "var(--panel)",
    border: "2px solid #3b82f6",
    borderRadius: 12,
    padding: "10px 12px",
    position: "relative",
    transition: "all 0.2s ease",
    boxShadow: "0 0 0 1px #3b82f6",
  },
  groupControls: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    display: "flex",
    gap: "4px",
    opacity: 0,
    transition: "opacity 0.2s ease",
  },
  groupControlsVisible: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    display: "flex",
    gap: "4px",
    opacity: 1,
    transition: "opacity 0.2s ease",
  },
  controlButton: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "10px",
    transition: "all 0.2s ease",
  },
  controlButtonHover: {
    background: "#2563eb",
    transform: "scale(1.1)",
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 8,
  },
  control: {
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "8px 10px",
  },
  dateInputs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
};

const AdvancedFilterBarWidget = ({
  widget,
  isSelected,
  onClick,
  isPreview = false,
}) => {
  const config = widget?.config || {};

  // Safely get builder context - it might not be available in all contexts
  let updateWidgetProperty = null;
  let isInBuilderMode = false;
  try {
    const builderContext = useBuilder();
    updateWidgetProperty = builderContext.updateWidgetProperty;
    isInBuilderMode = true;
  } catch (error) {
    // useBuilder is not available (outside BuilderProvider)
    // This is expected when used in the main dashboard
    console.log(
      "AdvancedFilterBarWidget: Builder context not available, running in overview mode"
    );
  }

  // Determine if we should persist changes
  // Only allow customization in builder mode, not in overview mode
  const shouldPersist = isInBuilderMode && !isPreview;

  // State for filter values
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [transactionAmount, setTransactionAmount] = useState("$0-10K");
  const [product, setProduct] = useState("All Types");
  const [status, setStatus] = useState("All");
  const [orderQuantity, setOrderQuantity] = useState("1-100");

  // State for section management
  const [selectedSection, setSelectedSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);

  // Initialize sections from config or use defaults
  const [sections, setSections] = useState(() => {
    if (config.sections) {
      return config.sections;
    }
    return [
      { id: "date", label: "Date Filter", type: "date", visible: true },
      {
        id: "transaction",
        label: "Transaction Amount",
        type: "select",
        visible: true,
      },
      { id: "product", label: "Product", type: "select", visible: true },
      { id: "status", label: "Status", type: "select", visible: true },
      {
        id: "quantity",
        label: "Order Quantity",
        type: "select",
        visible: true,
      },
    ];
  });

  // Helper function to persist sections to widget config
  const persistSections = useCallback(
    (newSections) => {
      if (shouldPersist && widget?.id && updateWidgetProperty) {
        updateWidgetProperty(widget.id, "config.sections", newSections);
      }
      // In overview mode, we still update local state even if we can't persist to builder
      // This allows customization to work in overview mode
    },
    [shouldPersist, widget?.id, updateWidgetProperty]
  );

  // Handle section selection
  const handleSectionClick = useCallback(
    (sectionId, event) => {
      event.stopPropagation();
      setSelectedSection(selectedSection === sectionId ? null : sectionId);
    },
    [selectedSection]
  );

  // Handle section deletion
  const handleDeleteSection = useCallback(
    (sectionId, event) => {
      event.stopPropagation();
      setSections((prev) => {
        const newSections = prev.map((section) =>
          section.id === sectionId ? { ...section, visible: false } : section
        );
        // Always persist sections (works in both builder and overview mode)
        persistSections(newSections);
        return newSections;
      });
      setSelectedSection(null);
    },
    [persistSections]
  );

  // Handle section reordering (drag and drop)
  const handleDragStart = useCallback((sectionId, event) => {
    event.dataTransfer.setData("text/plain", sectionId);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (targetSectionId, event) => {
      event.preventDefault();
      const draggedSectionId = event.dataTransfer.getData("text/plain");

      if (draggedSectionId !== targetSectionId) {
        setSections((prev) => {
          const sections = [...prev];
          const draggedIndex = sections.findIndex(
            (s) => s.id === draggedSectionId
          );
          const targetIndex = sections.findIndex(
            (s) => s.id === targetSectionId
          );

          if (draggedIndex !== -1 && targetIndex !== -1) {
            const [draggedSection] = sections.splice(draggedIndex, 1);
            sections.splice(targetIndex, 0, draggedSection);
          }

          persistSections(sections);
          return sections;
        });
      }
    },
    [persistSections]
  );

  // Render individual section
  const renderSection = (section) => {
    if (!section.visible) return null;

    const isSelected = selectedSection === section.id;
    const isHovered = hoveredSection === section.id;
    // Show controls only in builder mode, not in overview mode
    const showControls = isInBuilderMode && !isPreview && (isSelected || isHovered);

    const sectionStyle = isPreview
      ? styles.groupPreview
      : isSelected
      ? styles.groupSelected
      : styles.group;
    const controlsStyle = showControls
      ? styles.groupControlsVisible
      : styles.groupControls;

    return (
      <div
        key={section.id}
        style={sectionStyle}
        onClick={
          isInBuilderMode && !isPreview ? (e) => handleSectionClick(section.id, e) : undefined
        }
        onMouseEnter={
          isInBuilderMode && !isPreview ? () => setHoveredSection(section.id) : undefined
        }
        onMouseLeave={isInBuilderMode && !isPreview ? () => setHoveredSection(null) : undefined}
        draggable={isInBuilderMode && !isPreview}
        onDragStart={
          isInBuilderMode && !isPreview ? (e) => handleDragStart(section.id, e) : undefined
        }
        onDragOver={isInBuilderMode && !isPreview ? handleDragOver : undefined}
        onDrop={isInBuilderMode && !isPreview ? (e) => handleDrop(section.id, e) : undefined}
      >
        {/* Section Controls - Only show in builder mode */}
        {isInBuilderMode && !isPreview && (
          <div style={controlsStyle}>
            <button
              style={styles.controlButton}
              onClick={(e) => handleDeleteSection(section.id, e)}
              title="Delete section"
              onMouseEnter={(e) => {
                e.target.style.background = "#dc2626";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#3b82f6";
                e.target.style.transform = "scale(1)";
              }}
            >
              <FiX />
            </button>
            <button
              style={styles.controlButton}
              title="Drag to reorder"
              onMouseEnter={(e) => {
                e.target.style.background = "#059669";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#3b82f6";
                e.target.style.transform = "scale(1)";
              }}
            >
              <FiMove />
            </button>
          </div>
        )}

        {/* Section Content */}
        <label style={styles.label}>{section.label}</label>

        {section.id === "date" && (
          <div style={styles.dateInputs}>
            <input
              type="date"
              placeholder="From"
              style={styles.control}
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="To"
              style={styles.control}
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
        )}

        {section.id === "transaction" && (
          <select
            style={styles.control}
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
          >
            <option>$0-10K</option>
            <option>$10K-50K</option>
            <option>$50K-100K</option>
            <option>$100K+</option>
          </select>
        )}

        {section.id === "product" && (
          <select
            style={styles.control}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option>All Type</option>
            <option>Manufacturing</option>
            <option>Marketing</option>
            <option>Branding</option>
          </select>
        )}

        {section.id === "status" && (
          <select
            style={styles.control}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>In-Transit</option>
          </select>
        )}

        {section.id === "quantity" && (
          <select
            style={styles.control}
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
          >
            <option>1-100</option>
            <option>101-500</option>
            <option>500+</option>
          </select>
        )}
      </div>
    );
  };

  // In overview mode (no BuilderProvider), render directly without BaseWidget
  // In builder mode, use BaseWidget wrapper
  if (!isInBuilderMode) {
    return <section style={styles.section}>{sections.map(renderSection)}</section>;
  }

  return isPreview ? (
    <section style={styles.section}>{sections.map(renderSection)}</section>
  ) : (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      <section style={styles.section}>{sections.map(renderSection)}</section>
    </BaseWidget>
  );
};

export default AdvancedFilterBarWidget;
