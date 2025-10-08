// components/OrdersTable.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const orders = [
  {
    id: 1,
    customer: "Amruta Joshi",
    orderId: "100086-CBN",
    product: "Popcorn seasoning",
    qty: 19,
    amount: 60,
    status: "Pending",
  },
  {
    id: 2,
    customer: "Arlene McCoy",
    orderId: "100086-MRS",
    product: "Secret Stadium Sauce",
    qty: 10,
    amount: 80,
    status: "Delivered",
  },
  {
    id: 3,
    customer: "Becci Coner",
    orderId: "100086-CBN",
    product: "White sesame",
    qty: 30,
    amount: 150,
    status: "In Progress",
  },
];

const getStatusStyle = (status, isDark) => {
  const baseStyle = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize",
  };
  
  // Define status colors for light and dark modes
  const statusColors = {
    pending: {
      light: { color: "#FF9500", background: "#FFF0DB" },
      dark: { color: "#FF9500", background: "#7A4800" }
    },
    delivered: {
      light: { color: "#07D91E", background: "#E6FEE9" },
      dark: { color: "#07D91E", background: "#057613" }
    },
    "in progress": {
      light: { color: "#25CFFD", background: "#E6F9FF" },
      dark: { color: "#25CFFD", background: "#005D7A" }
    },
    "in transit": {
      light: { color: "#25CFFD", background: "#E6F9FF" },
      dark: { color: "#25CFFD", background: "#005D7A" }
    },
    processing: {
      light: { color: "#6B7280", background: "#F3F4F6" },
      dark: { color: "#9CA3AF", background: "#374151" }
    },
    active: {
      light: { color: "#07D91E", background: "#E6FEE9" },
      dark: { color: "#07D91E", background: "#057613" }
    },
    inactive: {
      light: { color: "#FF9500", background: "#FFF0DB" },
      dark: { color: "#FF9500", background: "#7A4800" }
    }
  };

  const statusKey = status.toLowerCase();
  const colorConfig = statusColors[statusKey];
  
  if (colorConfig) {
    const modeColors = isDark ? colorConfig.dark : colorConfig.light;
    return { ...baseStyle, ...modeColors };
  }
  
  // Default fallback
  return { ...baseStyle, color: "var(--text)", background: "var(--muted)" };
};

const OrdersTable = () => {
  const { isDark } = useTheme();
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  const handleRowClick = (orderId) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(orderId)) {
        newSelected.delete(orderId);
      } else {
        newSelected.add(orderId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === orders.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(orders.map(o => o.id)));
    }
  };

  const isRowSelected = (orderId) => selectedRows.has(orderId);
  const isAllSelected = selectedRows.size === orders.length && orders.length > 0;
  
  return (
    <div className="bg-[#1e293b] p-6 rounded-lg overflow-x-auto">
      <h3 className="text-lg mb-4">Orders</h3>
      <table className="min-w-full text-left text-sm text-white">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="py-2 px-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="cursor-pointer"
              />
            </th>
            <th className="py-2 px-4">Sr No.</th>
            <th className="py-2 px-4">Customer</th>
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Product Name</th>
            <th className="py-2 px-4">Order Qty</th>
            <th className="py-2 px-4">Order Amount</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr 
              key={o.id} 
              className={`border-b border-gray-700 cursor-pointer transition-all duration-200 select-none ${
                isRowSelected(o.id) ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700 hover:shadow-md'
              }`}
              onClick={() => handleRowClick(o.id)}
              style={{
                transform: 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isRowSelected(o.id)) {
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderLeft = '3px solid #3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRowSelected(o.id)) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderLeft = 'none';
                }
              }}
            >
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={isRowSelected(o.id)}
                  onChange={() => handleRowClick(o.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer"
                />
              </td>
              <td className="py-2 px-4">{o.id}</td>
              <td className="py-2 px-4">{o.customer}</td>
              <td className="py-2 px-4">{o.orderId}</td>
              <td className="py-2 px-4">{o.product}</td>
              <td className="py-2 px-4">{o.qty}</td>
              <td className="py-2 px-4">₹ {o.amount}</td>
              <td className="py-2 px-4">
                <span style={getStatusStyle(o.status, isDark)}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
