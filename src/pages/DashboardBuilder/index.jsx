import React, { useState, useEffect } from 'react';
import { 
  FiGrid, FiEye, FiDownload, FiRotateCcw, FiRotateCw, 
  FiX, FiMove, FiTrash2, FiCopy, FiLock, FiUnlock
} from 'react-icons/fi';

// Emergency Styles - Add this immediately
const emergencyStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .dashboard-builder-container {
    min-height: 100vh;
    background: #f3f4f6;
    display: flex;
    flex-direction: column;
  }
  
  .db-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 12px 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .db-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .db-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: bold;
    color: #111827;
  }
  
  .db-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .db-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .db-button-primary {
    background: #3b82f6;
    color: white;
  }
  
  .db-button-primary:hover {
    background: #2563eb;
  }
  
  .db-button-success {
    background: #10b981;
    color: white;
  }
  
  .db-button-success:hover {
    background: #059669;
  }
  
  .db-button-icon {
    padding: 8px;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }
  
  .db-button-icon:hover {
    background: #f3f4f6;
  }
  
  .db-main {
    display: flex;
    flex: 1;
    height: calc(100vh - 60px);
    overflow: hidden;
  }
  
  .db-sidebar-left {
    width: 250px;
    background: white;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
    padding: 16px;
  }
  
  .db-canvas {
    flex: 1;
    background: #f9fafb;
    overflow: auto;
    padding: 20px;
    position: relative;
  }
  
  .db-sidebar-right {
    width: 320px;
    background: white;
    border-left: 1px solid #e5e7eb;
    overflow-y: auto;
    padding: 16px;
  }
  
  .widget-palette-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #111827;
  }
  
  .widget-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    cursor: move;
    transition: all 0.2s;
  }
  
  .widget-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .widget-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .widget-icon {
    font-size: 24px;
  }
  
  .widget-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }
  
  .widget-info p {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
  
  .canvas-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
  }
  
  .canvas-empty-content {
    text-align: center;
    padding: 40px;
  }
  
  .canvas-empty-icon {
    font-size: 64px;
    opacity: 0.2;
    margin-bottom: 16px;
  }
  
  .canvas-empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 8px;
  }
  
  .canvas-empty-text {
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  .properties-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .properties-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
  }
  
  .close-button:hover {
    background: #f3f4f6;
  }
  
  .property-group {
    margin-bottom: 20px;
  }
  
  .property-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }
  
  .property-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .property-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-body {
    flex: 1;
    overflow: auto;
    padding: 20px;
    background: #f9fafb;
  }
  
  .preview-content {
    background: white;
    border-radius: 8px;
    padding: 24px;
    min-height: 500px;
  }
  
  .widget-container {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .widget-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #111827;
  }
  
  .divider {
    width: 1px;
    height: 24px;
    background: #d1d5db;
    margin: 0 8px;
  }
  
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
    min-height: 400px;
  }
  
  .grid-item {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
`;

const DashboardBuilderDemo = () => {
  const [widgets, setWidgets] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showProperties, setShowProperties] = useState(false);

  // Sample widgets data
  const availableWidgets = [
    { id: 'line-chart', name: 'Line Chart', icon: '📈', description: 'Show trends over time' },
    { id: 'bar-chart', name: 'Bar Chart', icon: '📊', description: 'Compare categories' },
    { id: 'pie-chart', name: 'Pie Chart', icon: '🥧', description: 'Show proportions' },
    { id: 'funnel-chart', name: 'Funnel Chart', icon: '🔻', description: 'Show conversion rates' },
    { id: 'kpi-card', name: 'KPI Card', icon: '🎯', description: 'Display key metrics' }
  ];

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType.id,
      name: widgetType.name,
      icon: widgetType.icon,
      config: {
        title: widgetType.name,
        color: '#3b82f6'
      }
    };
    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget);
    setShowProperties(true);
  };

  const handleDeleteWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    setSelectedWidget(null);
    setShowProperties(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: emergencyStyles }} />
      
      <div className="dashboard-builder-container">
        {/* Header */}
        <div className="db-header">
          <div className="db-header-content">
            <div className="db-title">
              <FiGrid style={{ color: '#3b82f6' }} />
              Dashboard Builder
              <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>
                ({widgets.length} widgets)
              </span>
            </div>
            
            <div className="db-toolbar">
              <button className="db-button-icon" title="Undo">
                <FiRotateCcw />
              </button>
              <button className="db-button-icon" title="Redo">
                <FiRotateCw />
              </button>
              
              <div className="divider" />
              
              <button 
                className="db-button-icon" 
                title="Clear Canvas"
                onClick={() => setWidgets([])}
              >
                <FiTrash2 />
              </button>
              
              <div className="divider" />
              
              <button 
                className="db-button db-button-primary"
                onClick={() => setShowPreview(true)}
                disabled={widgets.length === 0}
              >
                <FiEye /> Preview
              </button>
              
              <button 
                className="db-button db-button-success"
                onClick={() => setShowExport(true)}
                disabled={widgets.length === 0}
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="db-main">
          {/* Left Sidebar - Component Palette */}
          <div className="db-sidebar-left">
            <h2 className="widget-palette-title">Widget Library</h2>
            {availableWidgets.map(widget => (
              <div 
                key={widget.id}
                className="widget-card"
                onClick={() => handleAddWidget(widget)}
              >
                <div className="widget-card-header">
                  <div className="widget-icon">{widget.icon}</div>
                  <div className="widget-info">
                    <h4>{widget.name}</h4>
                    <p>{widget.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div className="db-canvas">
            {widgets.length === 0 ? (
              <div className="canvas-empty">
                <div className="canvas-empty-content">
                  <div className="canvas-empty-icon">📊</div>
                  <h3 className="canvas-empty-title">Start Building Your Dashboard</h3>
                  <p className="canvas-empty-text">
                    Click on widgets from the left panel to add them here
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid-layout">
                {widgets.map(widget => (
                  <div 
                    key={widget.id} 
                    className="grid-item"
                    style={{ gridColumn: 'span 4' }}
                    onClick={() => {
                      setSelectedWidget(widget);
                      setShowProperties(true);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="widget-title">
                        {widget.icon} {widget.config.title}
                      </h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWidget(widget.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <FiTrash2 style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                    <div style={{ height: '150px', background: '#f3f4f6', borderRadius: '4px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '48px', opacity: 0.5 }}>{widget.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Properties */}
          {showProperties && selectedWidget && (
            <div className="db-sidebar-right">
              <div className="properties-header">
                <h2 className="properties-title">Widget Properties</h2>
                <button className="close-button" onClick={() => setShowProperties(false)}>
                  <FiX />
                </button>
              </div>
              
              <div className="property-group">
                <label className="property-label">Title</label>
                <input 
                  type="text" 
                  className="property-input"
                  value={selectedWidget.config.title}
                  onChange={(e) => {
                    const updated = widgets.map(w => 
                      w.id === selectedWidget.id 
                        ? { ...w, config: { ...w.config, title: e.target.value } }
                        : w
                    );
                    setWidgets(updated);
                    setSelectedWidget({ ...selectedWidget, config: { ...selectedWidget.config, title: e.target.value }});
                  }}
                />
              </div>
              
              <div className="property-group">
                <label className="property-label">Color</label>
                <input 
                  type="color" 
                  className="property-input"
                  value={selectedWidget.config.color}
                  onChange={(e) => {
                    const updated = widgets.map(w => 
                      w.id === selectedWidget.id 
                        ? { ...w, config: { ...w.config, color: e.target.value } }
                        : w
                    );
                    setWidgets(updated);
                    setSelectedWidget({ ...selectedWidget, config: { ...selectedWidget.config, color: e.target.value }});
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Dashboard Preview</h2>
                <button className="close-button" onClick={() => setShowPreview(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="preview-content">
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Dashboard</h1>
                  <div className="grid-layout">
                    {widgets.map(widget => (
                      <div key={widget.id} className="widget-container" style={{ gridColumn: 'span 4' }}>
                        <h3 className="widget-title">{widget.config.title}</h3>
                        <div style={{ height: '200px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '64px', opacity: 0.3 }}>{widget.icon}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExport && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Export Dashboard</h2>
                <button className="close-button" onClick={() => setShowExport(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="preview-content">
                  <p style={{ marginBottom: '16px' }}>Your dashboard code has been generated!</p>
                  <pre style={{ background: '#1f2937', color: '#f3f4f6', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
{`import React from 'react';
import { LineChart, BarChart, PieChart } from 'recharts';

const Dashboard = () => {
  return (
    <div className="dashboard">
      ${widgets.map(w => `<${w.name.replace(' ', '')} title="${w.config.title}" />`).join('\n      ')}
    </div>
  );
};

export default Dashboard;`}
                  </pre>
                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <button className="db-button db-button-primary">
                      <FiCopy /> Copy Code
                    </button>
                    <button className="db-button db-button-success">
                      <FiDownload /> Download File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardBuilderDemo;