// src/pages/DashboardBuilder/context/BuilderContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  memo,
} from "react";
import { generateUniqueId } from "../utils/gridHelpers";
import { KPI_WIDGET_TYPES, WIDGET_TYPES } from "../constants";

const BuilderContext = createContext();

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context)
    throw new Error("useBuilder must be used within BuilderProvider");
  return context;
};

export const BuilderProvider = ({ children }) => {
  const [widgets, setWidgets] = useState([]);
  const [rows, setRows] = useState([{ id: "row-1", title: "Row 1" }]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [gridConfig] = useState({
    cols: 12,
    rowHeight: 100,
    margin: [10, 10],
    containerPadding: [20, 20],
    compactType: "vertical",
  });

  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback(
    (newWidgets) => {
      const next = history.slice(0, historyIndex + 1);
      next.push(newWidgets);
      if (next.length > 50) next.shift();
      setHistory(next);
      setHistoryIndex(next.length - 1);
    },
    [history, historyIndex]
  );

  const titleFromType = (type) =>
    `New ${type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`;

  const getRowIndex = (rowId) => rows.findIndex((r) => r.id === rowId);

  const applyRowSizing = (widgetsDraft, rowId) => {
    const rowWidgets = widgetsDraft.filter((w) => w.position.rowId === rowId);
    const count = rowWidgets.length;
    if (count === 0) return widgetsDraft;
    const size = count === 1 ? "large" : count === 2 ? "medium" : count === 3 ? "small" : "extra-small";
    return widgetsDraft.map((w) =>
      w.position.rowId === rowId
        ? { ...w, position: { ...w.position, size } }
        : w
    );
  };

  const normalizeRowIndexing = (widgetsDraft, rowId) => {
    const rowWidgets = widgetsDraft
      .filter((w) => w.position.rowId === rowId)
      .sort((a, b) => a.position.index - b.position.index)
      .map((w, i) => ({ ...w, position: { ...w.position, index: i } }));
    const rest = widgetsDraft.filter((w) => w.position.rowId !== rowId);
    return [...rest, ...rowWidgets];
  };

  const addWidget = useCallback(
    (type, position = null, rowId = null) => {
      const targetRowId =
        rowId || (rows.length ? rows[0].id : `row-${Date.now()}`);

      // Only auto-create a row when no explicit rowId is provided.
      // This avoids duplicating rows when callers already created the row.
      if (!rowId && !rows.find((r) => r.id === targetRowId)) {
        setRows((prev) => [
          ...prev,
          { id: targetRowId, title: `Row ${prev.length + 1}` },
        ]);
      }

      const rowWidgets = widgets.filter(
        (w) => w.position.rowId === targetRowId
      );

      // Enforce max widgets per row based on widget type
      const isKpi = KPI_WIDGET_TYPES.includes(type);
      const hasAnyKpi = rowWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
      
      if (isKpi || hasAnyKpi) {
        // KPI rows can have up to 4 widgets
        if (rowWidgets.length >= 4) {
          if (typeof window !== "undefined") window.alert("This row already has the maximum of 4 KPI widgets.");
          return null;
        }
      } else {
        // Non-KPI rows can have up to 2 widgets
        if (rowWidgets.length >= 2) {
          if (typeof window !== "undefined") window.alert("This row already has the maximum of 2 widgets.");
          return null;
        }
      }

      const isFilter = type === WIDGET_TYPES.ADVANCED_FILTER_BAR;
      const hasAnyFilter = rowWidgets.some(w => w.type === WIDGET_TYPES.ADVANCED_FILTER_BAR);
      const hasAnyNonKpiNonFilter = rowWidgets.some(
        w => !KPI_WIDGET_TYPES.includes(w.type) && w.type !== WIDGET_TYPES.ADVANCED_FILTER_BAR
      );

      // Enforce KPI limit: Max 4 KPI widgets per row
      if (isKpi) {
        const existingKpis = rowWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type)).length;
        if (existingKpis >= 4) {
          if (typeof window !== "undefined") window.alert("You can add up to 4 KPI widgets in a KPI row.");
          return null;
        }
      }

      // Row constraints when filters are present or being added
      // If the row already has a filter, only allow adding filters or KPIs
      if (hasAnyFilter) {
        if (!(isKpi || isFilter)) {
          if (typeof window !== "undefined") window.alert("Rows with filters only allow KPI or filter widgets.");
          return null;
        }
      } else if (isFilter) {
        // If adding a filter into a row, ensure the row doesn't contain non-KPI/non-filter widgets
        if (hasAnyNonKpiNonFilter) {
          if (typeof window !== "undefined") window.alert("You cannot place a filter in a row that contains non-KPI/non-filter widgets.");
          return null;
        }
        // KPI + Filter mix is allowed, so skip generic KPI/non-KPI exclusivity in this branch
      } else {
        // Generic exclusivity when no filters are involved: KPI rows contain only KPIs; non-KPI rows contain no KPIs
        const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
        if ((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi)) {
          if (typeof window !== "undefined") window.alert(
            isKpi
              ? "KPI widgets cannot be mixed with non-KPI widgets in the same row."
              : "Non-KPI widgets cannot be mixed with KPI widgets in the same row."
          );
          return null;
        }
      }

      const nextIndex =
        position?.index ?? Math.max(0, Math.min(rowWidgets.length, 4));
      const nextRowSize =
        rowWidgets.length === 0
          ? "large"
          : rowWidgets.length === 1
          ? "medium"
          : rowWidgets.length === 2
          ? "small"
          : "extra-small";

      const newWidget = {
        id: generateUniqueId(),
        type,
        position: {
          rowId: targetRowId,
          row: getRowIndex(targetRowId),
          index: nextIndex,
          size: nextRowSize,
          ...(position || {}),
        },
        config: {
          title: titleFromType(type),
          subtitle: "",
          showKPIs: true,
          showFilters: true,
          color: "#27D0FC",
          dataPoints: 12,
          refreshInterval: 0,
          aggregation: "sum",
          timeRange: "monthly",
          kpiMetrics: ["total", "average", "growth"],
          numberFormat: "number",
        },
        locked: false,
      };

      let next = [...widgets, newWidget];
      next = normalizeRowIndexing(next, targetRowId);
      next = applyRowSizing(next, targetRowId);

      setWidgets(next);
      saveToHistory(next);
      setSelectedWidget(newWidget.id);
      return newWidget.id;
    },
    [widgets, rows, saveToHistory]
  );

  const removeWidget = useCallback(
    (widgetId) => {
      const toRemove = widgets.find((w) => w.id === widgetId);
      if (!toRemove) return;

      const rowId = toRemove.position.rowId;
      let next = widgets.filter((w) => w.id !== widgetId);
      next = normalizeRowIndexing(next, rowId);
      next = applyRowSizing(next, rowId);

      setWidgets(next);
      saveToHistory(next);
      if (selectedWidget === widgetId) setSelectedWidget(null);
    },
    [widgets, selectedWidget, saveToHistory]
  );

  const updateWidget = useCallback(
    (widgetId, updates) => {
      const next = widgets.map((w) =>
        w.id === widgetId ? { ...w, ...updates } : w
      );
      setWidgets(next);
      saveToHistory(next);
    },
    [widgets, saveToHistory]
  );

  const updateWidgetProperty = useCallback(
    (widgetId, path, value) => {
      const next = widgets.map((w) => {
        if (w.id !== widgetId) return w;
        
        const updated = { ...w };
        const pathParts = path.split('.');
        let current = updated;
        
        // Navigate to the parent of the target property
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part]) current[part] = {};
          current[part] = { ...current[part] };
          current = current[part];
        }
        
        // Set the final property
        current[pathParts[pathParts.length - 1]] = value;
        return updated;
      });
      
      setWidgets(next);
      saveToHistory(next);
    },
    [widgets, saveToHistory]
  );

  const updateWidgetRowPosition = useCallback(
    (widgetId, newRowId, newIndex) => {
      const moving = widgets.find(w => w.id === widgetId);
      if (!moving) return;

      const isKpi = KPI_WIDGET_TYPES.includes(moving.type);
      const isFilter = moving.type === WIDGET_TYPES.ADVANCED_FILTER_BAR;
      const destinationWidgets = widgets.filter(w => w.position.rowId === newRowId && w.id !== widgetId);
      const hasAnyKpi = destinationWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
      const hasAnyFilter = destinationWidgets.some(w => w.type === WIDGET_TYPES.ADVANCED_FILTER_BAR);
      const hasAnyNonKpiNonFilter = destinationWidgets.some(
        w => !KPI_WIDGET_TYPES.includes(w.type) && w.type !== WIDGET_TYPES.ADVANCED_FILTER_BAR
      );

      // Enforce max widgets per row on destination based on widget type
      if (isKpi || hasAnyKpi) {
        // KPI rows can have up to 4 widgets
        if (destinationWidgets.length >= 4) {
          if (typeof window !== "undefined") window.alert("This row already has the maximum of 4 KPI widgets.");
          return; // disallow move
        }
      } else {
        // Non-KPI rows can have up to 2 widgets
        if (destinationWidgets.length >= 2) {
          if (typeof window !== "undefined") window.alert("This row already has the maximum of 2 widgets.");
          return; // disallow move
        }
      }

      // Enforce KPI limit when moving into a row
      if (isKpi) {
        const kpiCount = destinationWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type)).length;
        if (kpiCount >= 4) {
          if (typeof window !== "undefined") window.alert("You can add up to 4 KPI widgets in a KPI row.");
          return; // disallow move
        }
      }

      // Row constraints with filters
      if (hasAnyFilter) {
        // Row already has a filter: only filters or KPIs may enter
        if (!(isKpi || isFilter)) {
          if (typeof window !== "undefined") window.alert("Rows with filters only allow KPI or filter widgets.");
          return;
        }
      } else if (isFilter) {
        // Moving a filter into a row that has non-KPI/non-filter widgets is disallowed
        if (hasAnyNonKpiNonFilter) {
          if (typeof window !== "undefined") window.alert("You cannot place a filter in a row that contains non-KPI/non-filter widgets.");
          return;
        }
        // KPI + Filter mix is allowed
      } else {
        // Generic exclusivity when no filters are involved
        const hasAnyNonKpi = destinationWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
        if ((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi)) {
          if (typeof window !== "undefined") window.alert(
            isKpi
              ? "KPI widgets cannot be mixed with non-KPI widgets in the same row."
              : "Non-KPI widgets cannot be mixed with KPI widgets in the same row."
          );
          return; // disallow move
        }
      }

      const rowIndex = getRowIndex(newRowId);
      let next = widgets.map((w) =>
        w.id === widgetId
          ? {
              ...w,
              position: {
                ...w.position,
                rowId: newRowId,
                row: rowIndex,
                index: newIndex,
              },
            }
          : w
      );
      const oldRowId =
        widgets.find((w) => w.id === widgetId)?.position.rowId || newRowId;

      next = normalizeRowIndexing(next, oldRowId);
      next = normalizeRowIndexing(next, newRowId);
      next = applyRowSizing(next, oldRowId);
      next = applyRowSizing(next, newRowId);

      setWidgets(next);
      saveToHistory(next);
    },
    [widgets, rows, saveToHistory]
  );

  const duplicateWidget = useCallback(
    (widgetId) => {
      const base = widgets.find((w) => w.id === widgetId);
      if (!base) return;

      const rowId = base.position.rowId;
      const rowWidgets = widgets.filter((w) => w.position.rowId === rowId);

      // Enforce max widgets per row on duplicate based on widget type
      const isKpi = KPI_WIDGET_TYPES.includes(base.type);
      const hasAnyKpi = rowWidgets.some(w => KPI_WIDGET_TYPES.includes(w.type));
      
      if (isKpi || hasAnyKpi) {
        // KPI rows can have up to 4 widgets
        if (rowWidgets.length >= 4) {
          if (typeof window !== "undefined") window.alert("This row already has the maximum of 4 KPI widgets.");
          return null;
        }
      } else {
        // Non-KPI rows can have up to 2 widgets
        if (rowWidgets.length >= 2) {
          if (typeof window !== "undefined") window.alert("This row already has the maximum of 2 widgets.");
          return null;
        }
      }

      const isFilter = base.type === WIDGET_TYPES.ADVANCED_FILTER_BAR;
      const hasAnyFilter = rowWidgets.some(w => w.type === WIDGET_TYPES.ADVANCED_FILTER_BAR);
      const hasAnyNonKpiNonFilter = rowWidgets.some(
        w => !KPI_WIDGET_TYPES.includes(w.type) && w.type !== WIDGET_TYPES.ADVANCED_FILTER_BAR
      );

      // Enforce KPI limit on duplicate
      if (isKpi) {
        const existingKpis = rowWidgets.filter(w => KPI_WIDGET_TYPES.includes(w.type)).length;
        if (existingKpis >= 4) {
          if (typeof window !== "undefined") window.alert("You can add up to 4 KPI widgets in a KPI row.");
          return null;
        }
      }

      // Row constraints with filters
      if (hasAnyFilter) {
        if (!(isKpi || isFilter)) {
          if (typeof window !== "undefined") window.alert("Rows with filters only allow KPI or filter widgets.");
          return null;
        }
      } else if (isFilter) {
        if (hasAnyNonKpiNonFilter) {
          if (typeof window !== "undefined") window.alert("You cannot place a filter in a row that contains non-KPI/non-filter widgets.");
          return null;
        }
      } else {
        // Generic exclusivity when no filters are involved
        const hasAnyNonKpi = rowWidgets.some(w => !KPI_WIDGET_TYPES.includes(w.type));
        if ((isKpi && hasAnyNonKpi) || (!isKpi && hasAnyKpi)) {
          if (typeof window !== "undefined") window.alert(
            isKpi
              ? "KPI widgets cannot be mixed with non-KPI widgets in the same row."
              : "Non-KPI widgets cannot be mixed with KPI widgets in the same row."
          );
          return null;
        }
      }

      const nextIndex = rowWidgets.length;

      const clone = {
        ...base,
        id: generateUniqueId(),
        position: {
          ...base.position,
          index: nextIndex,
        },
        config: { ...base.config },
      };

      let next = [...widgets, clone];
      next = normalizeRowIndexing(next, rowId);
      next = applyRowSizing(next, rowId);

      setWidgets(next);
      saveToHistory(next);
      setSelectedWidget(clone.id);
      return clone.id;
    },
    [widgets, saveToHistory]
  );

  const toggleLockWidget = useCallback(
    (widgetId) => {
      const next = widgets.map((w) =>
        w.id === widgetId ? { ...w, locked: !w.locked } : w
      );
      setWidgets(next);
      saveToHistory(next);
    },
    [widgets, saveToHistory]
  );

  const clearCanvas = useCallback(() => {
    setWidgets([]);
    setRows([]);
    setSelectedWidget(null);
    setSelectedRow(null);
    saveToHistory([]);
  }, [saveToHistory]);

  const loadTemplate = useCallback(
    (templateRows, templateWidgets) => {
      setRows(templateRows);
      setWidgets(templateWidgets);
      saveToHistory(templateWidgets);
    },
    [saveToHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setWidgets(history[newIndex]);
      setSelectedWidget(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setWidgets(history[newIndex]);
      setSelectedWidget(null);
    }
  }, [history, historyIndex]);

  const selectAll = useCallback(() => {
    if (widgets.length > 0) setSelectedWidget(widgets[0].id);
  }, [widgets]);

  const addRow = useCallback(() => {
    const newRow = { id: `row-${Date.now()}`, title: `Row ${rows.length + 1}` };
    setRows((prev) => [...prev, newRow]);
    return newRow.id;
  }, [rows.length]);

  const removeRow = useCallback(
    (rowId) => {
      const nextWidgets = widgets.filter((w) => w.position.rowId !== rowId);
      setWidgets(nextWidgets);
      setRows((prev) => prev.filter((r) => r.id !== rowId));
      saveToHistory(nextWidgets);
    },
    [widgets, saveToHistory]
  );

  const updateRow = useCallback((rowId, updates) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, ...updates } : r))
    );
  }, []);

  const reorderRows = useCallback(
    (sourceIndex, destinationIndex) => {
      const newRows = Array.from(rows);
      const [removed] = newRows.splice(sourceIndex, 1);
      newRows.splice(destinationIndex, 0, removed);
      setRows(newRows);

      const next = widgets.map((w) => {
        const newRowPos = newRows.findIndex((r) => r.id === w.position.rowId);
        return { ...w, position: { ...w.position, row: newRowPos } };
      });

      setWidgets(next);
      saveToHistory(next);
    },
    [rows, widgets, saveToHistory]
  );

  const recalculateRowWidgetSizes = useCallback(
    (rowId) => {
      let next = applyRowSizing(widgets, rowId);
      setWidgets(next);
      saveToHistory(next);
    },
    [widgets, saveToHistory]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            undo();
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "a":
            e.preventDefault();
            selectAll();
            break;
          case "d":
            if (selectedWidget) {
              e.preventDefault();
              duplicateWidget(selectedWidget);
            }
            break;
          case "s":
            e.preventDefault();
            break;
        }
      } else if (e.key === "Delete" && selectedWidget) {
        e.preventDefault();
        removeWidget(selectedWidget);
      } else if (e.key === "Escape") {
        setSelectedWidget(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWidget, undo, redo, selectAll, duplicateWidget, removeWidget]);

  // Split context value to reduce re-renders
  const coreValue = useMemo(() => ({
    widgets,
    rows,
    selectedWidget,
    selectedRow,
    isDragging,
    gridConfig,
  }), [widgets, rows, selectedWidget, selectedRow, isDragging, gridConfig]);

  const historyValue = useMemo(() => ({
    history,
    historyIndex,
    undo,
    redo,
  }), [history, historyIndex, undo, redo]);

  const actionsValue = useMemo(() => ({
    addWidget,
    removeWidget,
    updateWidget,
    updateWidgetProperty,
    updateWidgetRowPosition,
    duplicateWidget,
    toggleLockWidget,
    addRow,
    removeRow,
    clearCanvas,
    updateRow,
    reorderRows,
    recalculateRowWidgetSizes,
    loadTemplate,
    selectAll,
    setSelectedWidget,
    setSelectedRow,
    setIsDragging,
  }), [
    addWidget,
    removeWidget,
    updateWidget,
    updateWidgetProperty,
    updateWidgetRowPosition,
    duplicateWidget,
    toggleLockWidget,
    addRow,
    removeRow,
    clearCanvas,
    updateRow,
    reorderRows,
    recalculateRowWidgetSizes,
    loadTemplate,
    selectAll,
    setSelectedWidget,
    setSelectedRow,
    setIsDragging,
  ]);

  const value = useMemo(() => ({
    ...coreValue,
    ...historyValue,
    ...actionsValue,
  }), [coreValue, historyValue, actionsValue]);

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
};
