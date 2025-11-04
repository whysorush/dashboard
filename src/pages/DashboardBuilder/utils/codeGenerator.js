// src/pages/DashboardBuilder/utils/codeGenerator.js
import { getChartDataTemplate } from "./mockDataTemplates";

export const generateDashboardCode = (
  widgets,
  componentName = "Dashboard",
  options = {}
) => {
  const {
    includeData = "inline",
    includeStyles = true,
    styleMode = "tailwind",
    includeRowLayout = true,
    fileType = "jsx",
  } = options;

  // Determine required imports
  const imports = generateImports(widgets, styleMode, fileType);

  // Generate mock data if needed
  const mockData =
    includeData === "inline" ? generateMockDataCode(widgets) : "";

  // Generate widget components based on layout mode
  const layoutCode = includeRowLayout
    ? generateRowBasedLayout(
        widgets,
        includeData,
        styleMode,
        includeStyles,
        fileType
      )
    : generateGridLayout(
        widgets,
        includeData,
        styleMode,
        includeStyles,
        fileType
      );

  // Generate CSS if using inline styles
  const cssStyles = styleMode === "inline" ? generateInlineCSS() : "";

  // Generate the complete component
  const componentCode = `
import React, { useState } from 'react';
${imports}
${includeData === "separate" ? "import { mockData } from './mockData';" : ""}
${styleMode === "css" ? "import './dashboard.css';" : ""}

${mockData}

${cssStyles}

const ${componentName} = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Add your data fetching logic here
  // useEffect(() => {
  //   fetchDashboardData();
  // }, [timeRange, selectedFilter]);
  
  // Custom label function for pie charts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: '500', fontFamily: "'Figtree', sans-serif" }}
      >
        {\`\${(percent * 100).toFixed(0)}%\`}
      </text>
    );
  };
  
  return (
    ${
      styleMode === "tailwind"
        ? '<div className="min-h-screen bg-gray-50 p-6" style={{fontFamily: "\'Figtree\', ui-sans-serif, system-ui, -apple-system, sans-serif"}}>'
        : "<div style={styles.dashboardContainer}>"
    }
      ${
        styleMode === "tailwind"
          ? '<div className="max-w-7xl mx-auto">'
          : "<div style={styles.dashboardHeader}>"
      }
        ${
          styleMode === "tailwind"
            ? `<h1 className="text-3xl font-bold text-gray-900 mb-6" style={{fontFamily: "'Figtree', sans-serif"}}>${componentName} Dashboard</h1>`
            : `<h1 style={styles.dashboardTitle}>${componentName} Dashboard</h1>`
        }
        <div>
${layoutCode}
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
  `;

  return formatCode(convertJSXToJS(componentCode, fileType));
};

const generateImports = (widgets, styleMode, fileType = "jsx") => {
  const chartTypes = new Set(widgets.map((w) => w.type));
  const rechartsImports = [];

  // Base imports always needed for charts
  const baseImports = ["ResponsiveContainer", "Tooltip"];

  // Chart-specific imports
  const chartImportMap = {
    "line-chart": [
      "LineChart",
      "Line",
      "XAxis",
      "YAxis",
      "CartesianGrid",
      "Legend",
    ],
    "bar-chart": [
      "BarChart",
      "Bar",
      "XAxis",
      "YAxis",
      "CartesianGrid",
      "Legend",
    ],
    "gradient-bar-chart": [
      "BarChart",
      "Bar",
      "XAxis",
      "YAxis",
      "CartesianGrid",
      "defs",
      "linearGradient",
      "stop",
    ],
    "area-chart": [
      "AreaChart",
      "Area",
      "XAxis",
      "YAxis",
      "CartesianGrid",
      "Legend",
    ],
    "pie-chart": ["PieChart", "Pie", "Cell"],
    "funnel-chart": ["FunnelChart", "Funnel", "LabelList"],
    "smooth-funnel-chart": ["ResponsiveContainer"],
  };

  chartTypes.forEach((chartType) => {
    if (chartImportMap[chartType]) {
      chartImportMap[chartType].forEach((imp) => {
        if (!rechartsImports.includes(imp) && !baseImports.includes(imp)) {
          rechartsImports.push(imp);
        }
      });
    }
  });

  // Add base imports
  chartTypes.forEach((chartType) => {
    if (chartType.includes("chart") && chartType !== "smooth-funnel-chart") {
      baseImports.forEach((imp) => {
        if (!rechartsImports.includes(imp)) {
          rechartsImports.push(imp);
        }
      });
    }
  });

  const hasCharts = Array.from(chartTypes).some((type) =>
    type.includes("chart")
  );

  let imports = "";

  // React import based on file type
  if (fileType === "jsx") {
    imports += `import React from 'react';\n`;
  } else {
    imports += `import React from 'react';\n`;
    imports += `// Note: This file uses React.createElement instead of JSX\n`;
  }

  if (hasCharts && rechartsImports.length > 0) {
    imports += `import {\n  ${rechartsImports.join(
      ",\n  "
    )}\n} from 'recharts';\n`;
  }

  // Add icon imports for professional widgets
  const needsIcons = Array.from(chartTypes).some((type) =>
    ["revenue-kpi", "orders-kpi", "customers-kpi", "professional-kpi"].includes(
      type
    )
  );

  if (needsIcons) {
    imports += `import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiUsers } from 'react-icons/fi';\n`;
  }

  return imports;
};

const generateMockDataCode = (widgets) => {
  const dataSets = [];
  const usePieChart = widgets.some((w) => w.type === "pie-chart");
  const generatedNames = new Set(); // Track generated names to avoid duplicates

  widgets.forEach((widget, index) => {
    // Convert widget type to valid JavaScript variable name
    const cleanType = widget.type
      .replace(/[-]/g, "") // Remove hyphens
      .replace(/[^a-zA-Z0-9]/g, "") // Remove any other invalid characters
      .toLowerCase();

    let dataName = `${cleanType}Data${index}`;

    // Ensure uniqueness
    let counter = 0;
    while (generatedNames.has(dataName)) {
      counter++;
      dataName = `${cleanType}Data${index}_${counter}`;
    }
    generatedNames.add(dataName);

    const data = getChartDataTemplate(widget.type);
    dataSets.push(`const ${dataName} = ${JSON.stringify(data, null, 2)};`);
  });

  const pieColors = usePieChart
    ? "const CHART_COLORS = ['#25CFFD', '#A0FCAA', '#63E6D4', '#EF4444', '#8B5CF6', '#EC4899'];"
    : "";

  return `// Mock Data
${dataSets.join("\n\n")}

${pieColors}`;
};

