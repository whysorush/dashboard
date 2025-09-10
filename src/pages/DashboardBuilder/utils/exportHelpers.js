// src/pages/DashboardBuilder/utils/exportHelpers.js

/**
 * Download a file with the given content
 * @param {string} content - The file content
 * @param {string} filename - The name of the file to download
 * @param {string} mimeType - The MIME type of the file
 */
export const downloadFile = (
  content,
  filename,
  mimeType = "text/jsx;charset=utf-8"
) => {
  try {
    // Ensure Windows-friendly newlines for downloaded files
    const normalized = content.replace(/\n/g, "\r\n");
    const blob = new Blob([normalized], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Append to body to ensure it works in all browsers
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    return false;
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    // Try using the modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      return successful;
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

/**
 * Generate a timestamp-based filename
 * @param {string} prefix - The filename prefix
 * @param {string} extension - The file extension
 * @returns {string} - The generated filename
 */
export const generateFileName = (prefix = "dashboard", extension = "jsx") => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:\-T]/g, "")
    .split(".")[0];
  return `${prefix}_${timestamp}.${extension}`;
};

/**
 * Format code with proper indentation
 * @param {string} code - The code to format
 * @param {number} indentSize - Number of spaces for indentation
 * @returns {string} - Formatted code
 */
export const formatCode = (code, indentSize = 2) => {
  const lines = code.split("\n");
  let indentLevel = 0;
  const formattedLines = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      formattedLines.push("");
      return;
    }

    // Decrease indent for closing brackets
    if (
      trimmedLine.startsWith("}") ||
      trimmedLine.startsWith("]") ||
      trimmedLine.startsWith(")")
    ) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indented line
    formattedLines.push(" ".repeat(indentLevel * indentSize) + trimmedLine);

    // Increase indent for opening brackets
    if (
      trimmedLine.endsWith("{") ||
      trimmedLine.endsWith("[") ||
      trimmedLine.endsWith("(")
    ) {
      indentLevel++;
    }

    // Handle single-line brackets
    const openCount = (trimmedLine.match(/[{[(]/g) || []).length;
    const closeCount = (trimmedLine.match(/[}\])]/g) || []).length;
    if (openCount > closeCount) {
      indentLevel += openCount - closeCount;
    } else if (closeCount > openCount && !trimmedLine.startsWith("}")) {
      indentLevel = Math.max(0, indentLevel - (closeCount - openCount));
    }
  });

  return formattedLines.join("\n");
};

/**
 * Validate component name
 * @param {string} name - The component name to validate
 * @returns {string} - Valid component name
 */
export const validateComponentName = (name) => {
  // Remove non-alphanumeric characters
  let validName = name.replace(/[^a-zA-Z0-9]/g, "");

  // Ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(validName)) {
    validName = "Component" + validName;
  }

  // Capitalize first letter
  validName = validName.charAt(0).toUpperCase() + validName.slice(1);

  return validName || "Dashboard";
};

/**
 * Generate export options based on widgets
 * @param {Array} widgets - Array of widget configurations
 * @returns {Object} - Export options
 */
export const generateExportOptions = (widgets) => {
  const hasCharts = widgets.some((w) => w.type.includes("chart"));
  const hasKPIs = widgets.some((w) => w.config?.showKPIs);
  const hasFilters = widgets.some((w) => w.config?.showFilters);

  return {
    includeRecharts: hasCharts,
    includeKPIComponents: hasKPIs,
    includeFilterComponents: hasFilters,
    includeMockData: true,
    includeStyles: true,
    includeComments: true,
    includeTypeScript: false, // Can be extended for TypeScript support
  };
};

/**
 * Create a data export file
 * @param {Array} widgets - Array of widget configurations
 * @returns {string} - Mock data file content
 */
export const createDataExportFile = (widgets) => {
  const dataExports = [];

  widgets.forEach((widget, index) => {
    const dataName = `${widget.type.replace("-", "")}Data${index}`;
    dataExports.push(dataName);
  });

  return `// Mock data for dashboard widgets
  import { generateMockData } from './mockDataGenerator';
  
  ${widgets
    .map((widget, index) => {
      const dataName = `${widget.type.replace("-", "")}Data${index}`;
      return `export const ${dataName} = generateMockData('${widget.type}', {
    // Configure your data generation here
    baseValue: 3000,
    trend: 'random'
  });`;
    })
    .join("\n\n")}
  
  // Export all data
  export const mockData = {
    ${dataExports.join(",\n  ")}
  };
  `;
};

/**
 * Estimate the size of the generated code
 * @param {string} code - The generated code
 * @returns {Object} - Size information
 */
