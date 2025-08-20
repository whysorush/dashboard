// src/pages/DashboardBuilder/hooks/useKeyboardShortcuts.js
import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = ({
  selectedWidget,
  onDelete,
  onDuplicate,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onPreview,
  onSelectAll,
  onDeselect,
  onMove,
  onCopy,
  onPaste,
  onToggleGrid,
  onToggleProperties,
  enabled = true
}) => {
  const handleKeyDown = useCallback((e) => {
    // Don't handle shortcuts if user is typing in an input
    if (!enabled || e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' || 
        e.target.contentEditable === 'true') {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + Key combinations
    if (ctrlKey) {
      switch(e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            onRedo?.();
          } else {
            onUndo?.();
          }
          break;
          
        case 'y':
          e.preventDefault();
          onRedo?.();
          break;
          
        case 's':
          e.preventDefault();
          onSave?.();
          break;
          
        case 'e':
          e.preventDefault();
          onExport?.();
          break;
          
        case 'p':
          e.preventDefault();
          onPreview?.();
          break;
          
        case 'a':
          e.preventDefault();
          onSelectAll?.();
          break;
          
        case 'd':
          if (selectedWidget) {
            e.preventDefault();
            onDuplicate?.(selectedWidget);
          }
          break;
          
        case 'c':
          if (selectedWidget) {
            e.preventDefault();
            onCopy?.(selectedWidget);
          }
          break;
          
        case 'v':
          e.preventDefault();
          onPaste?.();
          break;
          
        case 'g':
          e.preventDefault();
          onToggleGrid?.();
          break;
          
        case 'i':
          e.preventDefault();
          onToggleProperties?.();
          break;
          
        default:
          break;
      }
      return;
    }

    // Alt + Key combinations
    if (e.altKey) {
      switch(e.key.toLowerCase()) {
        case 'd':
          if (selectedWidget) {
            e.preventDefault();
            onDuplicate?.(selectedWidget);
          }
          break;
          
        default:
          break;
      }
      return;
    }

    // Single key shortcuts
    switch(e.key) {
      case 'Delete':
      case 'Backspace':
        if (selectedWidget) {
          e.preventDefault();
          onDelete?.(selectedWidget);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        onDeselect?.();
        break;
        
      case 'ArrowUp':
        if (selectedWidget) {
          e.preventDefault();
          if (e.shiftKey) {
            onMove?.(selectedWidget, 'up', 5); // Move 5 units with shift
          } else {
            onMove?.(selectedWidget, 'up', 1);
          }
        }
        break;
        
      case 'ArrowDown':
        if (selectedWidget) {
          e.preventDefault();
          if (e.shiftKey) {
            onMove?.(selectedWidget, 'down', 5);
          } else {
            onMove?.(selectedWidget, 'down', 1);
          }
        }
        break;
        
      case 'ArrowLeft':
        if (selectedWidget) {
          e.preventDefault();
          if (e.shiftKey) {
            onMove?.(selectedWidget, 'left', 5);
          } else {
            onMove?.(selectedWidget, 'left', 1);
          }
        }
        break;
        
      case 'ArrowRight':
        if (selectedWidget) {
          e.preventDefault();
          if (e.shiftKey) {
            onMove?.(selectedWidget, 'right', 5);
          } else {
            onMove?.(selectedWidget, 'right', 1);
          }
        }
        break;
        
      case '?':
        if (e.shiftKey) {
          e.preventDefault();
          // Show shortcuts help modal
          console.log('Show keyboard shortcuts help');
        }
        break;
        
      default:
        break;
    }
  }, [
    enabled,
    selectedWidget,
    onDelete,
    onDuplicate,
    onUndo,
    onRedo,
    onSave,
    onExport,
    onPreview,
    onSelectAll,
    onDeselect,
    onMove,
    onCopy,
    onPaste,
    onToggleGrid,
    onToggleProperties
  ]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Return shortcuts list for display
  const shortcuts = [
    { keys: ['Ctrl', 'Z'], description: 'Undo' },
    { keys: ['Ctrl', 'Y'], description: 'Redo' },
    { keys: ['Ctrl', 'S'], description: 'Save' },
    { keys: ['Ctrl', 'E'], description: 'Export' },
    { keys: ['Ctrl', 'P'], description: 'Preview' },
    { keys: ['Ctrl', 'A'], description: 'Select All' },
    { keys: ['Ctrl', 'D'], description: 'Duplicate Widget' },
    { keys: ['Ctrl', 'C'], description: 'Copy Widget' },
    { keys: ['Ctrl', 'V'], description: 'Paste Widget' },
    { keys: ['Ctrl', 'G'], description: 'Toggle Grid' },
    { keys: ['Ctrl', 'I'], description: 'Toggle Properties Panel' },
    { keys: ['Delete'], description: 'Delete Widget' },
    { keys: ['Escape'], description: 'Deselect' },
    { keys: ['↑', '↓', '←', '→'], description: 'Move Widget' },
    { keys: ['Shift', '↑', '↓', '←', '→'], description: 'Move Widget (5 units)' },
    { keys: ['?'], description: 'Show Shortcuts' }
  ];

  return { shortcuts };
};

// Hook for showing shortcuts modal
export const useShortcutsModal = () => {
  const getShortcutsList = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? '⌘' : 'Ctrl';
    
    return [
      { category: 'General', shortcuts: [
        { keys: `${cmdKey}+S`, description: 'Save dashboard' },
        { keys: `${cmdKey}+E`, description: 'Export dashboard' },
        { keys: `${cmdKey}+P`, description: 'Preview dashboard' },
        { keys: `${cmdKey}+Z`, description: 'Undo' },
        { keys: `${cmdKey}+Y`, description: 'Redo' },
        { keys: `${cmdKey}+Shift+Z`, description: 'Redo (alternative)' }
      ]},
      { category: 'Selection', shortcuts: [
        { keys: `${cmdKey}+A`, description: 'Select all widgets' },
        { keys: 'Escape', description: 'Deselect widget' },
        { keys: 'Click', description: 'Select widget' },
        { keys: `${cmdKey}+Click`, description: 'Multi-select widgets' }
      ]},
      { category: 'Widget Operations', shortcuts: [
        { keys: `${cmdKey}+D`, description: 'Duplicate selected widget' },
        { keys: `${cmdKey}+C`, description: 'Copy selected widget' },
        { keys: `${cmdKey}+V`, description: 'Paste widget' },
        { keys: 'Delete', description: 'Delete selected widget' },
        { keys: 'Backspace', description: 'Delete selected widget' }
      ]},
      { category: 'Movement', shortcuts: [
        { keys: '↑ ↓ ← →', description: 'Move widget by 1 unit' },
        { keys: 'Shift+↑ ↓ ← →', description: 'Move widget by 5 units' },
        { keys: 'Drag', description: 'Free move widget' }
      ]},
      { category: 'View', shortcuts: [
        { keys: `${cmdKey}+G`, description: 'Toggle grid' },
        { keys: `${cmdKey}+I`, description: 'Toggle properties panel' },
        { keys: 'Shift+?', description: 'Show keyboard shortcuts' }
      ]}
    ];
  };

  return { getShortcutsList };
};