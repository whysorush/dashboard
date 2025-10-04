// src/pages/DashboardBuilder/templates/widgetTemplates.js

export const getWidgetTemplate = (widget, dataVariable) => {
    switch (widget.type) {
      case 'line-chart':
        return getLineChartTemplate(widget, dataVariable);
      case 'bar-chart':
        return getBarChartTemplate(widget, dataVariable);
      case 'area-chart':
        return getAreaChartTemplate(widget, dataVariable);
      case 'pie-chart':
        return getPieChartTemplate(widget, dataVariable);
      case 'funnel-chart':
        return getFunnelChartTemplate(widget, dataVariable);
      case 'kpi-card':
        return getKPICardTemplate(widget, dataVariable);
      case 'data-table':
        return getDataTableTemplate(widget, dataVariable);
      default:
        return getDefaultTemplate(widget);
    }
  };
  
  const getLineChartTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'Line Chart'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${config.title || 'Line Chart'}</h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={${dataVariable}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="${config.smoothCurves ? 'monotone' : 'linear'}"
              dataKey="value" 
              stroke="${config.color || '#25CFFD'}"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    `.trim();
  };
  
  const getBarChartTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'Bar Chart'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${config.title || 'Bar Chart'}</h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={${dataVariable}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="${config.color || '#25CFFD'}"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    `.trim();
  };
  
  const getAreaChartTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'Area Chart'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${config.title || 'Area Chart'}</h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={${dataVariable}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="${config.smoothCurves ? 'monotone' : 'linear'}"
              dataKey="value" 
              stroke="${config.color || '#25CFFD'}"
              fill="${config.color || '#25CFFD'}"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    `.trim();
  };
  
  const getPieChartTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'Pie Chart'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${config.title || 'Pie Chart'}</h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={${dataVariable}}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {${dataVariable}.map((entry, index) => (
                <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    `.trim();
  };
  
  const getFunnelChartTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'Funnel Chart'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${config.title || 'Funnel Chart'}</h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={${dataVariable}}
              isAnimationActive
            >
              <LabelList position="center" fill="#fff" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    `.trim();
  };
  
  const getKPICardTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'KPI Card'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">${config.title || 'KPI'}</h3>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
        
        <div className="text-2xl font-bold mb-2">
          {/* Replace with actual value */}
          $42,567
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-500">
            +12.5%
          </span>
          <span className="text-xs text-gray-500">increase</span>
        </div>
      </div>
    `.trim();
  };
  
  const getDataTableTemplate = (widget, dataVariable) => {
    const { config } = widget;
    return `
      {/* ${config.title || 'Data Table'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${config.title || 'Data Table'}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Value</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {${dataVariable}.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{row.name}</td>
                  <td className="py-2">{row.value}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    `.trim();
  };
  
  const getDefaultTemplate = (widget) => {
    return `
      {/* ${widget.config?.title || 'Widget'} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">${widget.config?.title || 'Widget'}</h3>
        <p className="text-gray-600">Widget content here</p>
      </div>
    `.trim();
  };
  
  export const getImportsForWidget = (widget) => {
    const imports = new Set();
    
    switch (widget.type) {
      case 'line-chart':
        imports.add('LineChart');
        imports.add('Line');
        imports.add('XAxis');
        imports.add('YAxis');
        imports.add('CartesianGrid');
        imports.add('Tooltip');
        imports.add('Legend');
        imports.add('ResponsiveContainer');
        break;
      case 'bar-chart':
        imports.add('BarChart');
        imports.add('Bar');
        imports.add('XAxis');
        imports.add('YAxis');
        imports.add('CartesianGrid');
        imports.add('Tooltip');
        imports.add('Legend');
        imports.add('ResponsiveContainer');
        break;
      case 'area-chart':
        imports.add('AreaChart');
        imports.add('Area');
        imports.add('XAxis');
        imports.add('YAxis');
        imports.add('CartesianGrid');
        imports.add('Tooltip');
        imports.add('Legend');
        imports.add('ResponsiveContainer');
        break;
      case 'pie-chart':
        imports.add('PieChart');
        imports.add('Pie');
        imports.add('Cell');
        imports.add('Tooltip');
        imports.add('ResponsiveContainer');
        break;
      case 'funnel-chart':
        imports.add('FunnelChart');
        imports.add('Funnel');
        imports.add('LabelList');
        imports.add('Tooltip');
        imports.add('ResponsiveContainer');
        break;
    }
    
    return Array.from(imports);
  };