// Layout generation functions
const generateRowBasedLayout = (
  widgets,
  includeData,
  styleMode,
  includeStyles,
  fileType = "jsx"
) => {
  // Group widgets by row
  const widgetsByRow = {};
  widgets.forEach((widget) => {
    const rowId = widget.position?.rowId || "default-row";
    if (!widgetsByRow[rowId]) {
      widgetsByRow[rowId] = [];
    }
    widgetsByRow[rowId].push(widget);
  });

  const rows = Object.entries(widgetsByRow).map(
    ([rowId, rowWidgets], rowIndex) => {
      const rowWidgetComponents = rowWidgets.map((widget, widgetIndex) => {
        const dataName =
          includeData !== "none"
            ? `${widget.type.replace(/-/g, "")}Data${widgets.indexOf(widget)}`
            : "data";

        const widgetsInRow = rowWidgets.length;
        const widthClass = getWidthClass(widgetsInRow, styleMode);

        return generateProfessionalWidgetCode(
          widget,
          dataName,
          widgetIndex,
          styleMode,
          includeStyles,
          widthClass,
          fileType
        );
      });

      if (styleMode === "tailwind") {
        return `        {/* Row ${rowIndex + 1} */}
        <div className="flex gap-2 items-stretch mb-6 flex-wrap">
${rowWidgetComponents.join("\n")}
        </div>`;
      } else {
        return `        {/* Row ${rowIndex + 1} */}
        <div style={styles.dashboardRow}>
${rowWidgetComponents.join("\n")}
        </div>`;
      }
    }
  );

  return rows.join("\n\n");
};

const generateGridLayout = (
  widgets,
  includeData,
  styleMode,
  includeStyles,
  fileType = "jsx"
) => {
  return widgets
    .map((widget, index) => {
      const dataName =
        includeData !== "none"
          ? `${widget.type.replace(/-/g, "")}Data${index}`
          : "data";

      return generateLegacyWidgetCode(
        widget,
        dataName,
        index,
        styleMode,
        includeStyles,
        fileType
      );
    })
    .join("\n");
};

// Helper function to convert JSX syntax to JavaScript
const convertJSXToJS = (jsxCode, fileType) => {
  if (fileType === "jsx") {
    return jsxCode;
  }

  // For JS files, add a comment explaining the limitation
  return (
    jsxCode +
    `
  
  // Note: For pure JavaScript (.js) files, you would typically use React.createElement
  // instead of JSX syntax. This generator primarily outputs JSX for better readability.
  // To convert to pure JS, consider using a build tool like Babel.`
  );
};

// Professional widget code generation
const generateProfessionalWidgetCode = (
  widget,
  dataName,
  index,
  styleMode,
  includeStyles,
  widthClass,
  fileType = "jsx"
) => {
  const { config, type } = widget;

  switch (type) {
    case "revenue-kpi":
    case "orders-kpi":
    case "customers-kpi":
    case "professional-kpi":
      return generateKPIWidgetCode(
        widget,
        styleMode,
        includeStyles,
        widthClass
      );

    case "gradient-bar-chart":
    case "professional-bar-chart":
      return generateProfessionalBarChartCode(
        widget,
        dataName,
        styleMode,
        includeStyles,
        widthClass
      );

    case "smooth-funnel-chart":
      return generateSmoothFunnelCode(
        widget,
        styleMode,
        includeStyles,
        widthClass
      );

    case "professional-table":
      return generateProfessionalTableCode(
        widget,
        styleMode,
        includeStyles,
        widthClass
      );

    case "data-table":
      return generateDataTableCode(
        widget,
        styleMode,
        includeStyles,
        widthClass
      );

    // Basic chart types
    case "line-chart":
    case "area-chart":
    case "pie-chart":
    case "bar-chart":
    case "funnel-chart":
      return generateStandardChart(
        widget,
        dataName,
        styleMode,
        includeStyles,
        widthClass
      );

    case "advanced-filter-bar":
      return generateFilterBarCode(
        widget,
        styleMode,
        includeStyles,
        widthClass
      );

    default:
      return generateStandardChart(
        widget,
        dataName,
        styleMode,
        includeStyles,
        widthClass
      );
  }
};

