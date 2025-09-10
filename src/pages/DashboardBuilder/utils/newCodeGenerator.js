// Enhanced Code Generator - Clean, optimized, and error-free
import { getChartDataTemplate } from './mockDataTemplates';

export const generateDashboardCode = (widgets, componentName = 'Dashboard', options = {}) => {
  const { 
    includeData = 'inline', 
    includeStyles = true, 
    styleMode = 'tailwind', 
    includeRowLayout = true, 
    fileType = 'jsx' 
  } = options;
  
  // Clean component name
  const cleanComponentName = cleanVariableName(componentName);
  
  // Generate imports
  const imports = generateCleanImports(widgets, styleMode, fileType);
  
  // Generate mock data
  const mockData = includeData === 'inline' ? generateCleanMockData(widgets) : '';
  
  // Generate CSS if needed
  const cssStyles = styleMode === 'inline' ? generateInlineStyles() : '';
  
  // Generate component layout
  const layoutCode = generateComponentLayout(widgets, includeData, styleMode, includeStyles, includeRowLayout);
  
  // Generate complete component
  const componentCode = `${imports}
${includeData === 'separate' ? "import { mockData } from './mockData';" : ''}
${styleMode === 'css' ? "import './dashboard.css';" : ''}

${mockData}

${cssStyles}

const ${cleanComponentName} = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  return (
    ${generateContainerWrapper(styleMode, includeStyles)}
      ${generateHeaderSection(cleanComponentName, styleMode, includeStyles)}
      
      ${layoutCode}
    ${generateContainerClose(styleMode)}
  );
};

export default ${cleanComponentName};
`;

  return formatCode(componentCode);
};

// Generate clean, deduplicated imports
const generateCleanImports = (widgets, styleMode, fileType) => {
  const imports = {
    react: new Set(['React', 'useState']),
    recharts: new Set(),
    icons: new Set(),
  };
  
  const chartTypes = new Set(widgets.map(w => w.type));
  
  // Chart import mapping
  const chartImports = {
    'line-chart': ['LineChart', 'Line', 'XAxis', 'YAxis', 'CartesianGrid', 'Legend'],
    'bar-chart': ['BarChart', 'Bar', 'XAxis', 'YAxis', 'CartesianGrid', 'Legend'],
    'gradient-bar-chart': ['BarChart', 'Bar', 'XAxis', 'YAxis', 'CartesianGrid'],
    'area-chart': ['AreaChart', 'Area', 'XAxis', 'YAxis', 'CartesianGrid', 'Legend'],
    'pie-chart': ['PieChart', 'Pie', 'Cell'],
    'funnel-chart': ['FunnelChart', 'Funnel', 'LabelList'],
    'smooth-funnel-chart': []
  };
  
  // Base chart components
  const hasCharts = Array.from(chartTypes).some(type => type.includes('chart'));
  if (hasCharts) {
    imports.recharts.add('ResponsiveContainer');
    imports.recharts.add('Tooltip');
  }
  
  // Add chart-specific imports
  chartTypes.forEach(type => {
    if (chartImports[type]) {
      chartImports[type].forEach(imp => imports.recharts.add(imp));
    }
  });
  
  // Add icon imports for KPI widgets
  const hasKPIWidgets = Array.from(chartTypes).some(type => type.includes('kpi'));
  if (hasKPIWidgets) {
    imports.icons.add('FiTrendingUp');
    imports.icons.add('FiTrendingDown');
    imports.icons.add('FiDollarSign');
    imports.icons.add('FiShoppingCart');
    imports.icons.add('FiUsers');
  }
  
  // Build import statements
  let importString = `import ${Array.from(imports.react).join(', ')} from 'react';\n`;
  
  if (imports.recharts.size > 0) {
    const sortedRecharts = Array.from(imports.recharts).sort();
    importString += `import {\n  ${sortedRecharts.join(',\n  ')}\n} from 'recharts';\n`;
  }
  
  if (imports.icons.size > 0) {
    const sortedIcons = Array.from(imports.icons).sort();
    importString += `import { ${sortedIcons.join(', ')} } from 'react-icons/fi';\n`;
  }
  
  return importString;
};

