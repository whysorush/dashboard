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

const WIDGET_FALLBACK_DATA = {
  "line-chart": [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 32 },
    { name: "Mar", value: 50 },
    { name: "Apr", value: 45 },
    { name: "May", value: 62 },
    { name: "Jun", value: 55 },
  ],
  "bar-chart": [
    { name: "A", value: 24 },
    { name: "B", value: 18 },
    { name: "C", value: 32 },
    { name: "D", value: 28 },
  ],
  "area-chart": [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 20 },
    { name: "Wed", value: 18 },
    { name: "Thu", value: 26 },
    { name: "Fri", value: 22 },
  ],
  "pie-chart": [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ],
  "funnel-chart": [
    { name: "Leads", value: 1000 },
    { name: "Qualified", value: 650 },
    { name: "Proposal", value: 420 },
    { name: "Closed", value: 250 },
  ],
  // additional advanced/professional variants fall back to basic shapes
  "gradient-bar-chart": [
    { name: "A", value: 24 },
    { name: "B", value: 18 },
    { name: "C", value: 32 },
    { name: "D", value: 28 },
  ],
  "smooth-funnel-chart": [
    { name: "Leads", value: 1000 },
    { name: "Qualified", value: 650 },
    { name: "Proposal", value: 420 },
    { name: "Closed", value: 250 },
  ],
  "professional-bar-chart": [
    { name: "A", value: 24 },
    { name: "B", value: 18 },
    { name: "C", value: 32 },
    { name: "D", value: 28 },
  ],
  "data-table": [
    { id: 1, col1: "Alpha", col2: "Foo", col3: 12 },
    { id: 2, col1: "Beta", col2: "Bar", col3: 22 },
    { id: 3, col1: "Gamma", col2: "Baz", col3: 18 },
  ],
  "professional-table": [
    { id: 1, order: "#1001", customer: "Acme Inc", status: "Delivered", amount: 1299.99 },
    { id: 2, order: "#1002", customer: "Globex", status: "Pending", amount: 549.50 },
    { id: 3, order: "#1003", customer: "Initech", status: "In-Transit", amount: 239.00 },
  ],
  "kpi-card": {
    title: "Total Revenue",
    value: 847293,
    prefix: "$",
    delta: +4.1,
    note: "vs last week",
  },
  "revenue-kpi": {
    title: "Revenue",
    value: 847293,
    prefix: "$",
    delta: +4.1,
    note: "vs last week",
  },
  "orders-kpi": {
    title: "Orders",
    value: 2847,
    delta: +2.6,
    note: "vs last week",
  },
  "customers-kpi": {
    title: "Customers",
    value: 12483,
    delta: +2.8,
    note: "vs last week",
  },
  "advanced-filter-bar": {
    dateRange: { from: "", to: "" },
    product: "All",
    status: "All",
    amount: "$0-10K",
    qty: "1-100",
  },
};

// ---------- helpers ----------
const safeComponentName = (name) => {
  const clean = String(name || "MyDashboard").replace(/[^a-zA-Z0-9]/g, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const needRecharts = (widgets = []) =>
  widgets.some((w) =>
    [
      "line-chart",
      "bar-chart",
      "area-chart",
      "pie-chart",
      "funnel-chart",
      "gradient-bar-chart",
      "smooth-funnel-chart",
      "professional-bar-chart",
    ].includes(w.type)
  );

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
        maxWidth: 1200,
        margin: "0 auto",
      },
      row: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        margin: "16px 0",
      },
      card: {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: 16,
        flex: "1 1 calc(33.333% - 16px)",
      },
      full: { flex: "1 1 100%" },
      half: { flex: "1 1 calc(50% - 16px)" },
      third: { flex: "1 1 calc(33.333% - 16px)" },
      title: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
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

  // per-type special cases
  if (
    t === "kpi-card" ||
    t === "revenue-kpi" ||
    t === "orders-kpi" ||
    t === "customers-kpi"
  ) {
    return {
      title: cfg.title || (WIDGET_FALLBACK_DATA[t]?.title ?? "KPI"),
      value: cfg.value ?? WIDGET_FALLBACK_DATA[t]?.value ?? 0,
      prefix: cfg.prefix ?? WIDGET_FALLBACK_DATA[t]?.prefix ?? "",
      delta: cfg.growth ?? WIDGET_FALLBACK_DATA[t]?.delta ?? 0,
      note: cfg.subtitle ?? WIDGET_FALLBACK_DATA[t]?.note ?? "",
    };
  }

  if (t === "data-table") {
    // allow columns/rows in cfg; else fallback
    if (Array.isArray(cfg.rows)) return cfg.rows;
    return WIDGET_FALLBACK_DATA[t];
  }

  // charts expect array of {name, value}
  return WIDGET_FALLBACK_DATA[t] || [];
};

const rowSizeStyleKey = (countInRow) => {
  if (countInRow <= 1) return "full";
  if (countInRow === 2) return "half";
  return "third";
};