// Standard chart wrapper for basic chart types
const generateStandardChart = (
  widget,
  dataName,
  styleMode,
  includeStyles,
  widthClass
) => {
  const { config, type } = widget;
  const title = config?.title || getDefaultChartTitle(type);
  const chartCode = generateChartCode(type, dataName, config, styleMode);

  if (styleMode === "tailwind") {
    return `          <div className="${widthClass}">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 h-full flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: "'Figtree', sans-serif"}}>${title}</h3>
              </div>
              <div className="flex-1">
                ${chartCode}
              </div>
            </div>
          </div>`;
  } else {
    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.chartContainer}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>${title}</h3>
              </div>
              <div style={styles.barChart}>
                ${chartCode}
              </div>
            </div>
          </div>`;
  }
};

// Helper function to get default chart titles
const getDefaultChartTitle = (type) => {
  switch (type) {
    case "line-chart":
      return "Line Chart";
    case "area-chart":
      return "Area Chart";
    case "pie-chart":
      return "Pie Chart";
    case "bar-chart":
      return "Bar Chart";
    case "funnel-chart":
      return "Funnel Chart";
    default:
      return "Chart";
  }
};

// Legacy widget code for grid layout
const generateLegacyWidgetCode = (
  widget,
  dataName,
  index,
  styleMode,
  includeStyles,
  fileType = "jsx"
) => {
  const { position, config } = widget;
  const chartCode = generateChartCode(widget.type, dataName, config, styleMode);

  const containerProps = getWidgetContainerProps(
    position.w,
    styleMode,
    includeStyles
  );
  const headerProps = getWidgetHeaderProps(styleMode, includeStyles);
  const chartContainerProps = getChartContainerProps(styleMode, includeStyles);

  return `          {/* ${config?.title || `Widget ${index + 1}`} */}
          <div ${containerProps}>
            <div ${headerProps}>
              <h3 ${getTitleProps(styleMode, includeStyles)}>
                ${config?.title || "Untitled Widget"}
              </h3>
              ${
                config?.subtitle
                  ? `<p ${getSubtitleProps(styleMode, includeStyles)}>${
                      config.subtitle
                    }</p>`
                  : ""
              }
            </div>
            
            {/* Chart */}
            <div ${chartContainerProps}>
              ${chartCode}
            </div>
            
            {/* Time Filters */}
            ${generateTimeFilters(styleMode, includeStyles)}
          </div>`;
};

// KPI widget generators
const generateKPIWidgetCode = (
  widget,
  styleMode,
  includeStyles,
  widthClass
) => {
  const { config, type } = widget;
  const value = config?.value || getDefaultKPIValue(type);
  const title = config?.title || getDefaultKPITitle(type);
  const growth = config?.growth || getDefaultKPIGrowth(type);
  const icon = getKPIIcon(type);
  const prefix = config?.prefix || (type === "revenue-kpi" ? "$" : "");
  const growthText = config?.growthText || "from last week";

  // Get the type for styling
  const styleType = type.replace("-kpi", "");

  if (styleMode === "tailwind") {
    const gradientClass =
      type === "revenue-kpi"
        ? "bg-gradient-to-br from-green-500 to-green-600"
        : type === "orders-kpi"
        ? "bg-gradient-to-br from-blue-500 to-blue-600"
        : "bg-gradient-to-br from-purple-500 to-purple-600";

    return `          <div className="${widthClass}">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-start gap-4 h-full">
              <div className="w-12 h-12 rounded-xl ${gradientClass} flex items-center justify-center text-white text-xl shrink-0">
                ${icon}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-sm font-medium text-gray-600 m-0" style={{fontFamily: "'Figtree', sans-serif"}}>${title}</h3>
                <div className="text-3xl font-bold text-gray-900 m-0 leading-none" style={{fontFamily: "'Figtree', sans-serif"}}>${formatKPIValue(
                  value,
                  type
                )}</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +${Math.abs(growth)}%
                    <p className="m-0 text-gray-600 font-normal">${growthText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  } else {
    const capitalizedType =
      styleType.charAt(0).toUpperCase() + styleType.slice(1);
    const iconStyleKey = `statIcon${capitalizedType}`;

    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.${iconStyleKey}}}>
                ${icon}
              </div>
              <div style={styles.statContent}>
                <h3 style={styles.statTitle}>${title}</h3>
                <div style={styles.statValue}>${formatKPIValue(
                  value,
                  type
                )}</div>
                <div style={styles.statChange}>
                  <div style={styles.statChangeInfo}>
                    <svg style={{width: '12px', height: '12px'}} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +${Math.abs(growth)}%
                    <p style={styles.statChangeText}>${growthText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  }
};

const getDefaultKPIValue = (type) => {
  switch (type) {
    case "revenue-kpi":
      return 847293;
    case "orders-kpi":
      return 2847;
    case "customers-kpi":
      return 12483;
    default:
      return 0;
  }
};

const getDefaultKPITitle = (type) => {
  switch (type) {
    case "revenue-kpi":
      return "Total Revenue";
    case "orders-kpi":
      return "Orders";
    case "customers-kpi":
      return "Customers";
    default:
      return "KPI";
  }
};

const getDefaultKPIGrowth = (type) => {
  switch (type) {
    case "revenue-kpi":
      return 4.1;
    case "orders-kpi":
      return 2.6;
    case "customers-kpi":
      return 2.8;
    default:
      return 0;
  }
};

const getKPIIcon = (type) => {
  switch (type) {
    case "revenue-kpi":
      return "<FiDollarSign />";
    case "orders-kpi":
      return "<FiShoppingCart />";
    case "customers-kpi":
      return "<FiUsers />";
    default:
      return "<FiTrendingUp />";
  }
};

const formatKPIValue = (value, type) => {
  if (type === "revenue-kpi") {
    return `$${value.toLocaleString()}`;
  }
  return value.toLocaleString();
};

// Enhanced chart code generation with style mode support
const generateChartCode = (type, dataName, config, styleMode) => {
  const color = config?.color || "#25CFFD";
  const containerStyle =
    styleMode === "inline"
      ? 'style={{width: "100%", height: "250px"}}'
      : styleMode === "css"
      ? 'className="chart-container"'
      : 'className="w-full h-[250px]"';

  switch (type) {
    case "line-chart":
      return generateLineChartCode(dataName, color, containerStyle, styleMode);
    case "bar-chart":
    case "gradient-bar-chart":
      return generateBarChartCode(
        dataName,
        color,
        containerStyle,
        styleMode,
        type.includes("gradient")
      );
    case "area-chart":
      return generateAreaChartCode(dataName, color, containerStyle, styleMode);
    case "pie-chart":
      return generatePieChartCode(dataName, containerStyle, styleMode);
    case "funnel-chart":
      return generateFunnelChartCode(dataName, containerStyle, styleMode);
    default:
      return `<div ${getErrorContainerProps(styleMode)}>
                Chart type not supported
              </div>`;
  }
};

// Specific chart generators
const generateLineChartCode = (dataName, color, containerStyle, styleMode) => {
  const gridProps = getGridProps(styleMode);
  const axisProps = getAxisProps(styleMode);
  const tooltipProps = getTooltipProps(styleMode);

  const enhancedTooltipProps =
    styleMode === "inline"
      ? `contentStyle={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      fontFamily: "'Figtree', sans-serif"
    }}
    cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }}
    formatter={(value) => [\`\${value.toLocaleString()}\`, '']}`
      : tooltipProps;

  const axisStyle =
    styleMode === "inline"
      ? `tick={{ fontSize: 12, fill: '#6b7280', fontFamily: "'Figtree', sans-serif" }}`
      : axisProps;

  return `<ResponsiveContainer ${containerStyle}>
                <LineChart data={${dataName}} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    ${gridProps}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    ${axisStyle}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    ${axisStyle}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip ${enhancedTooltipProps} />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10 }}
                    iconType="circle"
                  />
                  <Line 
                    name="Current Period"
                    type="monotone" 
                    dataKey="value" 
                    stroke="${color}"
                    strokeWidth={3}
                    dot={{ fill: '${color}', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '${color}', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>`;
};

