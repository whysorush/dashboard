import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDrag } from "react-dnd";
import { FiPlus, FiChevronDown, FiChevronUp, FiLayout } from "react-icons/fi";
import { WIDGET_CATEGORIES, WIDGET_TYPES } from "../constants";
import { useBuilder } from "../context/BuilderContext";
import { useTheme } from "../../../context/ThemeContext";

/* ---------- THEME ---------- */
const makeTheme = (theme, themeConfig, isDark) => {
  return {
    isDark,
    bg: themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    panel: themeConfig?.surface || (isDark ? "#111827" : "#f8fafc"),
    card: themeConfig?.background || (isDark ? "#1f2937" : "#ffffff"),
    border: themeConfig?.border || (isDark ? "#374151" : "#e5e7eb"),
    text: themeConfig?.text || (isDark ? "#f9fafb" : "#1f2937"),
    subtext: themeConfig?.textSecondary || (isDark ? "#d1d5db" : "#6b7280"),
    accent: themeConfig?.primary || "#2563eb",
    accentHover: themeConfig?.primary || "#1d4ed8",
    muted: isDark ? "#111827" : "#f1f5f9",
    pill: isDark ? "#111827" : "#f1f5f9",
    shadow: isDark 
      ? "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)" 
      : "0 1px 2px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)",
    radius: 14,
    activeRing: isDark
      ? "0 0 0 2px rgba(37,99,235,0.35) inset"
      : "0 0 0 2px rgba(37,99,235,0.18) inset",
  };
};

/* ---------- STYLES ---------- */
const S = {
  root: (t) => ({
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: t.radius,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  }),
  header: (t) => ({
    background: t.panel,
    border: `1px solid ${t.border}`,
    borderRadius: t.radius,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: t.shadow,
  }),
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 18,
    height: 28,
  },
  addRowBtn: (t, hovered) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: hovered ? t.accentHover : t.accent,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    padding: "5px 10px",
    cursor: "pointer",
    justifyContent: "center",
    transition: "transform 120ms ease, background 120ms ease",
    transform: hovered ? "translateY(-1px)" : "none",
    boxShadow: "0 6px 16px rgba(37,99,235,0.25)",
    width: "100%",
  }),
  quickGrid: (t) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    background: t.panel,
    border: `1px solid ${t.border}`,
    borderRadius: t.radius,
    padding: 10,
    boxShadow: t.shadow,
  }),
  quickPill: (t, hovered) => ({
    alignItems: "center",
    justifyContent: "center",
    background: hovered ? t.muted : t.pill,
    border: `1px solid ${t.border}`,
    borderRadius: 12,
    cursor: "pointer",
    transition: "background 120ms ease, transform 120ms ease",
    transform: hovered ? "translateY(-1px)" : "none",
    userSelect: "none",
  }),
  sectionWrap: (t, active) => ({
    display: "flex",
    flexDirection: "column",
    gap: active ? 10 : 0,
    background: active ? t.panel : "none",
    borderRadius: t.radius,
    padding: active ? 10 : 0,
    boxShadow: active ? `${t.shadow}, ${t.activeRing}` : "none",
    transition: "box-shadow 160ms ease, border-color 160ms ease",
  }),
  categoryHeader: (t, hovered, active) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    background: active
      ? t.isDark
        ? "#0c1731"
        : "#eef4ff"
      : hovered
      ? t.muted
      : t.card,
    border: `1px solid ${
      active
        ? t.isDark
          ? "rgba(37,99,235,0.45)"
          : "rgba(37,99,235,0.35)"
        : t.border
    }`,
    borderRadius: 12,
    padding: active ? "5px" : "10px",
    cursor: "pointer",
    transition: "background 140ms ease, border-color 140ms ease",
  }),
  categoryTitleWrap: (t) => ({
    alignItems: "center",
    color: t.text,
  }),
  chevron: (expanded) => ({
    transition: "transform 180ms ease",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  }),
  collapseOuter: {
    overflow: "hidden",
    transition:
      "max-height 220ms ease, opacity 180ms ease, transform 200ms ease",
  },
  widgetList: (expanded) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
    opacity: expanded ? 1 : 0,
    transform: expanded ? "translateY(0px)" : "translateY(-4px)",
  }),
  widgetCard: (t, isDragging, hovered, active) => ({
    display: "flex",
    gap: 5,
    alignItems: "center",
    background: hovered || active ? (t.isDark ? "#0e1a36" : "#f2f6ff") : t.card,
    border: `1px solid ${
      hovered || active
        ? t.isDark
          ? "rgba(37,99,235,0.45)"
          : "rgba(37,99,235,0.35)"
        : t.border
    }`,
    borderRadius: 12,
    padding: "10px",
    transition:
      "background 120ms ease, transform 120ms ease, border 120ms ease, opacity 120ms ease",
    transform: hovered ? "translateY(-1px)" : "none",
    opacity: isDragging ? 0.5 : 1,
  }),
  widgetIcon: (t) => ({
    fontSize: 20,
    width: 28,
    textAlign: "center",
    color: t.subtext,
  }),
  widgetText: { display: "flex", flexDirection: "column", gap: 2 },
  widgetTitle: { fontWeight: 700, fontSize: 14, lineHeight: "18px" },
  widgetDesc: (t) => ({ fontSize: 12, color: t.subtext, lineHeight: "16px" }),
};

