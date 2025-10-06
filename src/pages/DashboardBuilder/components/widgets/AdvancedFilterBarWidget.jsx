// src/pages/DashboardBuilder/components/widgets/AdvancedFilterBarWidget?.jsx
import React, { useState } from "react";
import { FiCalendar, FiChevronDown, FiFilter } from "react-icons/fi";
import BaseWidget from "./BaseWidget";

const styles = {
  section: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  group: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "10px 12px",
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 8,
  },
  control: {
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "8px 10px",
  },
  dateInputs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
};

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

  const config = widget?.config || {};

  // State for filter values
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [transactionAmount, setTransactionAmount] = useState("$0-10K");
  const [product, setProduct] = useState("All Types");
  const [status, setStatus] = useState("All");
  const [orderQuantity, setOrderQuantity] = useState("1-100");

  return (
    <div>
      <section style={styles.section}>
        <div style={styles.group}>
          <label style={styles.label}>Date Filter</label>
          <div style={styles.dateInputs}>
            <input
              type="date"
              placeholder="From"
              style={styles.control}
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="To"
              style={styles.control}
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Transaction Amount</label>
          <select
            style={styles.control}
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
          >
            <option>$0-10K</option>
            <option>$10K-50K</option>
            <option>$50K-100K</option>
            <option>$100K+</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Product</label>
          <select style={styles.control} value={product} onChange={(e) => setProduct(e.target.value)}>
            <option>All Type</option>
            <option>Manufacturing</option>
            <option>Marketing</option>
            <option>Branding</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Status</label>
          <select style={styles.control} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>In-Transit</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Order Quantity</label>
          <select
            style={styles.control}
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