const generateBarChartCode = (
  dataName,
  color,
  containerStyle,
  styleMode,
  isGradient
) => {
  const gridProps = getGridProps(styleMode);
  const axisProps = getAxisProps(styleMode);
  const tooltipProps = getTooltipProps(styleMode);

  const barFill = isGradient ? "url(#barGradient)" : color;

  console.log(barFill);
  const gradientDef = isGradient
    ? `
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#25CFFD" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#A0FCAA" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>`
    : "";

  return `<ResponsiveContainer ${containerStyle}>
                <BarChart data={${dataName}} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>${gradientDef}
                  <CartesianGrid strokeDasharray="3 3" ${gridProps} />
                  <XAxis dataKey="name" ${axisProps} />
                  <YAxis ${axisProps} />
                  <Tooltip ${tooltipProps} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="${barFill}"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>`;
};

const generateAreaChartCode = (dataName, color, containerStyle, styleMode) => {
  const gridProps = getGridProps(styleMode);
  const axisProps = getAxisProps(styleMode);
  const tooltipProps = getTooltipProps(styleMode);

  const enhancedTooltipProps =
    styleMode === "inline"
      ? `contentStyle={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      fontFamily: "'Figtree', sans-serif"
    }}`
      : tooltipProps;

  const axisStyle =
    styleMode === "inline"
      ? `tick={{ fontSize: 12, fill: '#6b7280', fontFamily: "'Figtree', sans-serif" }}`
      : axisProps;

  return `<ResponsiveContainer ${containerStyle}>
                <AreaChart data={${dataName}} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    ${gridProps}
                  />
                  <XAxis 
                    dataKey="name" 
                    ${axisStyle}
                  />
                  <YAxis ${axisStyle} />
                  <Tooltip ${enhancedTooltipProps} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="${color}"
                    fill="${color}"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>`;
};

const generatePieChartCode = (dataName, containerStyle, styleMode) => {
  const tooltipProps = getTooltipProps(styleMode);

  const enhancedTooltipProps =
    styleMode === "inline"
      ? `contentStyle={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      fontFamily: "'Figtree', sans-serif"
    }}`
      : tooltipProps;

  return `<ResponsiveContainer ${containerStyle}>
                <PieChart>
                  <Pie
                    data={${dataName}}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {${dataName}.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip ${enhancedTooltipProps} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>`;
};

const generateFunnelChartCode = (dataName, containerStyle, styleMode) => {
  const tooltipProps = getTooltipProps(styleMode);

  return `<ResponsiveContainer ${containerStyle}>
                <FunnelChart>
                  <Tooltip ${tooltipProps} />
                  <Funnel 
                    dataKey="value" 
                    data={${dataName}} 
                    isAnimationActive 
                    fill="#8884d8"
                  >
                    <LabelList position="center" fill="#fff" stroke="none" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>`;
};

// Helper functions for style generation
const getContainerCode = (styleMode, includeStyles) => {
  if (!includeStyles) return "<div>";

  switch (styleMode) {
    case "inline":
      return '<div style={{minHeight: "100vh", backgroundColor: "#f9fafb", padding: "1.5rem"}}>';
    case "css":
      return '<div className="dashboard-container">';
    default: // tailwind
      return '<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">';
  }
};

const getContainerCloseCode = (styleMode) => "</div>";

const getHeaderCode = (componentName, styleMode, includeStyles) => {
  if (!includeStyles)
    return `<h1>${componentName.replace(/([A-Z])/g, " $1").trim()}</h1>`;

  const title = componentName.replace(/([A-Z])/g, " $1").trim();

  switch (styleMode) {
    case "inline":
      return `<div style={{maxWidth: "80rem", margin: "0 auto"}}>
        <h1 style={{fontSize: "1.875rem", fontWeight: "bold", color: "#111827", marginBottom: "1.5rem"}}>
          ${title}
        </h1>`;
    case "css":
      return `<div className="dashboard-header">
        <h1 className="dashboard-title">
          ${title}
        </h1>`;
    default: // tailwind
      return `<div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          ${title}
        </h1>`;
  }
};

const getRowContainerProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return 'style={{display: "flex", gap: "1rem", alignItems: "stretch", marginBottom: "1.5rem"}}';
    case "css":
      return 'className="dashboard-row"';
    default: // tailwind
      return 'className="flex gap-4 items-stretch mb-6"';
  }
};

const getWidthClass = (widgetsInRow, styleMode) => {
  if (styleMode === "inline") {
    const flexBasis =
      widgetsInRow === 1 ? "100%" : widgetsInRow === 2 ? "50%" : "33.333%";
    return `style={{flex: "1", flexBasis: "${flexBasis}"}}`;
  }

  if (styleMode === "css") {
    return `className="widget-${
      widgetsInRow === 1 ? "full" : widgetsInRow === 2 ? "half" : "third"
    }"`;
  }

  // tailwind
  return `className="${
    widgetsInRow === 1 ? "w-full" : widgetsInRow === 2 ? "w-1/2" : "w-1/3"
  } flex-1"`;
};

