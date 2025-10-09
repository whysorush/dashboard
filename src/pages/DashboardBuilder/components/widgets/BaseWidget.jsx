// src/pages/DashboardBuilder/components/widgets/BaseWidget.jsx
import React, { memo, useMemo } from "react";
import { FiMoreVertical, FiRefreshCw } from "react-icons/fi";

const BaseWidget = memo(
  ({
    widget,
    isSelected,
    onClick,
    children,
    loading = false,
    error = null,
  }) => {
    const borderStyle = useMemo(() => {
      switch (widget?.config?.borderStyle) {
        case "none":
          return "border-0";
        case "thin":
          return "border";
        case "thick":
          return "border-2";
        case "dashed":
          return "border-2 border-dashed";
        default:
          return "border";
      }
    }, [widget?.config?.borderStyle]);

    const opacity = useMemo(() => {
      return widget?.config?.opacity || 1;
    }, [widget?.config?.opacity]);

    return (
      <div
        // className={`widget-wrapper group relative h-full bg-white dark:bg-gray-800 rounded-lg
        //         shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
        //         ${borderStyle} border-gray-200 dark:border-gray-700
        //         ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""}
        //         ${widget?.locked ? "cursor-not-allowed" : ""}
        //        `}
        //  hover:transform hover:scale-[1.02]
        onClick={onClick}
        style={{
          opacity,
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        {/* Widget Header */}
        {/* {(widget?.config?.title || widget?.config?.subtitle) && (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {widget?.config?.title && (
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {widget?.config.title}
                </h3>
              )}
              {widget?.config?.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {widget?.config.subtitle}
                </p>
              )}
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                // Widget menu logic here
              }}
            >
              <FiMoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )} */}

        {/* Widget Content */}
        <div 
        className="widget-content p-4 h-full overflow-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FiRefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-sm text-red-500">Error: {error}</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Locked Indicator */}
        {widget?.locked && (
          <div className="absolute top-2 left-2 text-xs text-yellow-600 dark:text-yellow-400">
            🔒
          </div>
        )}

        {/* Refresh Indicator */}
        {widget?.config?.refreshInterval > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
            <FiRefreshCw className="w-3 h-3 animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

BaseWidget.displayName = "BaseWidget";

export default BaseWidget;
