import React from 'react';

const CodeEditor = ({ code, onCodeChange, onTest, error }) => {
  const sampleCode = `import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts';

// Mock data for charts
const barChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 }
];

const MyDashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  return (
    <div className="dashboard-container p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Generated Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generated from Dashboard Builder
          </p>
        </div>
        
        {/* Sample Row */}
        <div className="row-container">
          <div className="row-content">
            <div className="widget-container flex-1 w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sample Bar Chart
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;`;

  return (
    <div className="px-4 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Code Editor
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Paste your exported dashboard code here to test it
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onCodeChange(sampleCode)}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Load Sample
              </button>
              
              <button
                onClick={() => onCodeChange('')}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Code Input */}
        <div className="p-6">
          <div className="space-y-4">
            <textarea
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="Paste your exported dashboard code here..."
              className="w-full h-96 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              spellCheck="false"
            />
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {code.length > 0 && (
                  <span>{code.length} characters • {code.split('\\n').length} lines</span>
                )}
              </div>
              
              <button
                onClick={onTest}
                disabled={!code.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          📋 How to use this test app:
        </h3>
        <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
          <li>Go to your Dashboard Builder and create a dashboard</li>
          <li>Export the code using the Export dialog</li>
          <li>Copy the generated code and paste it in the textarea above</li>
          <li>Click "Test Dashboard" to see how it renders</li>
          <li>Switch between light/dark themes using the theme toggle</li>
        </ol>
      </div>
    </div>
  );
};

export default CodeEditor;
