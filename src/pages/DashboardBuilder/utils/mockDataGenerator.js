// src/pages/DashboardBuilder/utils/mockDataGenerator.js

// Generate mock data for charts
export const generateMockData = (type, options = {}) => {
  switch (type) {
    case "time-series":
      return generateTimeSeriesData(options);
    case "categories":
      return generateCategoryData(options);
    case "pie":
      return generatePieData(options);
    case "funnel":
      return generateFunnelData(options);
    default:
      return [];
  }
};

// Generate time series data (for line/area charts)
const generateTimeSeriesData = (options) => {
  const {
    points = 12,
    trend = "up",
    timeRange = "monthly",
    includeComparison = false,
  } = options;

  const data = [];
  const baseValue = 1000 + Math.random() * 2000;
  const volatility = 0.2;
  let currentValue = baseValue;

  // Generate time labels based on timeRange
  const getTimeLabel = (index) => {
    switch (timeRange) {
      case "daily":
        const date = new Date();
        date.setDate(date.getDate() - (points - index - 1));
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "weekly":
        const weekDate = new Date();
        weekDate.setDate(weekDate.getDate() - (points - index - 1) * 7);
        return `Week ${index + 1}`;
      case "monthly":
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const currentMonth = new Date().getMonth();
        return months[(currentMonth - (points - index - 1)) % 12];
      case "quarterly":
        return `Q${(index % 4) + 1}`;
      case "yearly":
        const currentYear = new Date().getFullYear();
        return `${currentYear - (points - index - 1)}`;
      default:
        return `Point ${index + 1}`;
    }
  };

  for (let i = 0; i < points; i++) {
    // Apply trend direction
    let change;
    switch (trend) {
      case "up":
        change = Math.random() * volatility * baseValue;
        currentValue = i === 0 ? baseValue : data[i - 1].value + change;
        break;
      case "down":
        change = Math.random() * volatility * baseValue;
        currentValue = i === 0 ? baseValue : data[i - 1].value - change;
        break;
      case "stable":
        change = (Math.random() * volatility - volatility / 2) * baseValue;
        currentValue = i === 0 ? baseValue : data[i - 1].value + change;
        break;
      case "volatile":
        change = (Math.random() * volatility * 2 - volatility) * baseValue;
        currentValue = i === 0 ? baseValue : data[i - 1].value + change;
        break;
      default:
        change = (Math.random() * volatility * 2 - volatility) * baseValue;
        currentValue = i === 0 ? baseValue : data[i - 1].value + change;
    }

    // Ensure value is positive
    currentValue = Math.max(currentValue, baseValue * 0.1);

    const dataPoint = {
      name: getTimeLabel(i),
      value: Math.round(currentValue),
    };

    // Add comparison data if requested
    if (includeComparison) {
      dataPoint.previousValue = Math.round(
        currentValue * (0.7 + Math.random() * 0.6)
      );
    }

    data.push(dataPoint);
  }

  return data;
};

// Generate category data (for bar charts)
const generateCategoryData = (options) => {
  const {
    categories = 5,
    includeComparison = false,
    timeRange = "monthly",
    trend = "random",
  } = options;

  const data = [];
  const baseValue = 1000 + Math.random() * 2000;

  const categoryNames = getCategoryNames(categories, timeRange);

  for (let i = 0; i < categories; i++) {
    let value;

    switch (trend) {
      case "up":
        value = baseValue * (0.5 + (i / categories) * 1.5);
        break;
      case "down":
        value = baseValue * (2 - (i / categories) * 1.5);
        break;
      case "bell":
        value = baseValue * (0.5 + Math.sin((i / categories) * Math.PI) * 1.5);
        break;
      case "random":
      default:
        value = baseValue * (0.2 + Math.random() * 1.8);
    }

    const dataPoint = {
      name: categoryNames[i],
      value: Math.round(value),
    };

    // Add secondary value for stacked charts
    dataPoint.value2 = Math.round(value * (0.2 + Math.random() * 0.3));

    // Add comparison data if requested
    if (includeComparison) {
      dataPoint.previousValue = Math.round(value * (0.7 + Math.random() * 0.6));
    }

    data.push(dataPoint);
  }

  return data;
};

// Generate pie chart data
const generatePieData = (options) => {
  const { segments = 5 } = options;

  const data = [];
  const total = 100;
  let remaining = total;

  const categoryNames = getCategoryNames(segments);

  for (let i = 0; i < segments; i++) {
    const isLast = i === segments - 1;
    const value = isLast
      ? remaining
      : Math.round(remaining * (0.1 + Math.random() * 0.5));

    data.push({
      name: categoryNames[i],
      value: value,
    });

    remaining -= value;
  }

  return data;
};

// Generate funnel data
const generateFunnelData = (options) => {
  const { stages = 4 } = options;

  const data = [];
  let currentValue = 1000 + Math.random() * 2000;

  const stageNames = [
    "Visitors",
    "Leads",
    "Opportunities",
    "Proposals",
    "Negotiations",
    "Closed",
  ].slice(0, stages);

  for (let i = 0; i < stages; i++) {
    data.push({
      name: stageNames[i],
      value: Math.round(currentValue),
    });

    // Each stage drops by 20-50%
    currentValue = currentValue * (0.5 - Math.random() * 0.3);
  }

  return data;
};

// Helper to get category names
const getCategoryNames = (count, type = "category") => {
  if (type === "monthly") {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.slice(0, count);
  }

  const categories = {
    products: [
      "Laptops",
      "Phones",
      "Tablets",
      "Monitors",
      "Accessories",
      "Software",
      "Services",
      "Storage",
    ],
    regions: [
      "North",
      "South",
      "East",
      "West",
      "Central",
      "International",
      "Online",
      "Partners",
    ],
    departments: [
      "Sales",
      "Marketing",
      "Engineering",
      "Support",
      "Operations",
      "Finance",
      "HR",
      "Legal",
    ],
    segments: [
      "Enterprise",
      "SMB",
      "Consumer",
      "Government",
      "Education",
      "Healthcare",
      "Retail",
      "Technology",
    ],
  };

  // Pick a random category type
  const categoryType =
    Object.keys(categories)[
      Math.floor(Math.random() * Object.keys(categories).length)
    ];
  return categories[categoryType].slice(0, count);
};

// Calculate KPIs from data
export const calculateKPIs = (data, config) => {
  if (!data || data.length === 0) return [];

  const values = data.map((d) => d.value);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calculate growth (last value vs first value)
  const growth =
    data.length > 1
      ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
      : 0;

  const kpis = [];

  // Only include requested KPI metrics
  const metrics = config?.kpiMetrics || ["total", "average", "growth"];

  if (metrics.includes("total")) {
    kpis.push({
      label: "Total",
      value: total,
      format: config?.numberFormat || "number",
      icon: "📊",
    });
  }

  if (metrics.includes("average")) {
    kpis.push({
      label: "Average",
      value: average,
      format: config?.numberFormat || "number",
      icon: "📈",
    });
  }

  if (metrics.includes("growth")) {
    kpis.push({
      label: "Growth",
      value: growth,
      format: "percentage",
      icon: growth >= 0 ? "📈" : "📉",
    });
  }

  if (metrics.includes("min")) {
    kpis.push({
      label: "Min",
      value: min,
      format: config?.numberFormat || "number",
      icon: "⬇️",
    });
  }

  if (metrics.includes("max")) {
    kpis.push({
      label: "Max",
      value: max,
      format: config?.numberFormat || "number",
      icon: "⬆️",
    });
  }

  return kpis;
};