// Generate clean mock data with proper variable names
const generateCleanMockData = (widgets) => {
  const dataSets = [];
  const usedNames = new Set();
  const hasColors = widgets.some(w => w.type === 'pie-chart');
  
  widgets.forEach((widget, index) => {
    const baseName = cleanVariableName(widget.type);
    let dataName = `${baseName}Data${index}`;
    
    // Ensure unique names
    let counter = 0;
    while (usedNames.has(dataName)) {
      counter++;
      dataName = `${baseName}Data${index}_${counter}`;
    }
    usedNames.add(dataName);
    
    const data = getChartDataTemplate(widget.type);
    dataSets.push(`const ${dataName} = ${JSON.stringify(data, null, 2)};`);
  });
  
  const colorConstants = hasColors ? `
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];` : '';
  
  return `// Mock Data
${dataSets.join('\n\n')}
${colorConstants}
`;
};

// Generate component layout based on row structure
const generateComponentLayout = (widgets, includeData, styleMode, includeStyles, includeRowLayout) => {
  if (!widgets.length) return '<div>No widgets to display</div>';
  
  // Group widgets by row
  const widgetsByRow = groupWidgetsByRow(widgets);
  const sortedRows = Object.keys(widgetsByRow).sort();
  
  return sortedRows.map(rowId => {
    const rowWidgets = widgetsByRow[rowId];
    return generateRowLayout(rowWidgets, includeData, styleMode, includeStyles);
  }).join('\n\n      ');
};

// Group widgets by their row position
const groupWidgetsByRow = (widgets) => {
  const grouped = {};
  
  widgets.forEach(widget => {
    const rowId = widget.position?.rowId || 'default-row';
    if (!grouped[rowId]) grouped[rowId] = [];
    grouped[rowId].push(widget);
  });
  
  // Sort widgets within each row by their index
  Object.keys(grouped).forEach(rowId => {
    grouped[rowId].sort((a, b) => (a.position?.index || 0) - (b.position?.index || 0));
  });
  
  return grouped;
};

// Generate a single row layout
const generateRowLayout = (rowWidgets, includeData, styleMode, includeStyles) => {
  const widgetComponents = rowWidgets.map((widget, index) => {
    return generateWidgetComponent(widget, index, includeData, styleMode, includeStyles);
  });
  
  const rowClasses = getRowClasses(styleMode, includeStyles);
  const widgetClasses = getWidgetClasses(rowWidgets.length, styleMode, includeStyles);
  
  return `<div ${rowClasses}>
        ${widgetComponents.map((comp, i) => 
          `<div ${widgetClasses}>\n          ${comp}\n        </div>`
        ).join('\n        ')}
      </div>`;
};

// Generate individual widget component
const generateWidgetComponent = (widget, index, includeData, styleMode, includeStyles) => {
  const dataVariable = includeData === 'inline' ? `${cleanVariableName(widget.type)}Data${index}` : 'mockData';
  
  switch (widget.type) {
    case 'revenue-kpi':
      return generateRevenueKPI(widget, styleMode, includeStyles);
    case 'orders-kpi':
      return generateOrdersKPI(widget, styleMode, includeStyles);
    case 'customers-kpi':
      return generateCustomersKPI(widget, styleMode, includeStyles);
    case 'gradient-bar-chart':
      return generateGradientBarChart(widget, dataVariable, styleMode, includeStyles);
    case 'smooth-funnel-chart':
      return generateSmoothFunnelChart(widget, styleMode, includeStyles);
    case 'professional-table':
      return generateProfessionalTable(widget, dataVariable, styleMode, includeStyles);
    case 'advanced-filter-bar':
      return generateAdvancedFilterBar(widget, styleMode, includeStyles);
    default:
      return generateStandardChart(widget, dataVariable, styleMode, includeStyles);
  }
};