/* ---------- DRAGGABLE ITEM ---------- */
const DraggableWidgetItem = React.memo(({ widget, theme, active }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "widget",
    item: () => ({
      type: widget.type,
      defaultSize: widget.defaultSize || { w: 4, h: 3 },
      dragId: `${Date.now()}-${Math.random()}`,
    }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [hover, setHover] = useState(false);

  return (
    <div
      ref={drag}
      style={S.widgetCard(theme, isDragging, hover, active)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      aria-label={`Drag ${widget.label}`}
      tabIndex={0}
    >
      <div style={S.widgetIcon(theme)}>{widget.icon}</div>
      <div style={S.widgetText}>
        <div style={S.widgetTitle}>{widget.label}</div>
        {widget.description ? (
          <div style={S.widgetDesc(theme)}>{widget.description}</div>
        ) : null}
      </div>
    </div>
  );
});

/* ---------- CATEGORY SECTION (animates children) ---------- */
const CategorySection = ({
  theme,
  id,
  label,
  icon,
  widgets,
  expanded,
  onToggle,
}) => {
  const [hover, setHover] = useState(false);
  const contentRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const h = contentRef.current.scrollHeight;
    setMaxH(expanded ? h + 8 : 0); // +8 for inner gap padding
  }, [expanded, widgets]);

  return (
    <div style={S.sectionWrap(theme, expanded)}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={S.categoryHeader(theme, hover, expanded)}
        aria-expanded={!!expanded}
        aria-controls={`cat-${id}`}
      >
        <div style={S.categoryTitleWrap(theme)}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span>{label}</span>
        </div>
        <div style={S.chevron(expanded)}>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </button>

      <div
        id={`cat-${id}`}
        style={{
          ...S.collapseOuter,
          maxHeight: maxH,
          opacity: expanded ? 1 : 0,
        }}
        aria-hidden={!expanded}
      >
        <div ref={contentRef} style={S.widgetList(expanded)}>
          {widgets.map((w) => (
            <DraggableWidgetItem
              key={w.type}
              widget={w}
              theme={theme}
              active={expanded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- MAIN ---------- */
const ComponentPalette = ({ accordionMode = false }) => {
  // Use global theme context instead of local styleMode
  const { theme, themeConfig, isDark } = useTheme();
  const t = useMemo(() => makeTheme(theme, themeConfig, isDark), [theme, themeConfig, isDark]);
  const { addRow } = useBuilder();

  const initialExpanded = useMemo(
    () => ({
      PROFESSIONAL_KPIS: false,
      PROFESSIONAL_CHARTS: false,
      PROFESSIONAL_TABLES: false,
      PROFESSIONAL_FILTERS: false,
    }),
    []
  );
  const [expanded, setExpanded] = useState(initialExpanded);

  const [addHover, setAddHover] = useState(false);
  const [pillHover, setPillHover] = useState(null);

  const quickAddWidgets = useMemo(
    () => [
      { type: WIDGET_TYPES.REVENUE_KPI, icon: "💰", label: "KPI" },
      { type: WIDGET_TYPES.GRADIENT_BAR_CHART, icon: "📊", label: "Chart" },
      { type: WIDGET_TYPES.PROFESSIONAL_TABLE, icon: "📋", label: "Table" },
    ],
    []
  );

  const toggleCategory = useCallback(
    (key) =>
      setExpanded((prev) => {
        if (accordionMode) {
          const next = !prev[key];
          const out = Object.keys(prev).reduce(
            (acc, k) => ((acc[k] = false), acc),
            {}
          );
          out[key] = next;
          return out;
        }
        return { ...prev, [key]: !prev[key] };
      }),
    [accordionMode]
  );

  const dispatchQuickAdd = useCallback((detail) => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) canvas.dispatchEvent(new CustomEvent("quickadd", { detail }));
  }, []);

  const handleQuickAdd = useCallback(
    (type) => {
      const firstRow = document.querySelector(".row-container");
      if (!firstRow) {
        const rowId = addRow();
        setTimeout(() => dispatchQuickAdd({ type, rowId }), 100);
        return;
      }
      const rows = document.querySelectorAll(".row-container");
      let targetRowId = null;
      for (const row of rows) {
        const rowId = row.getAttribute("data-row-id");
        if (rowId) {
          targetRowId = rowId;
          break;
        }
      }
      if (targetRowId) dispatchQuickAdd({ type, rowId: targetRowId });
    },
    [addRow, dispatchQuickAdd]
  );

  const categories = useMemo(() => Object.entries(WIDGET_CATEGORIES), []);

  return (
    <div 
    
    style={(S.root(t), S.sectionWrap(t, true))}
    
    
    >
      <div style={S.header(t)}>
        <div style={S.headerLeft}>
          <FiLayout size={18} />
          <span>Dashboard Builder</span>
        </div>
        <div>
          <button
            aria-label="Add Row"
            style={S.addRowBtn(t, addHover)}
            onMouseEnter={() => setAddHover(true)}
            onMouseLeave={() => setAddHover(false)}
            onClick={addRow}
          >
            <FiPlus size={16} /> Add Row
          </button>
        </div>
      </div>

      <div style={S.quickGrid(t)} aria-label="Quick Add Widgets">
        {quickAddWidgets.map((w) => (
          <button
            key={w.type}
            style={S.quickPill(t, pillHover === w.type)}
            onMouseEnter={() => setPillHover(w.type)}
            onMouseLeave={() => setPillHover(null)}
            onClick={() => handleQuickAdd(w.type)}
            aria-label={`Quick add ${w.label}`}
          >
            <div style={{ fontSize: 18 }}>{w.icon}</div>
            <div>{w.label}</div>
          </button>
        ))}
      </div>

      {categories.map(([key, cat]) => (
        <CategorySection
          key={key}
          id={key}
          theme={t}
          label={cat.label}
          icon={cat.icon}
          widgets={cat.widgets}
          expanded={!!expanded[key]}
          onToggle={() => toggleCategory(key)}
        />
      ))}
    </div>
  );
};

export default ComponentPalette;
