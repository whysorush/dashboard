// src/pages/DashboardBuilder/utils/exportHelpers.js

/**
 * Download a file with the given content
 * @param {string} content - The file content
 * @param {string} filename - The name of the file to download
 * @param {string} mimeType - The MIME type of the file
 */
export const downloadFile = (content, filename, mimeType = 'text/javascript') => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
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
      console.error('Error downloading file:', error);
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
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return successful;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };
  
  /**
   * Generate a timestamp-based filename
   * @param {string} prefix - The filename prefix
   * @param {string} extension - The file extension
   * @returns {string} - The generated filename
   */
  export const generateFileName = (prefix = 'dashboard', extension = 'jsx') => {
    const timestamp = new Date().toISOString()
      .replace(/[:\-T]/g, '')
      .split('.')[0];
    return `${prefix}_${timestamp}.${extension}`;
  };
  
  /**
   * Format code with proper indentation
   * @param {string} code - The code to format
   * @param {number} indentSize - Number of spaces for indentation
   * @returns {string} - Formatted code
   */
  export const formatCode = (code, indentSize = 2) => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const formattedLines = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        formattedLines.push('');
        return;
      }
      
      // Decrease indent for closing brackets
      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']') || trimmedLine.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add indented line
      formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
      
      // Increase indent for opening brackets
      if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[') || trimmedLine.endsWith('(')) {
        indentLevel++;
      }
      
      // Handle single-line brackets
      const openCount = (trimmedLine.match(/[{[(]/g) || []).length;
      const closeCount = (trimmedLine.match(/[}\])]/g) || []).length;
      if (openCount > closeCount) {
        indentLevel += openCount - closeCount;
      } else if (closeCount > openCount && !trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - (closeCount - openCount));
      }
    });
    
    return formattedLines.join('\n');
  };
  
  /**
   * Validate component name
   * @param {string} name - The component name to validate
   * @returns {string} - Valid component name
   */
  export const validateComponentName = (name) => {
    // Remove non-alphanumeric characters
    let validName = name.replace(/[^a-zA-Z0-9]/g, '');
    
    // Ensure it starts with a letter
    if (!/^[a-zA-Z]/.test(validName)) {
      validName = 'Component' + validName;
    }
    
    // Capitalize first letter
    validName = validName.charAt(0).toUpperCase() + validName.slice(1);
    
    return validName || 'Dashboard';
  };
  
  /**
   * Generate export options based on widgets
   * @param {Array} widgets - Array of widget configurations
   * @returns {Object} - Export options
   */
  export const generateExportOptions = (widgets) => {
    const hasCharts = widgets.some(w => w.type.includes('chart'));
    const hasKPIs = widgets.some(w => w.config?.showKPIs);
    const hasFilters = widgets.some(w => w.config?.showFilters);
    
    return {
      includeRecharts: hasCharts,
      includeKPIComponents: hasKPIs,
      includeFilterComponents: hasFilters,
      includeMockData: true,
      includeStyles: true,
      includeComments: true,
      includeTypeScript: false // Can be extended for TypeScript support
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
      const dataName = `${widget.type.replace('-', '')}Data${index}`;
      dataExports.push(dataName);
    });
    
    return `// Mock data for dashboard widgets
  import { generateMockData } from './mockDataGenerator';
  
  ${widgets.map((widget, index) => {
    const dataName = `${widget.type.replace('-', '')}Data${index}`;
    return `export const ${dataName} = generateMockData('${widget.type}', {
    // Configure your data generation here
    baseValue: 3000,
    trend: 'random'
  });`;
  }).join('\n\n')}
  
  // Export all data
  export const mockData = {
    ${dataExports.join(',\n  ')}
  };
  `;
  };
  
  /**
   * Estimate the size of the generated code
   * @param {string} code - The generated code
   * @returns {Object} - Size information
   */
  export const getCodeStats = (code) => {
    const lines = code.split('\n').length;
    const characters = code.length;
    const sizeInKB = (new Blob([code]).size / 1024).toFixed(2);
    
    return {
      lines,
      characters,
      sizeInKB,
      estimatedComponents: (code.match(/const.*=.*\(/g) || []).length,
      imports: (code.match(/^import/gm) || []).length
    };
  };
  
  /**
   * Create a README file for the exported dashboard
   * @param {string} componentName - Name of the dashboard component
   * @param {Array} widgets - Array of widget configurations
   * @returns {string} - README content
   */
  export const createReadmeFile = (componentName, widgets) => {
    return `# ${componentName}
  
  ## Description
  This dashboard was generated using the Dashboard Builder tool.
  
  ## Widgets
  ${widgets.map((w, i) => `- ${w.config?.title || `Widget ${i + 1}`}: ${w.type}`).join('\n')}
  
  ## Installation
  \`\`\`bash
  npm install recharts
  \`\`\`
  
  ## Usage
  \`\`\`jsx
  import ${componentName} from './${componentName}';
  
  function App() {
    return <${componentName} />;
  }
  \`\`\`
  
  ## Customization
  - Modify the mock data in the component
  - Adjust chart colors and styles
  - Connect to your real data source
  - Customize KPI calculations
  
  ## Dependencies
  - React 18+
  - Recharts 2.5+
  - Tailwind CSS 3+
  `;
  };