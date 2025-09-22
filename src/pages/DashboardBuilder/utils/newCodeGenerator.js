// src/pages/DashboardBuilder/utils/newCodeGenerator.js

/**
 * Dashboard exporter supporting inline data or separate data file.
 *
 * API:
 *   generateDashboardCode(widgets, componentName, {
 *     includeData: 'inline' | 'separate' | 'none',
 *     includeStyles: true,
 *     styleMode: 'inline',              // current generator emits inline styles only
 *     includeRowLayout: true,
 *     fileType: 'jsx' | 'js'
 *   })
 */

import { WIDGET_FALLBACK_DATA, needsRecharts as checkNeedsRecharts, getFallbackData } from './widgetExportRegistry';
import { generateWidgetJSX } from './widgetTemplateGenerator';

// ---------- helpers ----------
const safeComponentName = (name) => {
  const clean = String(name || "MyDashboard").replace(/[^a-zA-Z0-9]/g, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

// Use the dynamic needsRecharts function from the registry
const needRecharts = checkNeedsRecharts;

const inlineStylesObjectLiteral = () =>
  JSON.stringify(
    {
      page: {
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        background: "#f5f5f5",
        color: "#525252",
        padding: 16,
      },
      container: {
        width: "100%",
        margin: "0",
      },
      row: {
        display: "flex",
        alignItems: "stretch",
        gap: 8,
        margin: "24px 0px",
      },
      card: {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: 16,
        height: "100%",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        fontFamily: "'Figtree', sans-serif",
      },
      title: { 
        fontSize: 14, 
        fontWeight: 600, 
        marginBottom: 16,
        color: "#1f2937",
        fontFamily: "'Figtree', sans-serif",
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
      },
      subtitle: { fontSize: 12, color: "#6b7280", marginBottom: 12 },
      kpiRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      kpiValue: { fontSize: 28, fontWeight: 800 },
      kpiDeltaPos: { fontSize: 12, fontWeight: 700, color: "#22c55e" },
      kpiDeltaNeg: { fontSize: 12, fontWeight: 700, color: "#ef4444" },
      table: { width: "100%", borderCollapse: "collapse" },
      th: {
        textAlign: "left",
        fontWeight: 600,
        padding: "10px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#00c9ff",
        color: "#fff",
      },
      td: { padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.08)" },
    },
    null,
    2
  );

const serializeWidgetData = (w) => {
  // If widget already carries data/config we try to use it; otherwise fallback
  const t = w.type;
  const cfg = w.config || {};
  // prefer explicit data on widget/config
  if (Array.isArray(w.data)) return w.data;
  if (Array.isArray(cfg.data)) return cfg.data;

  // per-type special cases for KPI widgets
  if (
    t === "kpi-card" ||
    t === "revenue-kpi" ||
    t === "orders-kpi" ||
    t === "customers-kpi" ||
    t === "professional-kpi" ||
    t === "professional-kpi-card"
  ) {
    const fallbackData = getFallbackData(t);
    return {
      title: cfg.title || (fallbackData?.title ?? "KPI"),
      value: cfg.value ?? fallbackData?.value ?? 0,
      prefix: cfg.prefix ?? fallbackData?.prefix ?? "",
      delta: cfg.growth ?? fallbackData?.delta ?? 0,
      note: cfg.subtitle ?? fallbackData?.note ?? "",
    };
  }

  if (t === "data-table" || t === "professional-table") {
    // allow columns/rows in cfg; else fallback
    if (Array.isArray(cfg.rows)) return cfg.rows;
    return getFallbackData(t);
  }

  // Use dynamic fallback data from registry
  return getFallbackData(t) || [];
};

const rowSizeStyleKey = (countInRow) => {
  if (countInRow <= 1) return "full";
  if (countInRow === 2) return "half";
  return "third";
};

// ---------- per-widget JSX builders ----------
// Use the dynamic widget template generator
const buildWidgetJSX = generateWidgetJSX;

// ---------- main generator ----------
export function generateDashboardCode(
  widgets = [],
  name = "MyDashboard",
  opts = {}
) {
  const componentName = safeComponentName(name);
  const includeDataMode = opts.includeData || "inline"; // 'inline' | 'separate' | 'none'
  const includeData = includeDataMode !== "none";
  const includeRowLayout = opts.includeRowLayout !== false;

  // group widgets by rowId to size them like your builder (1->full, 2->half, 3+->third)
  const rowsMap = {};
  widgets.forEach((w) => {
    const rowId = w?.position?.rowId || "row-default";
    if (!rowsMap[rowId]) rowsMap[rowId] = [];
    rowsMap[rowId].push(w);
  });

  // Build data variables per widget (inline mode) or import map (separate mode)
  const allWidgetsFlat = Object.values(rowsMap).flat();
  const dataVariablePairs = allWidgetsFlat.map((w) => ({
    id: w.id,
    varName: `data_${w.id.replace(/-/g, "_")}`,
    data: serializeWidgetData(w),
  }));

  const dataBlocksInline = includeData && includeDataMode === "inline"
    ? dataVariablePairs
        .map(({ varName, data }) => `const ${varName} = ${JSON.stringify(data, null, 2)};`)
        .join("\n")
    : "";

  const separateDataImports = includeDataMode === "separate" && dataVariablePairs.length
    ? `import {\n${dataVariablePairs
        .map(({ varName }) => `  ${varName}`)
        .join(",\n")}\n} from './mockData';`
    : "";

  const stylesLiteral = inlineStylesObjectLiteral();

  // Build row count declarations
  const rowCountDeclarations = Object.entries(rowsMap)
    .map(([rowId, list]) => {
      const rowCountVar = `rowCount_${rowId.replace(/-/g, "_")}`;
      return `const ${rowCountVar} = ${list.length};`;
    })
    .join("\n  ");

  // Build per-row JSX
  const rowsJSX = Object.entries(rowsMap)
    .map(([rowId, list]) => {
      const rowCountVar = `rowCount_${rowId.replace(/-/g, "_")}`;
      const widgetsJSX = list
        .map((w) => buildWidgetJSX(w, rowCountVar))
        .join("\n");
      return `
      <div key="${rowId}" style={styles.row}>
        ${widgetsJSX}
      </div>
    `;
    })
    .join("\n");

  const imports = needRecharts(widgets)
    ? `import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart, Line,
  BarChart, Bar, Cell,
  AreaChart, Area,
  PieChart, Pie,
  FunnelChart, Funnel, LabelList
} from "recharts";`
    : `import React from "react";`;

  return `// Auto-generated dashboard
${imports}
${separateDataImports}

export default function ${componentName}() {
  const styles = ${stylesLiteral};

  // ----- inline data -----
${dataBlocksInline}

  // ----- row count variables -----
  ${rowCountDeclarations}

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        ${
          includeRowLayout
            ? rowsJSX
            : `
        <div style={styles.row}>
          ${Object.values(rowsMap)
            .flat()
            .map((w) => buildWidgetJSX(w, `${Object.values(rowsMap).flat().length}`))
            .join("\n")}
        </div>`
        }
      </div>
    </div>
  );
}
`;
}

// Optional: for ExportDialog’s “CSS” mode in case you still need it
export function generateCSSFile() {
  // Not used in inline mode, but kept for compatibility
  return `/* Generated CSS placeholder (inline mode does not emit CSS files) */`;
}
