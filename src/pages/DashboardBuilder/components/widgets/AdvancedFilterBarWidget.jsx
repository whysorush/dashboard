// src/pages/DashboardBuilder/components/widgets/AdvancedFilterBarWidget.jsx
import React, { useState } from 'react';
import { FiCalendar, FiChevronDown, FiFilter } from 'react-icons/fi';
import BaseWidget from './BaseWidget';

/**
 * Advanced Filter Bar Widget
 * 
 * A professional filter bar with:
 * - Date range picker
 * - Dropdown selects
 * - Range sliders
 * - Clean, modern styling
 * - Responsive design
 */
const AdvancedFilterBarWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};
  
  // State for filter values
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [transactionAmount, setTransactionAmount] = useState('$0-10K');
  const [product, setProduct] = useState('All Types');
  const [status, setStatus] = useState('All');
  const [orderQuantity, setOrderQuantity] = useState('1-100');
  
  return (
    <BaseWidget 
      widget={widget} 
      isSelected={isSelected} 
      onClick={onClick}
      className="p-0 overflow-hidden"
    >
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex flex-wrap gap-4">
          {/* Date Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Filter
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 overflow-hidden">
              <div className="flex-1 flex items-center px-3 py-2">
                <input
                  type="text"
                  placeholder="From"
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
                <FiCalendar className="text-gray-400 ml-2" />
              </div>
              <div className="border-l border-gray-300 dark:border-gray-600 h-full"></div>
              <div className="flex-1 flex items-center px-3 py-2">
                <input
                  type="text"
                  placeholder="To"
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
                <FiCalendar className="text-gray-400 ml-2" />
              </div>
            </div>
          </div>
          
          {/* Transaction Amount */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Amount
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              >
                <option>$0-10K</option>
                <option>$10K-50K</option>
                <option>$50K-100K</option>
                <option>$100K+</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Product */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option>All Types</option>
                <option>Food</option>
                <option>Electronics</option>
                <option>Clothing</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Delivered</option>
                <option>In Transit</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Order Quantity */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Quantity
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
              >
                <option>1-100</option>
                <option>101-500</option>
                <option>501-1000</option>
                <option>1000+</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default AdvancedFilterBarWidget;