// ---------- per-widget JSX builders ----------
const buildWidgetJSX = (w, rowCountVar) => {
  const t = w.type;
  const title = (w.config && w.config.title) || t;
  const dataVar = `data_${w.id.replace(/-/g, "_")}`;
  const sizeKey = `styles[${rowCountVar} <= 1 ? 'full' : (${rowCountVar} === 2 ? 'half' : 'third')]`;

  switch (t) {
    case "kpi-card":
    case "revenue-kpi":
    case "orders-kpi":
    case "customers-kpi":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <div style={styles.kpiRow}>
            <div style={styles.kpiValue}>
              {${dataVar}.prefix || ''}{${dataVar}.value?.toLocaleString?.() ?? ${dataVar}.value}
            </div>
            <div style={${dataVar}.delta >= 0 ? styles.kpiDeltaPos : styles.kpiDeltaNeg}>
              {${dataVar}.delta >= 0 ? '▲' : '▼'} {Math.abs(${dataVar}.delta)}%
            </div>
          </div>
          {${dataVar}.note && <div style={styles.subtitle}>{${dataVar}.note}</div>}
        </div>
      `;

    case "data-table":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {Object.keys(${dataVar}[0] || { id:1,col1:'Col 1',col2:'Col 2',col3:'Col 3' }).map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(${dataVar} || []).map((row, i) => (
                <tr key={row.id || i}>
                  {Object.keys(row).map((k) => (
                    <td key={k} style={styles.td}>{row[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      `;

    case "professional-table":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {Object.keys(${dataVar}[0] || { id:1,order:'#1001',customer:'Customer',status:'Pending',amount:0 }).map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(${dataVar} || []).map((row, i) => (
                <tr key={row.id || i}>
                  {Object.keys(row).map((k) => (
                    <td key={k} style={styles.td}>{k === 'amount' ? (row[k] ?? 0).toLocaleString() : row[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      `;

    // recharts-based
    case "line-chart":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={${dataVar}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      `;

    case "bar-chart":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={${dataVar}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00c9ff" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      `;

    case "gradient-bar-chart":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={${dataVar}}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c9ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#00c9ff" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      `;

    case "area-chart":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={${dataVar}}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#areaFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      `;

    case "pie-chart":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={${dataVar}} dataKey="value" nameKey="name" outerRadius={90}>
                {${dataVar}.map((entry, index) => (
                  <Cell key={index} fill={['#00c9ff','#38bdf8','#60a5fa','#8b5cf6'][index % 4]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      `;

    case "funnel-chart":
      // Use Recharts Funnel components when available
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={${dataVar}} isAnimationActive>
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      `;

    case "smooth-funnel-chart":
      // Smooth look by using gradient fill and label list
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <FunnelChart>
              <defs>
                <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Funnel dataKey="value" data={${dataVar}} isAnimationActive>
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      `;

    case "professional-bar-chart":
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={${dataVar}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      `;

    case "advanced-filter-bar":
      return `
        <div key="${w.id}" style={{...styles.card, ...styles.full}}>
          <div style={{ ...styles.title, marginBottom: 12 }}>${title}</div>
          <div style={{ display:'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
            <div>
              <div style={styles.subtitle}>Date From</div>
              <input type="date" defaultValue="${
                w.config?.dateRange?.from || ""
              }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}} />
            </div>
            <div>
              <div style={styles.subtitle}>Date To</div>
              <input type="date" defaultValue="${
                w.config?.dateRange?.to || ""
              }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}} />
            </div>
            <div>
              <div style={styles.subtitle}>Transaction Amount</div>
              <select defaultValue="${
                w.config?.amount || "0-10K"
              }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}}>
                <option>0-10K</option><option>10K-50K</option><option>50K-100K</option><option>100K+</option>
              </select>
            </div>
            <div>
              <div style={styles.subtitle}>Product</div>
              <select defaultValue="${
                w.config?.product || "All"
              }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}}>
                <option>All</option><option>Manufacturing</option><option>Marketing</option><option>Branding</option>
              </select>
            </div>
            <div>
              <div style={styles.subtitle}>Status</div>
              <select defaultValue="${
                w.config?.status || "All"
              }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}}>
                <option>All</option><option>Pending</option><option>Delivered</option><option>In-Transit</option>
              </select>
            </div>
          </div>
        </div>
      `;

    default:
      return `
        <div key="${w.id}" style={{...styles.card, ...${sizeKey}}}>
          <div style={styles.title}>${title}</div>
          <div style={styles.subtitle}>Unsupported widget type: ${t}</div>
        </div>
      `;
  }
};

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

  // Build per-row JSX
  const rowsJSX = Object.entries(rowsMap)
    .map(([rowId, list]) => {
      const rowCountVar = `rowCount_${rowId.replace(/-/g, "_")}`;
      const rowCountDecl = `const ${rowCountVar} = ${list.length};`;
      const widgetsJSX = list
        .map((w) => buildWidgetJSX(w, rowCountVar))
        .join("\n");
      return `
      ${rowCountDecl}
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
            .map((w) => buildWidgetJSX(w, "3"))
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
