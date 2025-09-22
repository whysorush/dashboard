// src/components/StyleModeSelector.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const StyleModeSelector = () => {
  const { styleMode, setStyleMode, availableStyleModes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const styleModeLabels = {
    default: "Default",
    professional: "Professional",
    minimal: "Minimal",
    colorful: "Colorful",
  };

  const styleModeDescriptions = {
    default: "Balanced design with modern aesthetics",
    professional: "Clean, business-focused appearance",
    minimal: "Simple, distraction-free interface",
    colorful: "Vibrant, playful color scheme",
  };

  const styleModeIcons = {
    default: "🎨",
    professional: "💼",
    minimal: "⚪",
    colorful: "🌈",
  };

  const handleStyleModeChange = (newStyleMode) => {
    setStyleMode(newStyleMode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "var(--chart-background)",
            border: "1px solid var(--chart-border)",
            borderRadius: "var(--border-radius, 6px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {Object.values(availableStyleModes).map((mode) => (
            <button
              key={mode}
              onClick={() => handleStyleModeChange(mode)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "12px",
                border: "none",
                background:
                  mode === styleMode ? "var(--chart-primary)" : "transparent",
                color: mode === styleMode ? "white" : "var(--chart-text)",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "var(--font-family)",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (mode !== styleMode) {
                  e.target.style.background = "var(--chart-surface)";
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== styleMode) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: "16px" }}>{styleModeIcons[mode]}</span>
                <div>
                  <div style={{ fontWeight: "500" }}>
                    {styleModeLabels[mode]}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                      color:
                        mode === styleMode
                          ? "rgba(255,255,255,0.8)"
                          : "var(--chart-text-secondary)",
                    }}
                  >
                    {styleModeDescriptions[mode]}
                  </div>
                </div>
              </div>
              {mode === styleMode && (
                <span style={{ fontSize: "12px", opacity: 0.8 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StyleModeSelector;
