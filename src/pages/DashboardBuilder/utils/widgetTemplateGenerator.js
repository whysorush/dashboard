// src/pages/DashboardBuilder/utils/widgetTemplateGenerator.js

/**
 * Widget Template Generator
 * 
 * Dynamically generates JSX templates for widgets based on their type.
 * This system automatically handles new widget types without manual updates.
 */

import { WIDGET_TYPES } from '../constants';

/**
 * Generate JSX template for a specific widget type
 */
export const generateWidgetJSX = (widget, rowCountVar) => {
  const { type, id, config } = widget;
  const title = (config && config.title) || type;
  const dataVar = `data_${id.replace(/-/g, "_")}`;
  
  // Calculate flexible width like the preview does
  const widgetStyle = `{{...styles.card, flexBasis: \`calc((100% - \${Math.min(4, ${rowCountVar}) - 1}*8px) / \${Math.min(4, ${rowCountVar})})\`}}`;

  // Get the appropriate template based on widget type
  const template = getWidgetTemplate(type);
  return template(widget, dataVar, widgetStyle, title);
};

/**
 * Get the appropriate template function for a widget type
 */
const getWidgetTemplate = (widgetType) => {
  // Chart templates
  if (isChartWidget(widgetType)) {
    return getChartTemplate(widgetType);
  }
  
  // KPI templates
  if (isKPIWidget(widgetType)) {
    return getKPITemplate(widgetType);
  }
  
  // Table templates
  if (isTableWidget(widgetType)) {
    return getTableTemplate(widgetType);
  }
  
  // Filter templates
  if (isFilterWidget(widgetType)) {
    return getFilterTemplate(widgetType);
  }
  
  // Fallback template
  return getUnknownTemplate();
};

/**
 * Widget type checkers
 */
const isChartWidget = (type) => {
  const chartTypes = [
    WIDGET_TYPES.LINE_CHART,
    WIDGET_TYPES.MULTI_LINE_CHART,
    WIDGET_TYPES.BAR_CHART,
    WIDGET_TYPES.AREA_CHART,
    WIDGET_TYPES.PIE_CHART,
    WIDGET_TYPES.FUNNEL_CHART,
    WIDGET_TYPES.GRADIENT_BAR_CHART,
    WIDGET_TYPES.SMOOTH_FUNNEL_CHART,
    WIDGET_TYPES.PROFESSIONAL_BAR_CHART,
  ];
  return chartTypes.includes(type);
};

const isKPIWidget = (type) => {
  const kpiTypes = [
    WIDGET_TYPES.KPI_CARD,
    WIDGET_TYPES.REVENUE_KPI,
    WIDGET_TYPES.ORDERS_KPI,
    WIDGET_TYPES.CUSTOMERS_KPI,
    WIDGET_TYPES.PROFESSIONAL_KPI,
    WIDGET_TYPES.PROFESSIONAL_KPI_CARD,
  ];
  return kpiTypes.includes(type);
};

const isTableWidget = (type) => {
  const tableTypes = [
    WIDGET_TYPES.DATA_TABLE,
    WIDGET_TYPES.PROFESSIONAL_TABLE,
  ];
  return tableTypes.includes(type);
};

const isFilterWidget = (type) => {
  const filterTypes = [
    WIDGET_TYPES.ADVANCED_FILTER_BAR,
  ];
  return filterTypes.includes(type);
};

/**
 * Chart templates
 */
