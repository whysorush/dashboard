// src/pages/DashboardBuilder/components/widgets/AdvancedFilterBarWidget.jsx
import React, { useState } from "react";
import { FiCalendar, FiChevronDown, FiFilter } from "react-icons/fi";
import BaseWidget from "./BaseWidget";

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
  console.log("advanced filter widget", widget);

  const config = widget.config || {};

  // State for filter values
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [transactionAmount, setTransactionAmount] = useState("$0-10K");
  const [product, setProduct] = useState("All Types");
  const [status, setStatus] = useState("All");
  const [orderQuantity, setOrderQuantity] = useState("1-100");

  return (
    // <BaseWidget
    //   widget={widget}
    //   isSelected={isSelected}
    //   onClick={onClick}
    //   className="filter-widget"
    // >
    //   <div className="filter-widget-content">
    //     <div className="filter-row">
    //       {/* Date Filter */}
    //       <div className="filter-group">
    //         <label className="filter-label">Date Filter</label>
    //         <div className="date-range-input">
    //           <div className="date-input-group">
    //             <input
    //               type="date"
    //               placeholder="From"
    //               // className="filter-input"
    //               value={dateRange.from}
    //               onChange={(e) =>
    //                 setDateRange({ ...dateRange, from: e.target.value })
    //               }
    //             />
    //             <FiCalendar className="date-icon" />
    //           </div>
    //           <div className="date-separator"></div>
    //           <div className="date-input-group">
    //             <input
    //               type="date"
    //               placeholder="To"
    //               // className="filter-input"
    //               value={dateRange.to}
    //               onChange={(e) =>
    //                 setDateRange({ ...dateRange, to: e.target.value })
    //               }
    //             />
    //             <FiCalendar className="date-icon" />
    //           </div>
    //         </div>
    //       </div>

    //       {/* Transaction Amount */}
    //       <div className="filter-group">
    //         <label className="filter-label">Transaction Amount</label>
    //         <div className="select-wrapper">
    //           <select
    //             className="filter-select"
    //             value={transactionAmount}
    //             onChange={(e) => setTransactionAmount(e.target.value)}
    //           >
    //             <option>$0-10K</option>
    //             <option>$10K-50K</option>
    //             <option>$50K-100K</option>
    //             <option>$100K+</option>
    //           </select>
    //           <FiChevronDown className="select-icon" />
    //         </div>
    //       </div>

    //       {/* Product */}
    //       <div className="filter-group">
    //         <label className="filter-label">Product</label>
    //         <div className="select-wrapper">
    //           <select
    //             className="filter-select"
    //             value={product}
    //             onChange={(e) => setProduct(e.target.value)}
    //           >
    //             <option>All Types</option>
    //             <option>Food</option>
    //             <option>Electronics</option>
    //             <option>Clothing</option>
    //           </select>
    //           <FiChevronDown className="select-icon" />
    //         </div>
    //       </div>

    //       {/* Status */}
    //       <div className="filter-group">
    //         <label className="filter-label">Status</label>
    //         <div className="select-wrapper">
    //           <select
    //             className="filter-select"
    //             value={status}
    //             onChange={(e) => setStatus(e.target.value)}
    //           >
    //             <option>All</option>
    //             <option>Pending</option>
    //             <option>Delivered</option>
    //             <option>In Transit</option>
    //           </select>
    //           <FiChevronDown className="select-icon" />
    //         </div>
    //       </div>

    //       {/* Order Quantity */}
    //       <div className="filter-group">
    //         <label className="filter-label">Order Quantity</label>
    //         <div className="select-wrapper">
    //           <select
    //             className="filter-select"
    //             value={orderQuantity}
    //             onChange={(e) => setOrderQuantity(e.target.value)}
    //           >
    //             <option>1-100</option>
    //             <option>101-500</option>
    //             <option>501-1000</option>
    //             <option>1000+</option>
    //           </select>
    //           <FiChevronDown className="select-icon" />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </BaseWidget>
    <div

    //  className="main-body-section"
    >
      <section className="filters">
        <div className="filter-group">
          <label>Date Filter</label>
          <div className="date-inputs">
            <input
              type="date"
              placeholder="From"
              // className="filter-input"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="To"
              // className="filter-input"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
        </div>
        <div className="filter-group">
          <label>Transaction Amount</label>
          <select
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
          >
            <option>$0-10K</option>
            <option>$10K-50K</option>
            <option>$50K-100K</option>
            <option>$100K+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Product</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option>All Type</option>
            <option>Manufacturing</option>
            <option>Marketing</option>
            <option>Branding</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>In-Transit</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order Quantity</label>
          <select
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
          >
            <option>1-100</option>
            <option>101-500</option>
            <option>500+</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default AdvancedFilterBarWidget;
