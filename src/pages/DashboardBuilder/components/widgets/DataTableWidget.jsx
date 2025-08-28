// src/pages/DashboardBuilder/components/widgets/DataTableWidget.jsx
import React, { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiSearch } from 'react-icons/fi';
import BaseWidget from './BaseWidget';
import FilterBar from './FilterBar';

const DataTableWidget = ({ widget, isSelected, onClick }) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data
  const rawData = useMemo(() => [
    { id: 1, name: 'Product A', category: 'Electronics', sales: 45234, growth: 12.5, status: 'active' },
    { id: 2, name: 'Product B', category: 'Clothing', sales: 32156, growth: -5.2, status: 'active' },
    { id: 3, name: 'Product C', category: 'Food', sales: 28934, growth: 8.7, status: 'inactive' },
    { id: 4, name: 'Product D', category: 'Electronics', sales: 56234, growth: 23.1, status: 'active' },
    { id: 5, name: 'Product E', category: 'Toys', sales: 19234, growth: -2.3, status: 'active' },
    { id: 6, name: 'Product F', category: 'Clothing', sales: 41234, growth: 15.8, status: 'active' },
    { id: 7, name: 'Product G', category: 'Food', sales: 35678, growth: 6.4, status: 'inactive' },
    { id: 8, name: 'Product H', category: 'Electronics', sales: 67890, growth: 31.2, status: 'active' },
  ], []);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = rawData.filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [rawData, searchTerm, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return processedData.slice(start, end);
  }, [processedData, currentPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'sales', label: 'Sales', sortable: true, format: 'currency' },
    { key: 'growth', label: 'Growth', sortable: true, format: 'percentage' },
    { key: 'status', label: 'Status', sortable: true }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value > 0 ? '+' : ''}${value}%`;
      default:
        return value;
    }
  };

  return (
    <BaseWidget widget={widget} isSelected={isSelected} onClick={onClick}>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm" style={{ fontFamily: "'Figtree', sans-serif" }}>
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 
                            ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}
                            first:rounded-tl-lg last:rounded-tr-lg`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortField === column.key && (
                      sortDirection === 'asc' ? 
                        <FiChevronUp className="w-3 h-3" /> : 
                        <FiChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {paginatedData.map((row, index) => (
              <tr 
                key={row.id}
                className={`border-b border-gray-100 dark:border-gray-700 
                          hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200
                          ${index === paginatedData.length - 1 ? 'last:border-b-0' : ''}`}
              >
                {columns.map(column => (
                  <td key={column.key} className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    {column.key === 'status' ? (
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        row[column.key] === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {row[column.key]}
                      </span>
                    ) : column.key === 'growth' ? (
                      <span className={row[column.key] > 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatValue(row[column.key], column.format)}
                      </span>
                    ) : (
                      formatValue(row[column.key], column.format)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                     hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                     hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <FilterBar config={widget.config} onChange={handleFilterChange} />
    </BaseWidget>
  );
};

export default DataTableWidget;