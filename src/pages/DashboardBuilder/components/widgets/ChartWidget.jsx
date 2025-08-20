// src/pages/DashboardBuilder/components/widgets/ChartWidget.jsx
import React, { useEffect, useState, useMemo } from 'react';
import BaseWidget from './BaseWidget';
import KPIDisplay from './KPIDisplay';
import FilterBar from './FilterBar';
import { generateMockData, calculateKPIs, applyTimeFilter } from '../../utils/mockDataGenerator';

const ChartWidget = ({ 
  widget, 
  isSelected, 
  onClick,
  renderChart,
  dataType = 'time-series'
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: widget.config?.timeRange || 'monthly',
    comparisonPeriod: widget.config?.comparisonPeriod || null
  });

  // Generate or fetch data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate async data loading
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockData = generateMockData(dataType, {
          points: widget.config?.dataPoints || 12,
          trend: widget.config?.trend || 'random'
        });
        
        setData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataType, widget.config?.dataPoints, widget.config?.trend]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return applyTimeFilter(data, filters.timeRange);
  }, [data, filters.timeRange]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(filteredData, widget.config);
  }, [filteredData, widget.config]);

  // Handle refresh interval
  useEffect(() => {
    if (widget.config?.refreshInterval && widget.config.refreshInterval > 0) {
      const interval = setInterval(() => {
        // Refresh data
        const newData = generateMockData(dataType, {
          points: widget.config?.dataPoints || 12,
          trend: widget.config?.trend || 'random'
        });
        setData(newData);
      }, widget.config.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [widget.config?.refreshInterval, dataType, widget.config?.dataPoints]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <BaseWidget 
      widget={widget} 
      isSelected={isSelected} 
      onClick={onClick}
      loading={loading}
      error={error}
    >
      {!loading && !error && (
        <>
          {/* KPIs */}
          {widget.config?.showKPIs !== false && (
            <KPIDisplay
              metrics={kpis}
              config={widget.config}
              position={widget.config?.kpiPosition || 'top'}
            />
          )}

          {/* Chart */}
          <div className="chart-container" style={{ width: '100%', height: 250 }}>
            {renderChart(filteredData, widget.config)}
          </div>

          {/* Filters */}
          {widget.config?.showFilters !== false && (
            <FilterBar 
              config={{ ...widget.config, ...filters }}
              onChange={handleFilterChange} 
            />
          )}
        </>
      )}
    </BaseWidget>
  );
};

export default ChartWidget;