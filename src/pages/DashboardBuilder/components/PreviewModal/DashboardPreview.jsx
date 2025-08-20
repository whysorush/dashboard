// src/pages/DashboardBuilder/components/PreviewModal/DashboardPreview.jsx
import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { generateMockData } from '../../utils/mockDataGenerator';

const DashboardPreview = ({ widgets, viewMode }) => {
  const gridCols = viewMode === 'mobile' ? 4 : viewMode === 'tablet' ? 8 : 12;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderChart = (widget) => {
    const data = generateMockData(
      widget.type === 'line-chart' || widget.type === 'area-chart' ? 'time-series' :
      widget.type === 'bar-chart' ? 'categories' :
      widget.type === 'pie-chart' ? 'pie' :
      widget.type === 'funnel-chart' ? 'funnel' : 'time-series'
    );
    
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
      
      case 'kpi-card':
        return (
          <div className="flex flex-col justify-center h-full p-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              42,567
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {widget.config?.title || 'KPI Value'}
            </div>
            <div className="text-sm font-medium text-green-500 mt-2">
              +12.5% from last period
            </div>
          </div>
        );
      
      case 'data-table':
        const tableData = [
          { name: 'Item 1', value: 1234, status: 'Active' },
          { name: 'Item 2', value: 2345, status: 'Active' },
          { name: 'Item 3', value: 3456, status: 'Inactive' },
        ];
        
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Value</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2">{row.value}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        row.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  const renderKPIs = (widget) => {
    if (widget.config?.showKPIs === false || widget.type === 'kpi-card') return null;
    
    return (
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
    );
  };

  const renderFilters = (widget) => {
    if (widget.config?.showFilters === false || widget.type === 'kpi-card') return null;
    
    return (
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded">
          Daily
        </button>
        <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded">
          Weekly
        </button>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
          Monthly
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard Preview
      </h1>
      
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridAutoRows: '100px'
        }}
      >
        {widgets.map((widget) => {
          const colSpan = Math.min(widget.position.w, gridCols);
          const rowSpan = widget.position.h;
          
          return (
            <div
              key={widget.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`
              }}
            >
              {/* Widget Header */}
              {widget.config?.title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {widget.config.title}
                </h3>
              )}
              
              {/* KPIs */}
              {renderKPIs(widget)}
              
              {/* Chart */}
              {renderChart(widget)}
              
              {/* Filters */}
              {renderFilters(widget)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPreview;