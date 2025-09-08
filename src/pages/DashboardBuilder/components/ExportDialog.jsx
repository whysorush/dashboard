// src/pages/DashboardBuilder/components/ExportDialog.jsx
import React, { useState, useMemo } from 'react';
import { FiCode, FiCopy, FiDownload, FiCheck, FiX, FiFileText } from 'react-icons/fi';
import { generateDashboardCode } from '../utils/codeGenerator';
import { downloadFile, createDataExportFile, createReadmeFile } from '../utils/exportHelpers';

const ExportDialog = ({ widgets, isOpen, onClose }) => {
  const [componentName, setComponentName] = useState('MyDashboard');
  const [includeData, setIncludeData] = useState('inline');
  const [includeStyles, setIncludeStyles] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [exportMode, setExportMode] = useState('single'); // 'single' | 'multiple'
  
  const code = useMemo(() => {
    if (!isOpen || !widgets.length) return '';
    // For single-file export, force inline data unless explicitly set to none
    const effectiveIncludeData = exportMode === 'single' && includeData !== 'none' ? 'inline' : includeData;
    return generateDashboardCode(widgets, componentName, {
      includeData: effectiveIncludeData,
      includeStyles
    });
  }, [widgets, componentName, includeData, includeStyles, isOpen, exportMode]);
  
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownload = () => {
    // Single-file mode: download only the component file
    if (exportMode === 'single') {
      downloadFile(code, `${componentName}.jsx`, 'text/jsx;charset=utf-8');
      return;
    }

    // Multiple-files mode
    const filesToExport = [
      { name: `${componentName}.jsx`, content: code, mime: 'text/jsx;charset=utf-8' }
    ];

    if (includeData === 'separate') {
      const dataFileContent = createDataExportFile(widgets);
      filesToExport.push({ name: 'mockData.js', content: dataFileContent, mime: 'text/javascript;charset=utf-8' });
    }

    const readmeContent = createReadmeFile(componentName, widgets);
    filesToExport.push({ name: 'README.md', content: readmeContent, mime: 'text/markdown;charset=utf-8' });

    filesToExport.forEach((f) => downloadFile(f.content, f.name, f.mime));
  };

  const handleComponentNameChange = (e) => {
    // Remove non-alphanumeric characters and ensure it starts with a letter
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
    setComponentName(formatted || 'MyDashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiCode /> Export Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Component Name
              </label>
              <input
                type="text"
                value={componentName}
                onChange={handleComponentNameChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MyDashboard"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <select
                value={includeData}
                onChange={(e) => setIncludeData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="inline">Include inline</option>
                <option value="separate">Separate file</option>
                <option value="none">No mock data</option>
              </select>
              {exportMode === 'single' && includeData === 'separate' && (
                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                  Single file export forces inline data. "Separate file" will be ignored.
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Export Type
              </label>
              <select
                value={exportMode}
                onChange={(e) => setExportMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="single">Single file (.jsx)</option>
                <option value="multiple">Multiple files (.jsx, README, mockData)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Options
              </label>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={includeStyles}
                  onChange={(e) => setIncludeStyles(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-500 
                           focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include Tailwind styles
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-2 px-4 pt-4">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${
                activeTab === 'code'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiCode /> Code
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${
                activeTab === 'instructions'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiFileText /> Instructions
            </button>
          </div>
          
          {activeTab === 'code' ? (
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
              <pre className="text-black-100 p-4 rounded-lg overflow-auto text-sm font-mono">
                <code>{code}</code>
              </pre>
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                How to use this code:
              </h3>
              <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-500">1.</span>
                  <span>Copy the generated code using the "Copy Code" button below</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-500">2.</span>
                  <span>
                    Create a new file named{' '}
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {componentName}.jsx
                    </code>{' '}
                    in your project
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-500">3.</span>
                  <span>Paste the code into the file</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-500">4.</span>
                  <span>
                    Make sure you have Recharts installed:{' '}
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      npm install recharts
                    </code>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-500">5.</span>
                  <span>Import and use the component in your application:</span>
                </li>
              </ol>
              
              <div className="mt-4 bg-gray-900 text-gray-100 p-3 rounded-lg">
                <pre className="text-sm">
{`import ${componentName} from './${componentName}';

function App() {
  return <${componentName} />;
}`}
                </pre>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Required Dependencies:
                </h4>
                <pre className="text-sm text-blue-800 dark:text-blue-200 bg-white dark:bg-gray-800 p-2 rounded">
{`{
  "recharts": "^2.5.0",
  "react": "^18.0.0",
  "tailwindcss": "^3.0.0"
}`}
                </pre>
              </div>

              {includeData === 'separate' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                    Note: Separate Data File
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    You've chosen to export data separately. Create a{' '}
                    <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">
                      mockData.js
                    </code>{' '}
                    file and import it in your component.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
          <div className="text-sm text-gray-500">
            {widgets.length} widget{widgets.length !== 1 ? 's' : ''} • {code.split('\n').length} lines of code
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={!code}
            >
              {copied ? (
                <>
                  <FiCheck /> Copied!
                </>
              ) : (
                <>
                  <FiCopy /> Copy Code
                </>
              )}
            </button>
            
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                       flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={!code}
            >
              <FiDownload /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;