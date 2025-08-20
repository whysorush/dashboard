// src/pages/DashboardBuilder/utils/mockDataTemplates.js

export const generateMockData = (type, config = {}) => {
    switch(type) {
      case 'line-chart':
        return generateTimeSeriesData(config);
      case 'area-chart':
        return generateTimeSeriesData(config);
      case 'bar-chart':
        return generateCategoryData(config);
      case 'pie-chart':
        return generatePieData(config);
      case 'funnel-chart':
        return generateFunnelData(config);
      default:
        return [];
    }
  };
  
  export const getChartDataTemplate = (type) => {
    switch(type) {
      case 'line-chart':
      case 'area-chart':
        return [
          { name: 'Jan', value: 4000, value2: 2400 },
          { name: 'Feb', value: 3000, value2: 2210 },
          { name: 'Mar', value: 5000, value2: 2290 },
          { name: 'Apr', value: 4500, value2: 2000 },
          { name: 'May', value: 6000, value2: 2181 },
          { name: 'Jun', value: 5500, value2: 2500 },
          { name: 'Jul', value: 7000, value2: 2100 },
          { name: 'Aug', value: 6500, value2: 2800 },
          { name: 'Sep', value: 8000, value2: 3000 },
          { name: 'Oct', value: 7500, value2: 3200 },
          { name: 'Nov', value: 9000, value2: 3400 },
          { name: 'Dec', value: 8500, value2: 3100 }
        ];
      
      case 'bar-chart':
        return [
          { name: 'Product A', value: 4000, value2: 2400 },
          { name: 'Product B', value: 3000, value2: 1398 },
          { name: 'Product C', value: 5000, value2: 9800 },
          { name: 'Product D', value: 2780, value2: 3908 },
          { name: 'Product E', value: 1890, value2: 4800 }
        ];
      
      case 'pie-chart':
        return [
          { name: 'Group A', value: 400 },
          { name: 'Group B', value: 300 },
          { name: 'Group C', value: 300 },
          { name: 'Group D', value: 200 }
        ];
      
      case 'funnel-chart':
        return [
          { name: 'Visitors', value: 5000, fill: '#8884d8' },
          { name: 'Leads', value: 3000, fill: '#83a6ed' },
          { name: 'Qualified', value: 1500, fill: '#8dd1e1' },
          { name: 'Opportunities', value: 1000, fill: '#82ca9d' },
          { name: 'Sales', value: 800, fill: '#a4de6c' }
        ];
      
      default:
        return [];
    }
  };
  
  const generateTimeSeriesData = (config = {}) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseValue = config.baseValue || 3000;
    const trend = config.trend || 'random'; // 'random', 'increasing', 'decreasing'
    
    return months.map((month, index) => {
      let value;
      switch(trend) {
        case 'increasing':
          value = baseValue + (index * 500) + Math.random() * 1000;
          break;
        case 'decreasing':
          value = baseValue - (index * 200) + Math.random() * 500;
          break;
        default:
          value = baseValue + Math.random() * 3000;
      }
      
      return {
        name: month,
        value: Math.floor(value),
        value2: Math.floor(value * 0.6 + Math.random() * 500)
      };
    });
  };
  
  const generateCategoryData = (config = {}) => {
    const categories = config.categories || ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
    
    return categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 5000) + 1000,
      value2: Math.floor(Math.random() * 3000) + 800
    }));
  };
  
  const generatePieData = (config = {}) => {
    const segments = config.segments || [
      { name: 'Segment 1', percentage: 35 },
      { name: 'Segment 2', percentage: 25 },
      { name: 'Segment 3', percentage: 20 },
      { name: 'Segment 4', percentage: 15 },
      { name: 'Segment 5', percentage: 5 }
    ];
    
    const total = config.total || 10000;
    
    return segments.map(segment => ({
      name: segment.name,
      value: Math.floor((segment.percentage / 100) * total)
    }));
  };
  
  const generateFunnelData = (config = {}) => {
    const stages = config.stages || [
      { name: 'Awareness', retention: 100 },
      { name: 'Interest', retention: 60 },
      { name: 'Consideration', retention: 30 },
      { name: 'Intent', retention: 20 },
      { name: 'Purchase', retention: 16 }
    ];
    
    const baseValue = config.baseValue || 5000;
    const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
    
    return stages.map((stage, index) => ({
      name: stage.name,
      value: Math.floor((stage.retention / 100) * baseValue),
      fill: colors[index % colors.length]
    }));
  };
  
  // Function to calculate KPIs from data
  export const calculateKPIs = (data, type) => {
    if (!data || data.length === 0) {
      return {
        total: 0,
        average: 0,
        growth: 0,
        min: 0,
        max: 0
      };
    }
    
    const values = data.map(d => d.value || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = Math.floor(total / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Calculate growth (comparing last value to first)
    const growth = values.length > 1 
      ? Math.floor(((values[values.length - 1] - values[0]) / values[0]) * 100)
      : 0;
    
    return {
      total,
      average,
      growth,
      min,
      max,
      count: data.length
    };
  };
  
  // Apply time filters to data
  export const applyTimeFilter = (data, filter) => {
    if (!data || !filter) return data;
    
    switch(filter) {
      case 'last7days':
        return data.slice(-7);
      case 'last30days':
        return data.slice(-30);
      case 'last3months':
        return data.slice(-3);
      case 'last6months':
        return data.slice(-6);
      case 'lastyear':
        return data;
      case 'dod': // Day over Day
        return calculateComparison(data, 1);
      case 'wow': // Week over Week
        return calculateComparison(data, 7);
      case 'mom': // Month over Month
        return calculateComparison(data, 30);
      case 'yoy': // Year over Year
        return calculateComparison(data, 365);
      default:
        return data;
    }
  };
  
  const calculateComparison = (data, period) => {
    if (!data || data.length < period * 2) return data;
    
    const current = data.slice(-period);
    const previous = data.slice(-period * 2, -period);
    
    return current.map((item, index) => ({
      ...item,
      previousValue: previous[index]?.value || 0,
      change: ((item.value - (previous[index]?.value || 0)) / (previous[index]?.value || 1)) * 100
    }));
  };
  
  // Format numbers for display
  export const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Format percentage
  export const formatPercentage = (num) => {
    return num > 0 ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`;
  };