// src/components/ColorPalette.jsx
import React, { useState, useCallback, memo } from "react";
import { FiCheck } from "react-icons/fi";
import { FaPalette } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Predefined color palettes
const COLOR_PALETTES = {
  default: {
    name: "Default",
    primary: "#27D0FC",
    secondary: "#10B981",
    accent: "#F59E0B",
  },
  ocean: {
    name: "Ocean",
    primary: "#0EA5E9",
    secondary: "#06B6D4",
    accent: "#8B5CF6",
  },
  forest: {
    name: "Forest",
    primary: "#059669",
    secondary: "#10B981",
    accent: "#F59E0B",
  },
  sunset: {
    name: "Sunset",
    primary: "#F97316",
    secondary: "#EF4444",
    accent: "#F59E0B",
  },
  midnight: {
    name: "Midnight",
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#EC4899",
  },
  earth: {
    name: "Earth",
    primary: "#A3A3A3",
    secondary: "#6B7280",
    accent: "#F59E0B",
  },
  vibrant: {
    name: "Vibrant",
    primary: "#EC4899",
    secondary: "#8B5CF6",
    accent: "#F59E0B",
  },
  corporate: {
    name: "Corporate",
    primary: "#1E40AF",
    secondary: "#059669",
    accent: "#DC2626",
  },
};

const ColorPalette = memo(() => {
  const { themeConfig, globalColors, setGlobalColors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState("default");

  const handlePaletteSelect = useCallback(
    (paletteKey, palette) => {
      setSelectedPalette(paletteKey);
      setGlobalColors(palette);
      setIsOpen(false);
    },
    [setGlobalColors]
  );

  const handleCustomColorChange = useCallback(
    (colorType, color) => {
      const currentColors = globalColors || COLOR_PALETTES.default;
      const updatedColors = {
        ...currentColors,
        [colorType]: color,
      };
      setGlobalColors(updatedColors);
    },
    [globalColors, setGlobalColors]
  );

  return (
    <div className="relative">
      {/* Color Palette Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title="Global Color Palette"
      >
        <FaPalette className="w-4 h-4" color="#34D399" />
        <span className="text-sm font-medium"> Theme Colors</span>
      </button>

      {/* Color Palette Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Global Color Palette
            </h3>

            {/* Predefined Palettes */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Preset Palettes
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => handlePaletteSelect(key, palette)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                      selectedPalette === key
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: palette.secondary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: palette.accent }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {palette.name}
                      </span>
                    </div>
                    {selectedPalette === key && (
                      <FiCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Custom Colors
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Primary
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={globalColors?.primary || "#27D0FC"}
                      onChange={(e) =>
                        handleCustomColorChange("primary", e.target.value)
                      }
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {globalColors?.primary || "#27D0FC"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Secondary
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={globalColors?.secondary || "#10B981"}
                      onChange={(e) =>
                        handleCustomColorChange("secondary", e.target.value)
                      }
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {globalColors?.secondary || "#10B981"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={globalColors?.accent || "#F59E0B"}
                      onChange={(e) =>
                        handleCustomColorChange("accent", e.target.value)
                      }
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {globalColors?.accent || "#F59E0B"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() =>
                  handlePaletteSelect("default", COLOR_PALETTES.default)
                }
                className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ColorPalette.displayName = "ColorPalette";

export default ColorPalette;