// Professional KPI Components
const generateRevenueKPI = (widget, styleMode, includeStyles) => {
  const config = widget.config || {};
  const value = config.value || 847293;
  const growth = config.growth || 4.1;
  const title = config.title || 'Total Revenue';
  
  const containerProps = getKPIContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">${title}</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                $${value.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+${growth}%</span>
              <span className="text-xs text-gray-500">from last week</span>
            </div>
          </div>`;
};

const generateOrdersKPI = (widget, styleMode, includeStyles) => {
  const config = widget.config || {};
  const value = config.value || 2847;
  const growth = config.growth || 2.6;
  const title = config.title || 'Orders';
  
  const containerProps = getKPIContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FiShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">${title}</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${value.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+${growth}%</span>
              <span className="text-xs text-gray-500">from last week</span>
            </div>
          </div>`;
};

const generateCustomersKPI = (widget, styleMode, includeStyles) => {
  const config = widget.config || {};
  const value = config.value || 12483;
  const growth = config.growth || 2.8;
  const title = config.title || 'Customers';
  
  const containerProps = getKPIContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">${title}</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${value.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+${growth}%</span>
              <span className="text-xs text-gray-500">from last week</span>
            </div>
          </div>`;
};

// Chart Components
const generateGradientBarChart = (widget, dataVariable, styleMode, includeStyles) => {
  const config = widget.config || {};
  const title = config.title || 'Bar Chart';
  const totalValue = config.mainValue || 242673;
  
  const containerProps = getChartContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">${title}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  $${totalValue.toLocaleString()}
                </p>
              </div>
              <select className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                <option>Week</option>
                <option>Month</option>
                <option>Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={${dataVariable}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#92FE9D" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>`;
};

const generateSmoothFunnelChart = (widget, styleMode, includeStyles) => {
  const config = widget.config || {};
  const title = config.title || 'Funnel Chart';
  
  const containerProps = getChartContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">${title}</h3>
              <select className="px-3 py-1 bg-gray-700 rounded-md text-sm text-white">
                <option>Week</option>
                <option>Month</option>
                <option>Year</option>
              </select>
            </div>
            <div className="space-y-4 mb-6">
              <div className="h-6 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"></div>
              <div className="h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-4/5 ml-auto mr-auto"></div>
              <div className="h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/5 ml-auto mr-auto"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Manufacturing</span>
                </div>
                <p className="text-xl font-bold text-white">$30,000</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Marketing</span>
                </div>
                <p className="text-xl font-bold text-white">$35,000</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Branding</span>
                </div>
                <p className="text-xl font-bold text-white">$35,000</p>
              </div>
            </div>
          </div>`;
};

const generateProfessionalTable = (widget, dataVariable, styleMode, includeStyles) => {
  const config = widget.config || {};
  const title = config.title || 'Data Table';
  
  const containerProps = getChartContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">${title}</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">$1,234</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>`;
};

const generateAdvancedFilterBar = (widget, styleMode, includeStyles) => {
  const containerProps = getFilterBarProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <input type="date" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <span className="text-sm text-gray-500">to</span>
                <input type="date" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <input type="number" placeholder="Transaction Amount" className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40" />
              </div>
              <div>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm w-32">
                  <option>All Products</option>
                  <option>Product A</option>
                  <option>Product B</option>
                </select>
              </div>
              <div>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm w-32">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                </select>
              </div>
            </div>
          </div>`;
};

const generateStandardChart = (widget, dataVariable, styleMode, includeStyles) => {
  const config = widget.config || {};
  const title = config.title || 'Chart';
  
  const containerProps = getChartContainerProps(styleMode, includeStyles);
  
  return `<div ${containerProps}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">${title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={${dataVariable}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>`;
};

// Utility functions
const cleanVariableName = (name) => {
  return name
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .replace(/^[0-9]/, '') // Remove leading numbers
    .toLowerCase()
    .replace(/^./, char => char.toUpperCase()); // Capitalize first letter
};