const getChartTemplate = (chartType) => {
  switch (chartType) {
    case WIDGET_TYPES.LINE_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
          {/* Widget Title */}
          <div style={styles.title}>
            ${title}
          </div>
          
          {/* Chart Container */}
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart 
                data={${dataVar}}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fill: "#6b7280",
                    fontFamily: "'Figtree', sans-serif"
                  }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  tick={{
                    fontSize: 12,
                    fill: "#6b7280",
                    fontFamily: "'Figtree', sans-serif"
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    color: "#1f2937",
                    fontFamily: "'Figtree', sans-serif"
                  }}
                  cursor={{
                    stroke: "#9ca3af",
                    strokeWidth: 1,
                    strokeDasharray: "3 3"
                  }}
                  formatter={(value, name) => [value?.toLocaleString?.() ?? value, name]}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 10,
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: 12
                  }} 
                  iconType="circle" 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#25CFFD" 
                  strokeWidth={3}
                  dot={{
                    fill: "#25CFFD",
                    strokeWidth: 2,
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#25CFFD",
                    strokeWidth: 2,
                    fill: "white"
                  }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      `;

    case WIDGET_TYPES.MULTI_LINE_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
          {/* Widget Title */}
          <div style={{
            ...styles.title,
            fontFamily: "'Figtree', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: 16,
            paddingBottom: 8,
            borderBottom: "1px solid #f3f4f6"
          }}>
            ${title}
          </div>
          
          {/* Chart Container */}
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart 
                data={${dataVar}}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                {/* Grid */}
                <CartesianGrid 
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={true}
                  vertical={false}
                />
                
                {/* X Axis */}
                <XAxis 
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fill: "#6b7280",
                    fontFamily: "'Figtree', sans-serif"
                  }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                
                {/* Y Axis */}
                <YAxis 
                  tick={{
                    fontSize: 12,
                    fill: "#6b7280",
                    fontFamily: "'Figtree', sans-serif"
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                
                {/* Tooltip */}
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    color: "#1f2937",
                    fontFamily: "'Figtree', sans-serif"
                  }}
                  cursor={{
                    stroke: "#9ca3af",
                    strokeWidth: 1,
                    strokeDasharray: "3 3"
                  }}
                  formatter={(value, name) => [value?.toLocaleString?.() ?? value, name]}
                />
                
                {/* Legend */}
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 10,
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: 12
                  }} 
                  iconType="circle" 
                />
                
                {/* Primary Line (Series 1) */}
                <Line 
                  name="Revenue"
                  type="monotone"
                  dataKey="value"
                  stroke="#25CFFD"
                  strokeWidth={3}
                  dot={{
                    fill: "#25CFFD",
                    strokeWidth: 2,
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#25CFFD",
                    strokeWidth: 2,
                    fill: "white"
                  }}
                  animationDuration={1500}
                />
                
                {/* Secondary Line (Series 2) */}
                <Line 
                  name="Expenses"
                  type="monotone"
                  dataKey="value2"
                  stroke="#A0FCAA"
                  strokeWidth={2.5}
                  dot={{
                    fill: "#A0FCAA",
                    strokeWidth: 2,
                    r: 3
                  }}
                  activeDot={{
                    r: 5,
                    stroke: "#A0FCAA",
                    strokeWidth: 2,
                    fill: "white"
                  }}
                  animationDuration={1700}
                />
                
                {/* Tertiary Line (Series 3) */}
                <Line 
                  name="Profit"
                  type="monotone"
                  dataKey="value3"
                  stroke="#63E6D4"
                  strokeWidth={2.5}
                  dot={{
                    fill: "#63E6D4",
                    strokeWidth: 2,
                    r: 3
                  }}
                  activeDot={{
                    r: 5,
                    stroke: "#63E6D4",
                    strokeWidth: 2,
                    fill: "white"
                  }}
                  animationDuration={1900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      `;

    case WIDGET_TYPES.BAR_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    case WIDGET_TYPES.GRADIENT_BAR_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    case WIDGET_TYPES.AREA_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    case WIDGET_TYPES.PIE_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    case WIDGET_TYPES.FUNNEL_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    case WIDGET_TYPES.SMOOTH_FUNNEL_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    case WIDGET_TYPES.PROFESSIONAL_BAR_CHART:
      return (widget, dataVar, widgetStyle, title) => `
        <div key="${widget.id}" style=${widgetStyle}>
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

    default:
      return getUnknownTemplate();
  }
};

/**
 * KPI templates
 */
const getKPITemplate = (kpiType) => {
  return (widget, dataVar, widgetStyle, title) => `
    <div key="${widget.id}" style=${widgetStyle}>
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
};

/**
 * Table templates
 */
const getTableTemplate = (tableType) => {
  if (tableType === WIDGET_TYPES.PROFESSIONAL_TABLE) {
    return (widget, dataVar, widgetStyle, title) => `
      <div key="${widget.id}" style=${widgetStyle}>
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
  }
  
  // Default table template
  return (widget, dataVar, widgetStyle, title) => `
    <div key="${widget.id}" style=${widgetStyle}>
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
};

/**
 * Filter templates
 */
const getFilterTemplate = (filterType) => {
  return (widget, dataVar, widgetStyle, title) => `
    <div key="${widget.id}" style={{...styles.card, flexBasis: '100%'}}>
      <div style={{ ...styles.title, marginBottom: 12 }}>${title}</div>
      <div style={{ display:'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
        <div>
          <div style={styles.subtitle}>Date From</div>
          <input type="date" defaultValue="${
            widget.config?.dateRange?.from || ""
          }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}} />
        </div>
        <div>
          <div style={styles.subtitle}>Date To</div>
          <input type="date" defaultValue="${
            widget.config?.dateRange?.to || ""
          }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}} />
        </div>
        <div>
          <div style={styles.subtitle}>Transaction Amount</div>
          <select defaultValue="${
            widget.config?.amount || "0-10K"
          }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}}>
            <option>0-10K</option><option>10K-50K</option><option>50K-100K</option><option>100K+</option>
          </select>
        </div>
        <div>
          <div style={styles.subtitle}>Product</div>
          <select defaultValue="${
            widget.config?.product || "All"
          }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}}>
            <option>All</option><option>Manufacturing</option><option>Marketing</option><option>Branding</option>
          </select>
        </div>
        <div>
          <div style={styles.subtitle}>Status</div>
          <select defaultValue="${
            widget.config?.status || "All"
          }" style={{width:'100%', padding:'8px 10px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8}}>
            <option>All</option><option>Pending</option><option>Delivered</option><option>In-Transit</option>
          </select>
        </div>
      </div>
    </div>
  `;
};

/**
 * Unknown widget template
 */
const getUnknownTemplate = () => {
  return (widget, dataVar, widgetStyle, title) => `
    <div key="${widget.id}" style=${widgetStyle}>
      <div style={styles.title}>${title}</div>
      <div style={styles.subtitle}>Unsupported widget type: ${widget.type}</div>
    </div>
  `;
};
