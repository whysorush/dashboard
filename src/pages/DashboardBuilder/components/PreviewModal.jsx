// src/pages/DashboardBuilder/components/PreviewModal.jsx
import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FiMonitor, FiTablet, FiSmartphone, FiX } from 'react-icons/fi';
import { generateMockData } from '../utils/mockDataTemplates';

const PreviewModal = ({ widgets, isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState('desktop');
  
  if (!isOpen) return null;

  const viewportSizes = {
    desktop: 'max-w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-sm'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Dashboard Preview
          </h2>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggles */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'desktop' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FiMonitor size={16} /> Desktop
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'tablet' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FiTablet size={16} /> Tablet
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
                  viewMode === 'mobile' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FiSmartphone size={16} /> Mobile
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-8">
          <div className={`mx-auto transition-all duration-300 ${viewportSizes[viewMode]}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <DashboardPreview widgets={widgets} viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Preview Component
const DashboardPreview = ({ widgets, viewMode }) => {
  const gridCols = viewMode === 'mobile' ? 4 : viewMode === 'tablet' ? 8 : 12;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const renderChart = (widget) => {
    const data = generateMockData(widget.type);
    const color = widget.config?.color || '#3B82F6';
    
    switch(widget.type) {
      case 'line-chart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar-chart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'area-chart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie-chart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'funnel-chart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unknown chart type</div>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Dashboard
      </h1>
      
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {widgets.map((widget) => {
          const colSpan = Math.min(widget.position.w, gridCols);
          
          return (
            <div
              key={widget.id}
              className={`col-span-${colSpan} bg-white dark:bg-gray-800 rounded-lg shadow p-4`}
              style={{
                gridColumn: `span ${colSpan} / span ${colSpan}`
              }}
            >
              {/* Widget Header */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {widget.config?.title || 'Untitled Widget'}
              </h3>
              
              {/* KPIs */}
              {widget.config?.showKPIs !== false && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 10000)}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 1000)}
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-500">
                      +{Math.floor(Math.random() * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Growth</div>
                  </div>
                </div>
              )}
              
              {/* Chart */}
              {renderChart(widget)}
              
              {/* Filters */}
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Daily
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Weekly
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                  Monthly
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewModal;