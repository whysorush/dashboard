import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  AreaChart, Area, ScatterChart, Scatter, RadialBarChart, RadialBar,
  ComposedChart, ReferenceLine, ReferenceArea, ReferenceDot, Brush
} from 'recharts';

const TestDashboard = ({ code, onError }) => {
  const [DashboardComponent, setDashboardComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testCode = () => {
      setLoading(true);
      setDashboardComponent(null);
      onError('');

      try {
        // Process the code to make it work
        const processedCode = processCode(code);
        
        // Make React and Recharts available globally temporarily
        const originalReact = window.React;
        const originalRecharts = window.Recharts;
        
        window.React = React;
        window.Recharts = {
          BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
          LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
          AreaChart, Area, ScatterChart, Scatter, RadialBarChart, RadialBar,
          ComposedChart, ReferenceLine, ReferenceArea, ReferenceDot, Brush
        };
        
        // Create a function that executes the processed code
        const createComponent = Function(
          'React',
          'useState',
          'BarChart', 'Bar', 'XAxis', 'YAxis', 'CartesianGrid', 'Tooltip', 'Legend', 'ResponsiveContainer',
          'LineChart', 'Line', 'PieChart', 'Pie', 'Cell', 'FunnelChart', 'Funnel', 'LabelList',
          'AreaChart', 'Area', 'ScatterChart', 'Scatter', 'RadialBarChart', 'RadialBar',
          'ComposedChart', 'ReferenceLine', 'ReferenceArea', 'ReferenceDot', 'Brush',
          `
            ${processedCode}
            
            // Try to find the component
            if (typeof MyDashboard !== 'undefined') return MyDashboard;
            if (typeof Dashboard !== 'undefined') return Dashboard;
            if (typeof GeneratedDashboard !== 'undefined') return GeneratedDashboard;
            
            // Look for any function that looks like a component
            const funcNames = Object.getOwnPropertyNames(this).filter(name => 
              name[0] === name[0].toUpperCase() && typeof this[name] === 'function'
            );
            if (funcNames.length > 0) return this[funcNames[0]];
            
            return null;
          `
        );
        
        // Execute the function
        const Component = createComponent(
          React, useState,
          BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
          LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
          AreaChart, Area, ScatterChart, Scatter, RadialBarChart, RadialBar,
          ComposedChart, ReferenceLine, ReferenceArea, ReferenceDot, Brush
        );
        
        // Restore global variables
        if (originalReact) {
          window.React = originalReact;
        } else {
          delete window.React;
        }
        if (originalRecharts) {
          window.Recharts = originalRecharts;
        } else {
          delete window.Recharts;
        }
        
        if (Component) {
          setDashboardComponent(() => Component);
        } else {
          throw new Error('No valid dashboard component found in the provided code');
        }
      } catch (error) {
        console.error('Error loading dashboard component:', error);
        onError(`Error loading component: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (code.trim()) {
      testCode();
    } else {
      setLoading(false);
    }
  }, [code, onError]);

  // Extract component name from code
  const extractComponentName = (code) => {
    const match = code.match(/(?:const|function)\s+(\w+)\s*(?:=|{)/);
    return match ? match[1] : 'Dashboard';
  };

  // Process the code to make it work as a module
  const processCode = (originalCode) => {
    // Remove import statements and export default
    let processedCode = originalCode
      .replace(/import\s+React[^;]*;?\s*/g, '')
      .replace(/import\s+\{[^}]*\}\s+from\s+['"]react['"];?\s*/g, '')
      .replace(/import\s+\{[^}]*\}\s+from\s+['"]recharts['"];?\s*/g, '')
      .replace(/import\s+\{[^}]*\}\s+from\s+['"]react-icons[^'"]*['"];?\s*/g, '')
      .replace(/export\s+default\s+[\w\s]+;?\s*$/gm, '');

    // Convert arrow functions to regular functions for easier evaluation
    processedCode = processedCode
      .replace(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*\{/g, 'function $1() {')
      .replace(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*\(/g, 'function $1() { return (');
    
    // Handle cases where the arrow function returns JSX directly (without parentheses)
    processedCode = processedCode.replace(
      /const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*(<[^;]+;?\s*)$/gm,
      'function $1() { return $2 }'
    );

    // If the function ends with ); add a closing brace
    processedCode = processedCode.replace(/\);\s*$/g, '); }');

    return processedCode;
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!DashboardComponent) {
    return (
      <div className="px-4 sm:px-0">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Failed to load dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              There was an error processing your code. Please check the code and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Dashboard Preview Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-t-lg border border-gray-200 dark:border-gray-700 border-b-0 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Dashboard Preview
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your exported dashboard component rendered live
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
        <div className="p-1">
          <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ErrorBoundary onError={onError}>
              <DashboardComponent />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-green-900 dark:text-green-200">
              Dashboard loaded successfully!
            </h3>
            <p className="text-sm text-green-800 dark:text-green-300 mt-1">
              Your exported code is working correctly. This is exactly how it will look when used in other projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
    this.props.onError(`Runtime error: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Dashboard Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The dashboard component encountered an error while rendering.
          </p>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
              Error details
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-red-600 dark:text-red-400 overflow-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TestDashboard;
