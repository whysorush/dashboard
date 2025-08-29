// src/pages/DashboardBuilder/components/ComponentPalette.jsx
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import {
  FiGrid,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiLayout,
} from "react-icons/fi";
import { WIDGET_CATEGORIES, WIDGET_TYPES } from "../constants";
import { useBuilder } from "../context/BuilderContext";

const DraggableWidgetItem = ({ widget }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "widget",
    item: {
      type: widget.type,
      defaultSize: widget.defaultSize || { w: 4, h: 3 },
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`widget-card cursor-move flex items-center p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:border-blue-500 dark:hover:border-blue-400 ${
        isDragging ? "opacity-50 border-blue-500" : ""
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="widget-icon text-xl mr-3">{widget.icon}</div>
      <div className="widget-info flex-1">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {widget.label}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {widget.description}
        </p>
      </div>
    </div>
  );
};

const ComponentPalette = () => {
  const { addRow } = useBuilder();
  const [expandedCategories, setExpandedCategories] = useState({
    PROFESSIONAL_KPIS: true,
    PROFESSIONAL_CHARTS: true,
    PROFESSIONAL_TABLES: true,
    PROFESSIONAL_FILTERS: true,
  });

  const toggleCategory = (categoryKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  // Quick add buttons for common widgets
  const quickAddWidgets = [
    { type: WIDGET_TYPES.REVENUE_KPI, icon: "💰", label: "Revenue" },
    { type: WIDGET_TYPES.GRADIENT_BAR_CHART, icon: "📊", label: "Bar Chart" },
    { type: WIDGET_TYPES.PROFESSIONAL_TABLE, icon: "📋", label: "Table" },
  ];

  return (
    <div className="">
      {/* Quick Actions - Always Visible */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 mb-4 flex-shrink-0">
        <h2 className="">
          <span>
            <FiLayout />
            Dashboard Builders
          </span>
        </h2>

        <button
          onClick={addRow}
          className="w-full flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Row
        </button>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {quickAddWidgets.map((widget) => (
            <button
              key={widget.type}
              className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                // If no rows, add one first
                if (!document.querySelector(".row-container")) {
                  const rowId = addRow();
                  // Need to wait for the row to be rendered
                  setTimeout(() => {
                    const event = new CustomEvent("quickadd", {
                      detail: { type: widget.type, rowId },
                    });
                    document
                      .querySelector(".canvas-container")
                      .dispatchEvent(event);
                  }, 100);
                } else {
                  // Find a row with space
                  const rows = document.querySelectorAll(".row-container");
                  let targetRowId = null;

                  // Find first row that's not full
                  for (const row of rows) {
                    const rowId = row.getAttribute("data-row-id");
                    if (rowId) {
                      targetRowId = rowId;
                      break;
                    }
                  }

                  if (targetRowId) {
                    const event = new CustomEvent("quickadd", {
                      detail: { type: widget.type, rowId: targetRowId },
                    });
                    document
                      .querySelector(".canvas-container")
                      .dispatchEvent(event);
                  }
                }
              }}
            >
              <span className="text-xl mb-1">{widget.icon}</span>
              <span className="text-xs">{widget.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Widget Categories - Scrollable Area */}
      <div className="px-3 flex-grow overflow-y-auto">
        {Object.entries(WIDGET_CATEGORIES).map(([key, category]) => (
          <div key={key} className="mb-4">
            <button
              onClick={() => toggleCategory(key)}
              className="w-full flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 mb-2 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-xl mr-2">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </div>
              {expandedCategories[key] ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedCategories[key] && (
              <div className="pl-2 space-y-2 mb-2">
                {category.widgets.map((widget) => (
                  <DraggableWidgetItem key={widget.type} widget={widget} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Section - Always Visible at Bottom */}
      <div className="mt-auto mx-3 p-3 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex-shrink-0 sticky bottom-0">
        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
          <FiGrid className="mr-2" /> Row-Based Layout
        </h4>
        <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1 list-disc pl-4">
          <li>1 chart = 100% width</li>
          <li>2 charts = 50% each</li>
          <li>3 charts = 33.33% each</li>
          <li>Max 3 charts per row</li>
        </ul>
      </div>
    </div>
  );
};

export default ComponentPalette;
