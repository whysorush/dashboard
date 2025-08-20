// src/pages/DashboardBuilder/components/GridOverlay.jsx
import React from 'react';
import { useBuilder } from '../context/BuilderContext';

const GridOverlay = () => {
  const { gridConfig } = useBuilder();
  const { cols, rowHeight } = gridConfig;
  
  // Calculate number of rows to show (arbitrary large number)
  const rows = 20;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ height: rows * rowHeight }}
      >
        <defs>
          <pattern
            id="grid-pattern"
            width={`${100 / cols}%`}
            height={rowHeight}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="100%"
              height="100%"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-200 dark:text-gray-700"
              strokeDasharray="2 2"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-pattern)"
        />
      </svg>
      
      {/* Grid labels */}
      <div className="absolute top-0 left-0 flex">
        {Array.from({ length: cols }, (_, i) => (
          <div
            key={i}
            className="text-xs text-gray-400 dark:text-gray-600 px-1"
            style={{ width: `${100 / cols}%` }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;