// Generate CSS file content
const generateInlineCSS = () => {
  return `const styles = {
  // Dashboard Container Styles - Exact Match to Preview
  dashboardContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '24px',
    fontFamily: "'Figtree', ui-sans-serif, system-ui, -apple-system, sans-serif",
    color: '#1f2937'
  },
  dashboardHeader: {
    maxWidth: '80rem',
    margin: '0 auto',
    marginBottom: '24px'
  },
  dashboardTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px',
    fontFamily: "'Figtree', sans-serif"
  },
  
  // Row and Widget Layout - Matching Preview Exactly
  dashboardRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'stretch',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  widgetContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    padding: '24px',
    transition: 'all 0.3s ease',
    minHeight: '200px'
  },
  widgetContainerHover: {
    boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)'
  },
  widgetFull: {
    flex: '1',
    flexBasis: '100%'
  },
  widgetHalf: {
    flex: '1',
    flexBasis: 'calc((100% - 8px) / 2)'
  },
  widgetThird: {
    flex: '1',
    flexBasis: 'calc((100% - 16px) / 3)'
  },
  
  // Professional KPI Card Styles - Exact Match
  statCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    height: '100%'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
    color: 'white'
  },
  statIconRevenue: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  statIconOrders: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  statIconCustomers: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
  },
  statContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    margin: '0',
    fontFamily: "'Figtree', sans-serif"
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0',
    lineHeight: '1',
    fontFamily: "'Figtree', sans-serif"
  },
  statChange: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statChangeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#10b981'
  },
  statChangeText: {
    margin: '0',
    color: '#6b7280',
    fontWeight: '400'
  },
  
  // Chart Container Styles - Professional Look
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0',
    fontFamily: "'Figtree', sans-serif"
  },
  chartValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginTop: '4px',
    fontFamily: "'Figtree', sans-serif"
  },
  timeFilter: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    color: '#1f2937',
    fontFamily: "'Figtree', sans-serif",
    cursor: 'pointer'
  },
  barChart: {
    flex: '1',
    minHeight: '260px',
    width: '100%'
  },
  
  // Funnel Chart Styles - Dark Theme
  funnelChart: {
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '24px',
    color: 'white'
  },
  funnelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  funnelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    margin: '0',
    fontFamily: "'Figtree', sans-serif"
  },
  funnelLegend: {
    display: 'flex',
    gap: '24px',
    marginTop: '24px'
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  legendLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: "'Figtree', sans-serif"
  },
  legendValue: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Figtree', sans-serif"
  },
  
  // Professional Table Styles
  professionalTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'Figtree', sans-serif"
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb'
  },
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '14px',
    color: '#1f2937'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusApproved: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  statusInReview: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  
  // Filter Bar Styles
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '16px 24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(229, 231, 235, 0.8)'
  },
  filterInput: {
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    color: '#1f2937',
    fontFamily: "'Figtree', sans-serif",
    minWidth: '120px'
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
    display: 'block'
  }
};\n`;
};

const formatCode = (code) => {
  // Remove excessive whitespace and clean up formatting
  return code
    .trim()
    .replace(/^\s{0,2}\n/gm, "") // Remove empty lines with minimal indentation
    .replace(/\n{3,}/g, "\n\n"); // Replace multiple newlines with max 2
};

// CSS generation for separate CSS file
export const generateCSSFile = () => {
  return `/* Dashboard CSS */
.dashboard-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
}

.dashboard-header {
  max-width: 80rem;
  margin: 0 auto;
}

.dashboard-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1.5rem;
}

.dashboard-row {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  margin-bottom: 1.5rem;
}

.widget-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  padding: 1rem;
}

.widget-full {
  flex: 1;
  flex-basis: 100%;
}

.widget-half {
  flex: 1;
  flex-basis: 50%;
}

.widget-third {
  flex: 1;
  flex-basis: 33.333%;
}

.widget-header {
  margin-bottom: 1rem;
}

.widget-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.widget-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.chart-wrapper {
  margin: 1rem 0;
}

.chart-container {
  width: 100%;
  height: 250px;
}

.kpi-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.kpi-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.kpi-icon {
  width: 2rem;
  height: 2rem;
  background-color: #e0f2fe;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.kpi-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.25rem;
}

.kpi-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.kpi-growth {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.kpi-growth.positive {
  color: #059669;
}

.kpi-growth.negative {
  color: #dc2626;
}

.time-filters {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.time-filter-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  background-color: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.time-filter-btn:hover {
  background-color: #f9fafb;
}

.time-filter-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.chart-grid {
  stroke: #e5e7eb;
}

.chart-axis {
  font-size: 12px;
  fill: #6b7280;
}

.chart-tooltip {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.chart-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: #6b7280;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dashboard-container {
    background-color: #111827;
  }
  
  .widget-container {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .widget-title {
    color: #f9fafb;
  }
  
  .widget-subtitle {
    color: #9ca3af;
  }
  
  .kpi-value {
    color: #f9fafb;
  }
  
  .kpi-title {
    color: #9ca3af;
  }
  
  .chart-grid {
    stroke: #374151;
  }
  
  .chart-axis {
    fill: #9ca3af;
  }
}
`;
};

// Additional helper functions for props generation
const getKPIContainerProps = (styleMode, includeStyles, widthClass) => {
  if (!includeStyles) return widthClass || "";

  const baseProps = widthClass || "";

  switch (styleMode) {
    case "inline":
      return `${baseProps} style={{...styles.widgetContainer, ...styles.widgetFull}}`;
    case "css":
      return `${baseProps} className="widget-container kpi-container"`;
    default: // tailwind
      return `${baseProps} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"`;
  }
};

const getKPIContentProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return "style={styles.kpiContainer}";
    case "css":
      return 'className="kpi-content"';
    default: // tailwind
      return 'className="flex items-start justify-between"';
  }
};

const getKPIIconContainerProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return "style={styles.kpiIconContainer}";
    case "css":
      return 'className="kpi-icon"';
    default: // tailwind
      return 'className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center"';
  }
};

const getKPIValueProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return "style={styles.kpiValue}";
    case "css":
      return 'className="kpi-value"';
    default: // tailwind
      return 'className="text-3xl font-bold text-gray-900 dark:text-white"';
  }
};

const getKPITitleProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return "style={styles.kpiTitle}";
    case "css":
      return 'className="kpi-title"';
    default: // tailwind
      return 'className="text-sm text-gray-500 dark:text-gray-400"';
  }
};