export const getCodeStats = (code) => {
  const lines = code.split("\n").length;
  const characters = code.length;
  const sizeInKB = (new Blob([code]).size / 1024).toFixed(2);

  return {
    lines,
    characters,
    sizeInKB,
    estimatedComponents: (code.match(/const.*=.*\(/g) || []).length,
    imports: (code.match(/^import/gm) || []).length,
  };
};

/**
 * Create a README file for the exported dashboard
 * @param {string} componentName - Name of the dashboard component
 * @param {Array} widgets - Array of widget configurations
 * @returns {string} - README content
 */
export const createReadmeFile = (componentName, widgets, options = {}) => {
  const { styleMode = 'tailwind', includeData = 'inline', includeRowLayout = true } = options;
  
  const professionalWidgets = widgets.filter(w => 
    w.type.includes('professional') || 
    ['revenue-kpi', 'orders-kpi', 'customers-kpi', 'gradient-bar-chart', 'smooth-funnel-chart'].includes(w.type)
  );
  
  const dependencies = [
    '- React 18+',
    '- Recharts 2.5+'
  ];
  
  if (styleMode === 'tailwind') {
    dependencies.push('- Tailwind CSS 3+');
  }
  
  if (widgets.some(w => ['revenue-kpi', 'orders-kpi', 'customers-kpi', 'professional-kpi'].includes(w.type))) {
    dependencies.push('- React Icons 4+');
  }
  
  const installCommands = [
    'npm install recharts'
  ];
  
  if (styleMode === 'tailwind') {
    installCommands.push('npm install tailwindcss');
  }
  
  if (widgets.some(w => ['revenue-kpi', 'orders-kpi', 'customers-kpi', 'professional-kpi'].includes(w.type))) {
    installCommands.push('npm install react-icons');
  }
  
  let setupInstructions = '';
  
  if (styleMode === 'tailwind') {
    setupInstructions = `
  ## Setup Instructions
  
  1. Make sure Tailwind CSS is configured in your project
  2. If not already set up, follow the [Tailwind CSS installation guide](https://tailwindcss.com/docs/installation)
  3. Import the component and use it in your React app
  `;
  } else if (styleMode === 'css') {
    setupInstructions = `
  ## Setup Instructions
  
  1. Place the \`dashboard.css\` file in your project
  2. Import the CSS file in your main CSS file or component:
     \`\`\`css
     @import './dashboard.css';
     \`\`\`
  3. Import and use the component in your React app
  `;
  } else {
    setupInstructions = `
  ## Setup Instructions
  
  This component uses inline styles and requires no additional CSS setup.
  Simply import and use the component in your React app.
  `;
  }
  
  return `# ${componentName}
  
  ## Description
  This professional dashboard was generated using the Dashboard Builder tool.
  
  **Features:**
  - ${includeRowLayout ? 'Row-based responsive layout' : 'Grid-based layout'}
  - ${styleMode === 'tailwind' ? 'Tailwind CSS styling' : styleMode === 'inline' ? 'Self-contained inline styles' : 'Separate CSS file'}
  - ${includeData === 'inline' ? 'Embedded mock data' : includeData === 'separate' ? 'Separate data file' : 'No mock data included'}
  - ${professionalWidgets.length} professional widget${professionalWidgets.length !== 1 ? 's' : ''}
  - Interactive time filters and controls
  
  ## Widgets
  ${widgets
    .map((w, i) => {
      const isPro = w.type.includes('professional') || 
        ['revenue-kpi', 'orders-kpi', 'customers-kpi', 'gradient-bar-chart', 'smooth-funnel-chart'].includes(w.type);
      const badge = isPro ? ' 🏆' : '';
      return `- ${w.config?.title || `Widget ${i + 1}`}: ${w.type}${badge}`;
    })
    .join("\n")}
  
  ## Installation
  \`\`\`bash
  ${installCommands.join('\n  ')}
  \`\`\`${setupInstructions}
  
  ## Usage
  \`\`\`jsx
  import ${componentName} from './${componentName}';
  ${styleMode === 'css' ? "import './dashboard.css';" : ''}
  
  function App() {
    return (
      <div>
        <${componentName} />
      </div>
    );
  }
  \`\`\`
  
  ## Customization
  
  ### Data Integration
  - Replace mock data with your API calls
  - Update the \`timeRange\` and \`selectedFilter\` state handlers
  - Modify KPI calculations based on your business logic
  
  ### Styling
  ${styleMode === 'tailwind' ? 
    '- Customize Tailwind classes to match your brand\n  - Modify color schemes in the component\n  - Add custom Tailwind configuration' :
    styleMode === 'inline' ?
    '- Modify the inline styles directly in the component\n  - All styles are self-contained and easy to customize\n  - No external dependencies required' :
    '- Edit the dashboard.css file to customize appearance\n  - All styles are organized in the separate CSS file\n  - Easy to maintain and override'
  }
  
  ### Professional Widgets
  ${professionalWidgets.length > 0 ? 
    professionalWidgets.map(w => `- **${w.config?.title || w.type}**: ${getWidgetDescription(w.type)}`).join('\n  ') :
    'No professional widgets included in this export.'
  }
  
  ## Dependencies
  ${dependencies.join('\n  ')}
  
  ## File Structure
  \`\`\`
  ${componentName}.jsx          # Main dashboard component
  ${includeData === 'separate' ? 'mockData.js             # Mock data file\n  ' : ''}${styleMode === 'css' ? 'dashboard.css           # Styling\n  ' : ''}README.md               # This file
  \`\`\`
  
  ## Support
  This component was generated by Dashboard Builder. For issues or questions:
  - Check that all dependencies are properly installed
  - Ensure your React version is 18 or higher
  - Verify ${styleMode === 'tailwind' ? 'Tailwind CSS is properly configured' : styleMode === 'css' ? 'the CSS file is properly imported' : 'no additional setup is needed'}
  `;
};

const getWidgetDescription = (type) => {
  const descriptions = {
    'revenue-kpi': 'Professional revenue display with growth indicators and formatting',
    'orders-kpi': 'Order metrics with trend analysis and visual indicators', 
    'customers-kpi': 'Customer analytics with growth tracking and professional styling',
    'professional-kpi': 'Customizable KPI card with professional design elements',
    'gradient-bar-chart': 'Bar chart with gradient fills and professional styling',
    'smooth-funnel-chart': 'Smooth funnel visualization with custom styling',
    'professional-table': 'Data table with sorting, filtering, and status indicators',
    'advanced-filter-bar': 'Comprehensive filtering interface with multiple input types'
  };
  
  return descriptions[type] || 'Professional widget component';
};
