// src/pages/DashboardBuilder/utils/mockDataGenerator.js

export const generateMockData = (type, config = {}) => {
    switch (type) {
      case 'time-series':
        return generateTimeSeriesData(config);
      case 'categories':
        return generateCategoryData(config);
      case 'pie':
        return generatePieData(config);
      case 'funnel':
        return generateFunnelData(config);
      default:
        return [];
    }
  };
  
  const generateTimeSeriesData = (config) => {
    const { points = 12, trend = 'random', baseValue = 5000 } = config;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    for (let i = 0; i < points; i++) {
      let value;
      
      switch (trend) {
        case 'increasing':
          value = baseValue + (i * 500) + Math.random() * 1000;
          break;
        case 'decreasing':
          value = baseValue - (i * 300) + Math.random() * 500;
          break;
        case 'seasonal':
          value = baseValue + Math.sin(i / 2) * 2000 + Math.random() * 500;
          break;
        default:
          value = baseValue + Math.random() * 3000 - 1500;
      }
      
      data.push({
        name: months[i % 12],
        value: Math.floor(Math.max(0, value)),
        previousValue: Math.floor(Math.max(0, value * 0.9 + Math.random() * value * 0.2))
      });
    }
    
    return data;
  };
  
  const generateCategoryData = (config) => {
    const { categories = 5, includeComparison = false } = config;
    const categoryNames = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E', 
                          'Category F', 'Category G', 'Category H'];
    const data = [];
    
    for (let i = 0; i < Math.min(categories, categoryNames.length); i++) {
      const value = Math.floor(Math.random() * 10000) + 1000;
      data.push({
        name: categoryNames[i],
        value,
        value2: includeComparison ? Math.floor(value * 0.8 + Math.random() * value * 0.4) : undefined
      });
    }
    
    return data;
  };
  
  const generatePieData = (config) => {
    const { segments = 5 } = config;
    const segmentNames = ['Segment A', 'Segment B', 'Segment C', 'Segment D', 'Segment E'];
    const data = [];
    let remaining = 100;
    
    for (let i = 0; i < Math.min(segments - 1, segmentNames.length); i++) {
      const value = Math.floor(Math.random() * remaining * 0.6) + 10;
      remaining -= value;
      data.push({
        name: segmentNames[i],
        value: value * 100 // Scale up for display
      });
    }
    
    // Add last segment with remaining value
    data.push({
      name: segmentNames[segments - 1],
      value: remaining * 100
    });
    
    return data;
  };
  
  const generateFunnelData = (config) => {
    const { stages = 5 } = config;
    const stageNames = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase'];
    const data = [];
    let currentValue = 10000;
    
    for (let i = 0; i < Math.min(stages, stageNames.length); i++) {
      data.push({
        name: stageNames[i],
        value: Math.floor(currentValue)
      });
      currentValue *= 0.6 + Math.random() * 0.2; // 60-80% conversion between stages
    }
    
    return data;
  };
  
  export const calculateKPIs = (data, config = {}) => {
    if (!data || data.length === 0) {
      return {
        total: { value: 0, label: 'Total' },
        average: { value: 0, label: 'Average' },
        growth: { value: 0, label: 'Growth' },
        max: { value: 0, label: 'Max' },
        min: { value: 0, label: 'Min' }
      };
    }
    
    const values = data.map(d => d.value || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Calculate growth (comparing last value to first)
    const growth = values.length > 1 
      ? ((values[values.length - 1] - values[0]) / values[0]) * 100
      : 0;
    
    // Calculate trend (simplified)
    const trend = values.length > 1
      ? values[values.length - 1] > values[0] ? 'up' : 'down'
      : 'neutral';
    
    return {
      total: {
        value: total,
        label: 'Total',
        comparison: 12.5 // Mock comparison
      },
      average: {
        value: Math.floor(average),
        label: 'Average',
        comparison: -3.2
      },
      growth: {
        value: growth,
        label: 'Growth',
        comparison: growth
      },
      max: {
        value: max,
        label: 'Maximum'
      },
      min: {
        value: min,
        label: 'Minimum'
      },
      trend: {
        value: trend,
        label: 'Trend'
      },
      count: {
        value: data.length,
        label: 'Count'
      }
    };
  };
  
  export const applyTimeFilter = (data, filter) => {
    if (!data || !filter) return data;
    
    switch (filter) {
      case 'daily':
        return data.slice(-7);
      case 'weekly':
        return data.slice(-4);
      case 'monthly':
        return data;
      case 'quarterly':
        return data.filter((_, i) => i % 3 === 0);
      case 'yearly':
        return data.filter((_, i) => i % 12 === 0);
      default:
        return data;
    }
  };
  
  export const formatNumber = (num, format = 'number') => {
    if (num === null || num === undefined) return '—';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(num);
      case 'percentage':
        return `${num.toFixed(1)}%`;
      case 'abbreviated':
        if (num >= 1000000) {
          return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
          return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
      default:
        return num.toLocaleString();
    }
  };