const getKPIGrowthProps = (styleMode, includeStyles, isPositive) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      const growthStyle = isPositive
        ? "styles.kpiGrowthPositive"
        : "styles.kpiGrowthNegative";
      return `style={{...styles.kpiGrowth, ...${growthStyle}}}`;
    case "css":
      return `className="kpi-growth ${isPositive ? "positive" : "negative"}"`;
    default: // tailwind
      const colorClass = isPositive ? "text-green-600" : "text-red-600";
      return `className="flex items-center gap-1 text-sm font-medium ${colorClass}"`;
  }
};

const generateProfessionalBarChartCode = (
  widget,
  dataName,
  styleMode,
  includeStyles,
  widthClass
) => {
  const config = widget.config || {};
  const title = config.title || "Bar Chart";
  const totalValue = config.totalValue || "$242,673";

  if (styleMode === "tailwind") {
    return `          <div className="${widthClass}">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 m-0" style={{fontFamily: "'Figtree', sans-serif"}}>${title}</h3>
                  <div className="text-3xl font-bold text-gray-900 mt-1" style={{fontFamily: "'Figtree', sans-serif"}}>${totalValue}</div>
                </div>
                <select className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 cursor-pointer" style={{fontFamily: "'Figtree', sans-serif"}}>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
              <div className="flex-1 min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={${dataName}} barCategoryGap="18%" margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0, 201, 255, 0.85)" />
                        <stop offset="100%" stopColor="rgba(146, 254, 157, 0.85)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="none" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280', fontFamily: "'Figtree', sans-serif" }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280', fontFamily: "'Figtree', sans-serif" }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontFamily: "'Figtree', sans-serif"
                      }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>`;
  } else {
    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.chartContainer}>
              <div style={styles.chartHeader}>
                <div>
                  <h3 style={styles.chartTitle}>${title}</h3>
                  <div style={styles.chartValue}>${totalValue}</div>
                </div>
                <select style={styles.timeFilter}>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
              <div style={styles.barChart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={${dataName}} barCategoryGap="18%" margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0, 201, 255, 0.85)" />
                        <stop offset="100%" stopColor="rgba(146, 254, 157, 0.85)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="none" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280', fontFamily: "'Figtree', sans-serif" }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280', fontFamily: "'Figtree', sans-serif" }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontFamily: "'Figtree', sans-serif"
                      }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>`;
  }
};

const generateSmoothFunnelCode = (
  widget,
  styleMode,
  includeStyles,
  widthClass
) => {
  const config = widget.config || {};
  const title = config.title || "Funnel Chart";

  if (styleMode === "tailwind") {
    return `          <div className="${widthClass}">
            <div className="bg-gray-800 rounded-2xl p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white m-0" style={{fontFamily: "'Figtree', sans-serif"}}>${title}</h3>
                <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white cursor-pointer" style={{fontFamily: "'Figtree', sans-serif"}}>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
              <div className="flex-1 min-h-[200px] mb-6 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  <div className="w-full h-10 rounded-full mb-2" style={{background: 'linear-gradient(90deg, #22d3ee 0%, #38bdf8 100%)'}}></div>
                  <div className="w-4/5 h-10 rounded-full mx-auto mb-2" style={{background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)'}}></div>
                  <div className="w-3/5 h-10 rounded-full mx-auto" style={{background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)'}}></div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-white/60" style={{fontFamily: "'Figtree', sans-serif"}}>Manufacturing</div>
                      <div className="text-base font-semibold text-white" style={{fontFamily: "'Figtree', sans-serif"}}>$30K</div>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-white/60" style={{fontFamily: "'Figtree', sans-serif"}}>Marketing</div>
                      <div className="text-base font-semibold text-white" style={{fontFamily: "'Figtree', sans-serif"}}>$35K</div>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sky-600"></div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-white/60" style={{fontFamily: "'Figtree', sans-serif"}}>Branding</div>
                      <div className="text-base font-semibold text-white" style={{fontFamily: "'Figtree', sans-serif"}}>$35K</div>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-600 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  } else {
    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.funnelChart}>
              <div style={styles.funnelHeader}>
                <h3 style={styles.funnelTitle}>${title}</h3>
                <select style={{...styles.timeFilter, backgroundColor: '#374151', borderColor: '#4b5563', color: 'white'}}>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
              <div style={{flex: '1', minHeight: '200px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '100%', maxWidth: '300px'}}>
                  <div style={{width: '100%', height: '40px', borderRadius: '20px', marginBottom: '8px', background: 'linear-gradient(90deg, #22d3ee 0%, #38bdf8 100%)'}}></div>
                  <div style={{width: '80%', height: '40px', borderRadius: '20px', marginBottom: '8px', margin: '0 auto 8px', background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)'}}></div>
                  <div style={{width: '60%', height: '40px', borderRadius: '20px', margin: '0 auto', background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)'}}></div>
                </div>
              </div>
              <div style={styles.funnelLegend}>
                <div style={styles.legendItem}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                    <div style={{...styles.legendDot, backgroundColor: '#22d3ee'}}></div>
                    <div>
                      <div style={styles.legendLabel}>Manufacturing</div>
                      <div style={styles.legendValue}>$30K</div>
                    </div>
                  </div>
                  <div style={{width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                    <div style={{height: '100%', backgroundColor: '#22d3ee', borderRadius: '2px', width: '100%'}}></div>
                  </div>
                </div>
                <div style={styles.legendItem}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                    <div style={{...styles.legendDot, backgroundColor: '#38bdf8'}}></div>
                    <div>
                      <div style={styles.legendLabel}>Marketing</div>
                      <div style={styles.legendValue}>$35K</div>
                    </div>
                  </div>
                  <div style={{width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                    <div style={{height: '100%', backgroundColor: '#38bdf8', borderRadius: '2px', width: '85%'}}></div>
                  </div>
                </div>
                <div style={styles.legendItem}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                    <div style={{...styles.legendDot, backgroundColor: '#0ea5e9'}}></div>
                    <div>
                      <div style={styles.legendLabel}>Branding</div>
                      <div style={styles.legendValue}>$35K</div>
                    </div>
                  </div>
                  <div style={{width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                    <div style={{height: '100%', backgroundColor: '#0ea5e9', borderRadius: '2px', width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
  }
};

const generateProfessionalTableCode = (
  widget,
  styleMode,
  includeStyles,
  widthClass
) => {
  const config = widget.config || {};
  const title = config.title || "Customers Data";

  if (styleMode === "tailwind") {
    return `          <div className="${widthClass}">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 m-0" style={{fontFamily: "'Figtree', sans-serif"}}>${title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full" style={{fontFamily: "'Figtree', sans-serif"}}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">John Doe</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">#12345</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">$299.99</td>
                      <td className="px-4 py-4 border-b border-gray-100">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Approved</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">Jane Smith</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">#12346</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">$199.99</td>
                      <td className="px-4 py-4 border-b border-gray-100">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">Bob Johnson</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">#12347</td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100">$449.99</td>
                      <td className="px-4 py-4 border-b border-gray-100">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">In Review</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>`;
  } else {
    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>${title}</h3>
              <div style={{overflowX: 'auto'}}>
                <table style={styles.professionalTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Customer</th>
                      <th style={styles.tableHeader}>Order ID</th>
                      <th style={styles.tableHeader}>Amount</th>
                      <th style={styles.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{'&:hover': {backgroundColor: '#f9fafb'}}}>
                      <td style={styles.tableCell}>John Doe</td>
                      <td style={styles.tableCell}>#12345</td>
                      <td style={styles.tableCell}>$299.99</td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...styles.statusApproved}}>Approved</span>
                      </td>
                    </tr>
                    <tr style={{'&:hover': {backgroundColor: '#f9fafb'}}}>
                      <td style={styles.tableCell}>Jane Smith</td>
                      <td style={styles.tableCell}>#12346</td>
                      <td style={styles.tableCell}>$199.99</td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...styles.statusPending}}>Pending</span>
                      </td>
                    </tr>
                    <tr style={{'&:hover': {backgroundColor: '#f9fafb'}}}>
                      <td style={styles.tableCell}>Bob Johnson</td>
                      <td style={styles.tableCell}>#12347</td>
                      <td style={styles.tableCell}>$449.99</td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...styles.statusInReview}}>In Review</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>`;
  }
};

const generateFilterBarCode = (
  widget,
  styleMode,
  includeStyles,
  widthClass
) => {
  const config = widget.config || {};
  const title = config.title || "Advanced Filters";

  if (styleMode === "tailwind") {
    return `          <div className="${widthClass}">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex flex-wrap gap-4 items-center" style={{fontFamily: "'Figtree', sans-serif"}}>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-3 focus:ring-blue-500 focus:border-transparent" />
                    <span className="text-sm text-gray-500">to</span>
                    <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-3 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Transaction Amount</label>
                  <input type="number" placeholder="0.00" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 w-32 focus:ring-3 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Product</label>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 w-40 focus:ring-3 focus:ring-blue-500 focus:border-transparent">
                    <option>All Products</option>
                    <option>Product A</option>
                    <option>Product B</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 w-32 focus:ring-3 focus:ring-blue-500 focus:border-transparent">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>In Review</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Order Quantity</label>
                  <input type="number" placeholder="100" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 w-24 focus:ring-3 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>
          </div>`;
  } else {
    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.filterBar}>
              <div>
                <label style={styles.filterLabel}>Date Range</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="date" style={styles.filterInput} />
                  <span style={{fontSize: '14px', color: '#6b7280'}}>to</span>
                  <input type="date" style={styles.filterInput} />
                </div>
              </div>
              <div>
                <label style={styles.filterLabel}>Transaction Amount</label>
                <input type="number" placeholder="0.00" style={{...styles.filterInput, width: '120px'}} />
              </div>
              <div>
                <label style={styles.filterLabel}>Product</label>
                <select style={{...styles.filterInput, width: '160px'}}>
                  <option>All Products</option>
                  <option>Product A</option>
                  <option>Product B</option>
                </select>
              </div>
              <div>
                <label style={styles.filterLabel}>Status</label>
                <select style={{...styles.filterInput, width: '128px'}}>
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>In Review</option>
                </select>
              </div>
              <div>
                <label style={styles.filterLabel}>Order Quantity</label>
                <input type="number" placeholder="100" style={{...styles.filterInput, width: '96px'}} />
              </div>
            </div>
          </div>`;
  }
};

const generateStandardChartCode = (
  widget,
  dataName,
  styleMode,
  includeStyles,
  widthClass
) => {
  const { config } = widget;
  const chartCode = generateChartCode(widget.type, dataName, config, styleMode);
  const containerProps = getKPIContainerProps(
    styleMode,
    includeStyles,
    widthClass
  );

  return `          <div ${containerProps}>
            <div className="mb-4">
              <h3>${config?.title || "Chart"}</h3>
            </div>
            <div>
              ${chartCode}
            </div>
          </div>`;
};

// Additional helper functions
const getWidgetContainerProps = (colSpan, styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return "style={styles.widgetContainer}";
    case "css":
      return 'className="widget-container"';
    default: // tailwind
      return `className="col-span-${colSpan} bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"`;
  }
};

const getWidgetHeaderProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return 'style={{marginBottom: "1rem"}}';
    case "css":
      return 'className="widget-header"';
    default: // tailwind
      return 'className="mb-4"';
  }
};

const getTitleProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return 'style={{fontSize: "1.125rem", fontWeight: "600", color: "#111827"}}';
    case "css":
      return 'className="widget-title"';
    default: // tailwind
      return 'className="text-lg font-semibold text-gray-900 dark:text-white"';
  }
};

const getSubtitleProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return 'style={{fontSize: "0.875rem", color: "#6b7280"}}';
    case "css":
      return 'className="widget-subtitle"';
    default: // tailwind
      return 'className="text-sm text-gray-500 dark:text-gray-400"';
  }
};

