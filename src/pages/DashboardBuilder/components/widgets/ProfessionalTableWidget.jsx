// src/pages/DashboardBuilder/components/widgets/ProfessionalTableWidget.jsx
import React, { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiSearch } from 'react-icons/fi';
import BaseWidget from './BaseWidget';

/**
 * Professional Table Widget
 * 
 * A modern, professional table with:
 * - Status badges with different colors
 * - Sortable columns
 * - Search functionality
 * - Responsive design
 * - Modern styling
 */
const ProfessionalTableWidget = ({ widget, isSelected, onClick }) => {
  const config = widget.config || {};
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for the table
  const mockData = useMemo(() => [
    { 
      id: 1, 
      customer: 'Amelia Jones', 
      orderId: 'YO0086-CHN', 
      productName: 'Popcorn Seasoning', 
      quantity: 9,
      orderAmount: '₹ 60',
      status: 'Pending'
    },
    { 
      id: 2, 
      customer: 'Selena McCoy', 
      orderId: 'YO0086-HRS', 
      productName: 'Secret Shake-In Sauce', 
      quantity: 10,
      orderAmount: '₹ 80',
      status: 'Delivered'
    },
    { 
      id: 3, 
      customer: 'Boston Cooper', 
      orderId: 'YO0086-CHN', 
      productName: 'White vinegar', 
      quantity: 50,
      orderAmount: '₹ 100',
      status: 'Delivered'
    },
    { 
      id: 4, 
      customer: 'Kathryn Murphy', 
      orderId: 'YO0086-HRS', 
      productName: 'Cadbury Cake Bars', 
      quantity: 10,
      orderAmount: '₹ 300',
      status: 'Delivered'
    },
    { 
      id: 5, 
      customer: 'Savannah Nguyen', 
      orderId: 'YO0086-HRS', 
      productName: 'Easy Cheese', 
      quantity: 2,
      orderAmount: '₹ 160',
      status: 'In Transit'
    },
    { 
      id: 6, 
      customer: 'Brooklyn Simmons', 
      orderId: 'YO0087-DNE', 
      productName: 'Doritos', 
      quantity: 4,
      orderAmount: '₹ 20',
      status: 'Pending'
    },
    { 
      id: 7, 
      customer: 'Robert Fox', 
      orderId: 'YO0086-CHN', 
      productName: 'Quaker Instant Oatmeal', 
      quantity: 3,
      orderAmount: '₹ 120',
      status: 'Delivered'
    },
  ], []);
  
  // Sort and filter the data
  const processedData = useMemo(() => {
    let result = [...mockData];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.customer.toLowerCase().includes(lowerSearchTerm) ||
        item.orderId.toLowerCase().includes(lowerSearchTerm) ||
        item.productName.toLowerCase().includes(lowerSearchTerm) ||
        item.status.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];
        
        // Handle numeric values
        if (sortField === 'quantity') {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [mockData, searchTerm, sortField, sortDirection]);
  
  // Handle column header click for sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <BaseWidget 
      widget={widget} 
      isSelected={isSelected} 
      onClick={onClick}
      className="p-0 overflow-hidden"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg h-full flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-12"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    <span>Sl No</span>
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-1/6"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center">
                    <span>Customer</span>
                    {sortField === 'customer' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-1/6"
                  onClick={() => handleSort('orderId')}
                >
                  <div className="flex items-center">
                    <span>Order ID</span>
                    {sortField === 'orderId' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-1/4"
                  onClick={() => handleSort('productName')}
                >
                  <div className="flex items-center">
                    <span>Product Name</span>
                    {sortField === 'productName' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-1/12"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    <span>Order Qty</span>
                    {sortField === 'quantity' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-1/12"
                  onClick={() => handleSort('orderAmount')}
                >
                  <div className="flex items-center">
                    <span>Order Amount</span>
                    {sortField === 'orderAmount' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer w-1/12"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {processedData.length > 0 ? (
                processedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {item.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.orderId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                      {item.orderAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </BaseWidget>
  );
};

export default ProfessionalTableWidget;
