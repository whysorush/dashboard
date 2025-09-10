import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import TestDashboard from './components/TestDashboard';

function App() {
  const [code, setCode] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError('');
  };

  const handleTest = () => {
    if (!code.trim()) {
      setError('Please paste some code to test');
      return;
    }
    setShowDashboard(true);
  };

  const handleBackToEditor = () => {
    setShowDashboard(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                🧪 Dashboard Test App
              </h1>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                Test your exported dashboard components
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {showDashboard && (
                <button
                  onClick={handleBackToEditor}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  ← Back to Editor
                </button>
              )}
              
              <button
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!showDashboard ? (
          <CodeEditor 
            code={code} 
            onCodeChange={handleCodeChange}
            onTest={handleTest}
            error={error}
          />
        ) : (
          <TestDashboard code={code} onError={setError} />
        )}
      </main>
    </div>
  );
}

export default App;
