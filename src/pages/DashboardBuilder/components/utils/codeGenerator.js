// src/pages/DashboardBuilder/utils/codeGenerator.js
import { getChartDataTemplate } from './mockDataTemplates';

export const generateDashboardCode = (widgets, componentName = 'Dashboard', options = {}) => {
  const { includeData = 'inline', includeStyles = true } = options;
  
  // Determine required imports
  const imports = generateImports(widgets);
  
  // Generate mock data if needed
  const mockData = includeData === 'inline' ? generateMockDataCode(widgets) : '';
  
  // Generate widget components
  const widgetComponents = generateWidgetComponents(widgets, includeData);
  
  // Generate the complete component
  return formatCode(`
import React, { useState } from 'react';
${imports}
${includeData === 'separate' ? "import { mockData } from './mockData';" : ''}

${mockData}

const ${componentName} = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Add your data fetching logic here
  // useEffect(() => {
  //   fetchDashboardData();
  // }, [timeRange, selectedFilter]);
  
  return (
    <div className="${includeStyles ? 'min-h-screen bg-gray-50 dark:bg-gray-900 p-6' : ''}">
      <div className="${includeStyles ? 'max-w-7xl mx-auto' : ''}">
        <h1 className="${includeStyles ? 'text-3xl font-bold text-gray-900 dark:text-white mb-6' : ''}">
          ${componentName.replace(/([A-Z])/g, ' $1').trim()}
        </h1>
        
        <div className="grid grid-cols-12 gap-4">
${widgetComponents}
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
  `);
};

const generateImports = (widgets) => {
  const chartTypes = new Set(widgets.map(w => w.type));
  const rechartsImports = [];
  
  // Base imports always needed
  const baseImports = ['ResponsiveContainer', 'Tooltip'];
  
  // Chart-specific imports
  if (chartTypes.has('line-chart')) {
    rechartsImports.push('LineChart', 'Line');
    baseImports.push('XAxis', 'YAxis', 'CartesianGrid', 'Legend');
  }
  if (chartTypes.has('bar-chart')) {
    rechartsImports.push('BarChart', 'Bar');
    baseImports.push('XAxis', 'YAxis', 'CartesianGrid', 'Legend');
  }
  if (chartTypes.has('area-chart')) {
    rechartsImports.push('AreaChart', 'Area');
    baseImports.push('XAxis', 'YAxis', 'CartesianGrid', 'Legend');
  }
  if (chartTypes.has('pie-chart')) {
    rechartsImports.push('PieChart', 'Pie', 'Cell');
  }
  if (chartTypes.has('funnel-chart')) {
    rechartsImports.push('FunnelChart', 'Funnel', 'LabelList');
  }
  
  // Remove duplicates
  const uniqueBaseImports = [...new Set(baseImports)];
  
  return `import {
  ${[...rechartsImports, ...uniqueBaseImports].join(',\n  ')}
} from 'recharts';`;
};

const generateMockDataCode = (widgets) => {
  const dataSets = [];
  const usePieChart = widgets.some(w => w.type === 'pie-chart');
  
  widgets.forEach((widget, index) => {
    const dataName = `${widget.type.replace('-', '')}Data${index}`;
    const data = getChartDataTemplate(widget.type);
    dataSets.push(`const ${dataName} = ${JSON.stringify(data, null, 2)};`);
  });
  
  const pieColors = usePieChart ? "const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];" : '';
  
  return `// Mock Data
${dataSets.join('\n\n')}

${pieColors}`;
};

const generateWidgetComponents = (widgets, includeData) => {
  return widgets.map((widget, index) => {
    const dataName = includeData !== 'none' 
      ? `${widget.type.replace('-', '')}Data${index}`
      : 'data';
    
    return generateWidgetCode(widget, dataName, index);
  }).join('\n');
};

const generateWidgetCode = (widget, dataName, index) => {
  const { position, config } = widget;
  const chartCode = generateChartCode(widget.type, dataName, config);
  
  return `          {/* ${config?.title || `Widget ${index + 1}`} */}
          <div className="col-span-${position.w} bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ${config?.title || 'Untitled Widget'}
              </h3>
              ${config?.subtitle ? `<p className="text-sm text-gray-500 dark:text-gray-400">${config.subtitle}</p>` : ''}
            </div>
            
            {/* KPIs */}
            ${config?.showKPIs !== false ? generateKPICode() : ''}
            
            {/* Chart */}
            <div className="my-4">
              ${chartCode}
            </div>
            
            {/* Time Filters */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setTimeRange('daily')}
                className={\`px-3 py-1 text-sm rounded-md transition-colors \${
                  timeRange === 'daily' 
                    ? 'bg-blue-500 text-white' 
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }\`}
              >
                Daily
              </button>
              <button 
                onClick={() => setTimeRange('weekly')}
                className={\`px-3 py-1 text-sm rounded-md transition-colors \${
                  timeRange === 'weekly' 
                    ? 'bg-blue-500 text-white' 
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }\`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setTimeRange('monthly')}
                className={\`px-3 py-1 text-sm rounded-md transition-colors \${
                  timeRange === 'monthly' 
                    ? 'bg-blue-500 text-white' 
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }\`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeRange('yearly')}
                className={\`px-3 py-1 text-sm rounded-md transition-colors \${
                  timeRange === 'yearly' 
                    ? 'bg-blue-500 text-white' 
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }\`}
              >
                Yearly
              </button>
            </div>
          </div>`;
};

const generateKPICode = () => {
  return `<div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  12.5K
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  2.1K
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xl font-bold text-green-500">
                  +24%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Growth</div>
              </div>
            </div>`;
};

const generateChartCode = (type, dataName, config) => {
  const color = config?.color || '#3B82F6';
  
  switch(type) {
    case 'line-chart':
      return `<ResponsiveContainer width="100%" height={250}>
                <LineChart data={${dataName}} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="name" 
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="${color}"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>`;
    
    case 'bar-chart':
      return `<ResponsiveContainer width="100%" height={250}>
                <BarChart data={${dataName}} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="name"
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="${color}"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>`;
    
    case 'area-chart':
      return `<ResponsiveContainer width="100%" height={250}>
                <AreaChart data={${dataName}} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="name"
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="${color}"
                    fill="${color}"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>`;
    
    case 'pie-chart':
      return `<ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={${dataName}}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {${dataName}.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>`;
    
    case 'funnel-chart':
      return `<ResponsiveContainer width="100%" height={250}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={${dataName}}
                    isAnimationActive
                  >
                    <LabelList position="center" fill="#fff" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>`;
    
    default:
      return `<div className="flex items-center justify-center h-[250px] text-gray-500">
                Chart type not supported
              </div>`;
  }
};

const formatCode = (code) => {
  // Remove excessive whitespace and clean up formatting
  return code
    .trim()
    .replace(/^\s{0,2}\n/gm, '') // Remove empty lines with minimal indentation
    .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with max 2
};