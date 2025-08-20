// src/pages/DashboardBuilder/utils/propertyValidation.js

export const validateWidgetTitle = (title) => {
    if (!title) {
      return { valid: false, error: 'Title is required' };
    }
    if (title.length > 50) {
      return { valid: false, error: 'Title must be less than 50 characters' };
    }
    return { valid: true };
  };
  
  export const validateWidgetSize = (w, h, gridCols = 12) => {
    const errors = [];
    
    if (w < 1 || w > gridCols) {
      errors.push(`Width must be between 1 and ${gridCols}`);
    }
    if (h < 1 || h > 10) {
      errors.push('Height must be between 1 and 10');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  export const validatePosition = (x, y, w, h, gridCols = 12) => {
    const errors = [];
    
    if (x < 0 || x >= gridCols) {
      errors.push(`X position must be between 0 and ${gridCols - 1}`);
    }
    if (y < 0) {
      errors.push('Y position must be positive');
    }
    if (x + w > gridCols) {
      errors.push('Widget extends beyond grid boundaries');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  export const validateDataPoints = (points) => {
    if (points < 5 || points > 50) {
      return { valid: false, error: 'Data points must be between 5 and 50' };
    }
    return { valid: true };
  };
  
  export const validateRefreshInterval = (interval) => {
    const validIntervals = [0, 5000, 10000, 30000, 60000, 300000];
    if (!validIntervals.includes(interval)) {
      return { valid: false, error: 'Invalid refresh interval' };
    }
    return { valid: true };
  };
  
  export const validateColor = (color) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
      return { valid: false, error: 'Invalid color format' };
    }
    return { valid: true };
  };
  
  export const validateNumberFormat = (format) => {
    const validFormats = ['number', 'currency', 'percentage', 'abbreviated'];
    if (!validFormats.includes(format)) {
      return { valid: false, error: 'Invalid number format' };
    }
    return { valid: true };
  };
  
  export const validateDecimalPlaces = (places) => {
    if (places < 0 || places > 4) {
      return { valid: false, error: 'Decimal places must be between 0 and 4' };
    }
    return { valid: true };
  };
  
  export const validateWidgetConfig = (config) => {
    const errors = {};
    
    if (config.title) {
      const titleValidation = validateWidgetTitle(config.title);
      if (!titleValidation.valid) {
        errors.title = titleValidation.error;
      }
    }
    
    if (config.dataPoints !== undefined) {
      const dataPointsValidation = validateDataPoints(config.dataPoints);
      if (!dataPointsValidation.valid) {
        errors.dataPoints = dataPointsValidation.error;
      }
    }
    
    if (config.refreshInterval !== undefined) {
      const intervalValidation = validateRefreshInterval(config.refreshInterval);
      if (!intervalValidation.valid) {
        errors.refreshInterval = intervalValidation.error;
      }
    }
    
    if (config.color) {
      const colorValidation = validateColor(config.color);
      if (!colorValidation.valid) {
        errors.color = colorValidation.error;
      }
    }
    
    if (config.numberFormat) {
      const formatValidation = validateNumberFormat(config.numberFormat);
      if (!formatValidation.valid) {
        errors.numberFormat = formatValidation.error;
      }
    }
    
    if (config.decimalPlaces !== undefined) {
      const decimalValidation = validateDecimalPlaces(config.decimalPlaces);
      if (!decimalValidation.valid) {
        errors.decimalPlaces = decimalValidation.error;
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const sanitizeWidgetConfig = (config) => {
    const sanitized = { ...config };
    
    // Sanitize title
    if (sanitized.title) {
      sanitized.title = sanitized.title.trim().substring(0, 50);
    }
    
    // Ensure valid number ranges
    if (sanitized.dataPoints !== undefined) {
      sanitized.dataPoints = Math.max(5, Math.min(50, sanitized.dataPoints));
    }
    
    if (sanitized.decimalPlaces !== undefined) {
      sanitized.decimalPlaces = Math.max(0, Math.min(4, sanitized.decimalPlaces));
    }
    
    // Ensure valid selections
    if (sanitized.numberFormat && !['number', 'currency', 'percentage', 'abbreviated'].includes(sanitized.numberFormat)) {
      sanitized.numberFormat = 'number';
    }
    
    if (sanitized.aggregation && !['sum', 'average', 'count', 'min', 'max'].includes(sanitized.aggregation)) {
      sanitized.aggregation = 'sum';
    }
    
    if (sanitized.timeRange && !['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].includes(sanitized.timeRange)) {
      sanitized.timeRange = 'monthly';
    }
    
    return sanitized;
  };