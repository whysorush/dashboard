// src/pages/DashboardBuilder/components/PropertiesPanel/GeneralProperties.jsx
import React from 'react';

const GeneralProperties = ({ widget, onChange }) => {
  const sizePresets = [
    { label: 'Small', value: 'small', w: 3, h: 2 },
    { label: 'Medium', value: 'medium', w: 6, h: 3 },
    { label: 'Large', value: 'large', w: 9, h: 4 },
    { label: 'Full Width', value: 'full', w: 12, h: 4 },
    { label: 'Custom', value: 'custom', w: widget.position.w, h: widget.position.h }
  ];

  const getCurrentSizePreset = () => {
    const preset = sizePresets.find(p => 
      p.w === widget.position.w && p.h === widget.position.h
    );
    return preset ? preset.value : 'custom';
  };

  const handleSizePresetChange = (value) => {
    const preset = sizePresets.find(p => p.value === value);
    if (preset && value !== 'custom') {
      onChange('position.w', preset.w);
      onChange('position.h', preset.h);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={widget.config?.title || ''}
          onChange={(e) => onChange('config.title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Widget title"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subtitle
        </label>
        <input
          type="text"
          value={widget.config?.subtitle || ''}
          onChange={(e) => onChange('config.subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Optional subtitle"
        />
      </div>

      {/* Size Preset */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Size
        </label>
        <select
          value={getCurrentSizePreset()}
          onChange={(e) => handleSizePresetChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sizePresets.map(preset => (
            <option key={preset.value} value={preset.value}>
              {preset.label} {preset.value !== 'custom' && `(${preset.w}×${preset.h})`}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Size (shown when custom is selected) */}
      {getCurrentSizePreset() === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Width (columns)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={widget.position.w}
              onChange={(e) => onChange('position.w', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height (rows)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={widget.position.h}
              onChange={(e) => onChange('position.h', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Position */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            X Position
          </label>
          <input
            type="number"
            min="0"
            max="11"
            value={widget.position.x}
            onChange={(e) => onChange('position.x', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Y Position
          </label>
          <input
            type="number"
            min="0"
            value={widget.position.y}
            onChange={(e) => onChange('position.y', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Widget ID (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Widget ID
        </label>
        <input
          type="text"
          value={widget.id}
          readOnly
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                   bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                   cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default GeneralProperties;