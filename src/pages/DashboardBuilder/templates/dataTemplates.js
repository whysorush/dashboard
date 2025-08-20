// src/pages/DashboardBuilder/templates/dataTemplates.js

export const getDataTemplate = (widgetType, variableName) => {
    switch (widgetType) {
      case 'line-chart':
      case 'area-chart':
        return getTimeSeriesDataTemplate(variableName);
      case 'bar-chart':
        return getCategoryDataTemplate(variableName);
      case 'pie-chart':
        return getPieDataTemplate(variableName);
      case 'funnel-chart':
        return getFunnelDataTemplate(variableName);
      case 'kpi-card':
        return getKPIDataTemplate(variableName);
      case 'data-table':
        return getTableDataTemplate(variableName);
      default:
        return `const ${variableName} = [];`;
    }
  };
  
  const getTimeSeriesDataTemplate = (variableName) => {
    return `const ${variableName} = [
    { name: 'Jan', value: 4000, previousValue: 3800 },
    { name: 'Feb', value: 3000, previousValue: 3200 },
    { name: 'Mar', value: 5000, previousValue: 4500 },
    { name: 'Apr', value: 4500, previousValue: 4200 },
    { name: 'May', value: 6000, previousValue: 5500 },
    { name: 'Jun', value: 5500, previousValue: 5800 },
    { name: 'Jul', value: 7000, previousValue: 6500 },
    { name: 'Aug', value: 6500, previousValue: 6800 },
    { name: 'Sep', value: 8000, previousValue: 7200 },
    { name: 'Oct', value: 7500, previousValue: 7800 },
    { name: 'Nov', value: 9000, previousValue: 8500 },
    { name: 'Dec', value: 8500, previousValue: 8200 }
  ];`;
  };
  
  const getCategoryDataTemplate = (variableName) => {
    return `const ${variableName} = [
    { name: 'Product A', value: 4000, target: 4500 },
    { name: 'Product B', value: 3000, target: 3500 },
    { name: 'Product C', value: 5000, target: 4800 },
    { name: 'Product D', value: 2780, target: 3000 },
    { name: 'Product E', value: 1890, target: 2000 }
  ];`;
  };
  
  const getPieDataTemplate = (variableName) => {
    return `const ${variableName} = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 100 }
  ];`;
  };
  
  const getFunnelDataTemplate = (variableName) => {
    return `const ${variableName} = [
    { name: 'Visitors', value: 5000 },
    { name: 'Leads', value: 3000 },
    { name: 'Qualified', value: 1500 },
    { name: 'Opportunities', value: 800 },
    { name: 'Won', value: 400 }
  ];`;
  };
  
  const getKPIDataTemplate = (variableName) => {
    return `const ${variableName} = {
    currentValue: 42567,
    previousValue: 38234,
    target: 45000,
    change: 11.3,
    trend: 'up'
  };`;
  };
  
  const getTableDataTemplate = (variableName) => {
    return `const ${variableName} = [
    { id: 1, name: 'Item 1', category: 'Category A', value: 1234, status: 'active' },
    { id: 2, name: 'Item 2', category: 'Category B', value: 2345, status: 'active' },
    { id: 3, name: 'Item 3', category: 'Category A', value: 3456, status: 'inactive' },
    { id: 4, name: 'Item 4', category: 'Category C', value: 4567, status: 'active' },
    { id: 5, name: 'Item 5', category: 'Category B', value: 5678, status: 'pending' }
  ];`;
  };
  
  export const getChartDataByTimeRange = (timeRange) => {
    switch (timeRange) {
      case 'daily':
        return [
          { name: 'Mon', value: 4000 },
          { name: 'Tue', value: 3000 },
          { name: 'Wed', value: 5000 },
          { name: 'Thu', value: 4500 },
          { name: 'Fri', value: 6000 },
          { name: 'Sat', value: 5500 },
          { name: 'Sun', value: 4000 }
        ];
      case 'weekly':
        return [
          { name: 'Week 1', value: 28000 },
          { name: 'Week 2', value: 32000 },
          { name: 'Week 3', value: 35000 },
          { name: 'Week 4', value: 30000 }
        ];
      case 'monthly':
        return [
          { name: 'Jan', value: 65000 },
          { name: 'Feb', value: 59000 },
          { name: 'Mar', value: 80000 },
          { name: 'Apr', value: 81000 },
          { name: 'May', value: 56000 },
          { name: 'Jun', value: 55000 },
          { name: 'Jul', value: 72000 },
          { name: 'Aug', value: 68000 },
          { name: 'Sep', value: 74000 },
          { name: 'Oct', value: 77000 },
          { name: 'Nov', value: 82000 },
          { name: 'Dec', value: 87000 }
        ];
      case 'quarterly':
        return [
          { name: 'Q1', value: 204000 },
          { name: 'Q2', value: 192000 },
          { name: 'Q3', value: 214000 },
          { name: 'Q4', value: 246000 }
        ];
      case 'yearly':
        return [
          { name: '2020', value: 750000 },
          { name: '2021', value: 820000 },
          { name: '2022', value: 880000 },
          { name: '2023', value: 920000 },
          { name: '2024', value: 980000 }
        ];
      default:
        return [];
    }
  };
  
  export const generateMockDataCode = (widgets) => {
    const dataSets = [];
    const usedNames = new Set();
    
    widgets.forEach((widget, index) => {
      let dataName = `${widget.type.replace('-', '')}Data`;
      
      // Ensure unique variable names
      if (usedNames.has(dataName)) {
        dataName = `${dataName}${index}`;
      }
      usedNames.add(dataName);
      
      const dataTemplate = getDataTemplate(widget.type, dataName);
      dataSets.push(dataTemplate);
    });
    
    return dataSets.join('\n\n');
  };
  
  export const getHelperFunctions = () => {
    return `
  // Helper functions
  const formatNumber = (value, format = 'number') => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return \`\${value.toFixed(1)}%\`;
      case 'abbreviated':
        if (value >= 1000000) {
          return \`\${(value / 1000000).toFixed(1)}M\`;
        } else if (value >= 1000) {
          return \`\${(value / 1000).toFixed(1)}K\`;
        }
        return value.toString();
      default:
        return value.toLocaleString();
    }
  };
  
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };
  `.trim();
  };