const getChartContainerProps = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  switch (styleMode) {
    case "inline":
      return 'style={{margin: "1rem 0"}}';
    case "css":
      return 'className="chart-wrapper"';
    default: // tailwind
      return 'className="my-4"';
  }
};

const generateTimeFilters = (styleMode, includeStyles) => {
  if (!includeStyles) return "";

  const containerProps =
    styleMode === "inline"
      ? 'style={{display: "flex", gap: "0.5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb"}}'
      : styleMode === "css"
      ? 'className="time-filters"'
      : 'className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"';

  const buttonProps = (timeRange) => {
    if (styleMode === "inline") {
      return `style={{padding: "0.25rem 0.75rem", fontSize: "0.875rem", borderRadius: "0.375rem", transition: "all 0.2s", backgroundColor: timeRange === '${timeRange.toLowerCase()}' ? '#3b82f6' : 'transparent', color: timeRange === '${timeRange.toLowerCase()}' ? 'white' : '#374151', border: timeRange === '${timeRange.toLowerCase()}' ? 'none' : '1px solid #d1d5db'}}`;
    }

    if (styleMode === "css") {
      return `className="time-filter-btn \${timeRange === '${timeRange.toLowerCase()}' ? 'active' : ''}"`;
    }

    return `className={\`px-3 py-1 text-sm rounded-md transition-colors \${
                  timeRange === '${timeRange.toLowerCase()}' 
                    ? 'bg-blue-500 text-white' 
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }\`}`;
  };

  return `<div ${containerProps}>
              <button onClick={() => setTimeRange('daily')} ${buttonProps(
                "Daily"
              )}>Daily</button>
              <button onClick={() => setTimeRange('weekly')} ${buttonProps(
                "Weekly"
              )}>Weekly</button>
              <button onClick={() => setTimeRange('monthly')} ${buttonProps(
                "Monthly"
              )}>Monthly</button>
              <button onClick={() => setTimeRange('yearly')} ${buttonProps(
                "Yearly"
              )}>Yearly</button>
            </div>`;
};