const getRowClasses = (styleMode, includeStyles) => {
  if (styleMode === 'tailwind') {
    return 'className="flex gap-6 mb-6"';
  }
  return 'style={{display: "flex", gap: "24px", marginBottom: "24px"}}';
};

const getWidgetClasses = (widgetCount, styleMode, includeStyles) => {
  const flexBasis = widgetCount === 1 ? '100%' : 
                   widgetCount === 2 ? '50%' : 
                   '33.333%';
  
  if (styleMode === 'tailwind') {
    const flexClass = widgetCount === 1 ? 'flex-1' :
                      widgetCount === 2 ? 'flex-1' :
                      'flex-1';
    return `className="${flexClass}"`;
  }
  
  return `style={{flex: 1, flexBasis: "${flexBasis}"}}`;
};

const getKPIContainerProps = (styleMode, includeStyles) => {
  if (styleMode === 'tailwind') {
    return 'className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"';
  }
  return 'style={{backgroundColor: "white", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb"}}';
};

const getChartContainerProps = (styleMode, includeStyles) => {
  if (styleMode === 'tailwind') {
    return 'className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"';
  }
  return 'style={{backgroundColor: "white", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb"}}';
};

const getFilterBarProps = (styleMode, includeStyles) => {
  if (styleMode === 'tailwind') {
    return 'className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"';
  }
  return 'style={{backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb"}}';
};

const generateContainerWrapper = (styleMode, includeStyles) => {
  if (styleMode === 'tailwind') {
    return '<div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">\n      <div className="max-w-7xl mx-auto">';
  }
  return '<div style={{padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh"}}>\n      <div style={{maxWidth: "1280px", margin: "0 auto"}}>';
};

const generateHeaderSection = (componentName, styleMode, includeStyles) => {
  if (styleMode === 'tailwind') {
    return `<header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">${componentName}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time dashboard analytics</p>
        </header>`;
  }
  return `<header style={{marginBottom: "32px"}}>
          <h1 style={{fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0}}>${componentName}</h1>
          <p style={{color: "#6b7280", marginTop: "8px", margin: 0}}>Real-time dashboard analytics</p>
        </header>`;
};

const generateContainerClose = (styleMode) => {
  return '</div>\n    </div>';
};

const generateInlineStyles = () => {
  return `const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  wrapper: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  row: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px'
  },
  widget: {
    flex: 1,
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  }
};
`;
};

const formatCode = (code) => {
  return code
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
    .replace(/^\s+/gm, (match) => match) // Preserve indentation
    .trim();
};

// Generate separate CSS file
export const generateCSSFile = () => {
  return `/* Dashboard Styles */
.dashboard-container {
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;
}

.dashboard-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 30px;
  font-weight: bold;
  color: #111827;
  margin: 0;
}

.dashboard-subtitle {
  color: #6b7280;
  margin-top: 8px;
  margin: 0;
}

.dashboard-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.dashboard-widget {
  flex: 1;
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-value {
  font-size: 24px;
  font-weight: bold;
  color: #111827;
  margin: 8px 0;
}

.kpi-growth {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #16a34a;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
}

.table {
  min-width: 100%;
  border-collapse: collapse;
}

.table-header {
  background-color: #f9fafb;
  padding: 12px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-cell {
  padding: 16px 24px;
  white-space: nowrap;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.status-badge {
  display: inline-flex;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
}

.status-approved {
  background-color: #dcfce7;
  color: #166534;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-review {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .dashboard-container {
    background-color: #111827;
  }
  
  .dashboard-widget {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .dashboard-title {
    color: #f9fafb;
  }
  
  .dashboard-subtitle {
    color: #9ca3af;
  }
  
  .kpi-value {
    color: #f9fafb;
  }
  
  .table-header {
    background-color: #374151;
    color: #d1d5db;
  }
  
  .table-cell {
    color: #f9fafb;
    border-color: #374151;
  }
}
`;
};

export default { generateDashboardCode, generateCSSFile };