// Data Table Generation
const generateDataTableCode = (
  widget,
  styleMode,
  includeStyles,
  widthClass
) => {
  const { config } = widget;
  const title = config?.title || "Data Table";

  if (styleMode === "tailwind") {
    return `          <div className="${widthClass}">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 h-full flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: "'Figtree', sans-serif"}}>${title}</h3>
                
                {/* Search Bar */}
                <div className="relative mb-4">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-3 focus:ring-blue-500 focus:border-transparent"
                    style={{fontFamily: "'Figtree', sans-serif"}}
                  />
                </div>
              </div>
              
              {/* Table */}
              <div className="flex-1 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm" style={{fontFamily: "'Figtree', sans-serif"}}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 first:rounded-tl-lg">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sales</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Growth</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 last:rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4 font-medium text-gray-900">Product A</td>
                      <td className="py-3 px-4 text-gray-600">Electronics</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">$45,234</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-semibold">+12.5%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4 font-medium text-gray-900">Product B</td>
                      <td className="py-3 px-4 text-gray-600">Clothing</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">$32,156</td>
                      <td className="py-3 px-4">
                        <span className="text-red-600 font-semibold">-5.2%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4 font-medium text-gray-900">Product C</td>
                      <td className="py-3 px-4 text-gray-600">Food</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">$28,934</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-semibold">+8.7%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>`;
  } else {
    return `          <div style={styles.${
      widthClass === "w-full"
        ? "widgetFull"
        : widthClass === "w-1/2"
        ? "widgetHalf"
        : "widgetThird"
    }}>
            <div style={styles.chartContainer}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>${title}</h3>
                
                {/* Search Bar */}
                <div style={{position: 'relative', marginBottom: '16px'}}>
                  <input
                    type="text"
                    placeholder="Search..."
                    style={styles.filterInput}
                  />
                </div>
              </div>
              
              {/* Table */}
              <div style={{flex: '1', overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px'}}>
                <table style={styles.professionalTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Name</th>
                      <th style={styles.tableHeader}>Category</th>
                      <th style={styles.tableHeader}>Sales</th>
                      <th style={styles.tableHeader}>Growth</th>
                      <th style={styles.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.tableCell}>Product A</td>
                      <td style={styles.tableCell}>Electronics</td>
                      <td style={styles.tableCell}>$45,234</td>
                      <td style={styles.tableCell}>
                        <span style={{color: '#10b981', fontWeight: '600'}}>+12.5%</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...styles.statusApproved}}>Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.tableCell}>Product B</td>
                      <td style={styles.tableCell}>Clothing</td>
                      <td style={styles.tableCell}>$32,156</td>
                      <td style={styles.tableCell}>
                        <span style={{color: '#ef4444', fontWeight: '600'}}>-5.2%</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...styles.statusApproved}}>Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.tableCell}>Product C</td>
                      <td style={styles.tableCell}>Food</td>
                      <td style={styles.tableCell}>$28,934</td>
                      <td style={styles.tableCell}>
                        <span style={{color: '#10b981', fontWeight: '600'}}>+8.7%</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...styles.statusInReview}}>Inactive</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>`;
  }
};

const getGridProps = (styleMode) => {
  switch (styleMode) {
    case "inline":
      return 'stroke="#e5e7eb"';
    case "css":
      return 'className="chart-grid"';
    default: // tailwind
      return 'className="stroke-gray-200 dark:stroke-gray-700"';
  }
};

const getAxisProps = (styleMode) => {
  switch (styleMode) {
    case "inline":
      return 'tick={{fontSize: 12, fill: "#6b7280"}}';
    case "css":
      return 'className="chart-axis"';
    default: // tailwind
      return 'className="text-gray-600 dark:text-gray-400" tick={{fontSize: 12}}';
  }
};

const getTooltipProps = (styleMode) => {
  switch (styleMode) {
    case "inline":
      return 'contentStyle={{backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #e5e7eb", borderRadius: "0.375rem"}}';
    case "css":
      return 'className="chart-tooltip"';
    default: // tailwind
      return 'contentStyle={{backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #e5e7eb", borderRadius: "0.375rem"}}';
  }
};

const getErrorContainerProps = (styleMode) => {
  switch (styleMode) {
    case "inline":
      return 'style={{display: "flex", alignItems: "center", justifyContent: "center", height: "250px", color: "#6b7280"}}';
    case "css":
      return 'className="chart-error"';
    default: // tailwind
      return 'className="flex items-center justify-center h-[250px] text-gray-500"';
  }
};
