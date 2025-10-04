// src/components/DataTable.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

const rows = [
  { id: 1, customer: 'Amruta Joshi', orderId: '100086-CBN', product: 'Popcorn seasoning', qty: 19, amount: 60, status: 'Pending' },
  { id: 2, customer: 'Arlene McCoy', orderId: '100086-MRS', product: 'Secret Stadium Sauce', qty: 10, amount: 80, status: 'Delivered' },
  { id: 3, customer: 'Brooklyn Simmons', orderId: '100086-CBN', product: 'White chocolate', qty: 150, amount: 100, status: 'Processing' },
];

const styles = {
  wrapper: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    marginTop: 18,
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "var(--primary)",
    borderRadius: 8,
  },
  th: {
    textAlign: "left",
    fontWeight: 600,
    color: "var(--table-th-font)",
    padding: "10px 12px",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid var(--border)",
    color: "var(--table-td-font)",
  },
};

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

export default function DataTable() {
  const { isDark } = useTheme();
  
  return (
    <section style={styles.wrapper}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Sr No.</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>Product Name</th>
            <th style={styles.th}>Order Qty</th>
            <th style={styles.th}>Order Amount</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={styles.td}>{r.id}</td>
              <td style={styles.td}>{r.customer}</td>
              <td style={styles.td}>{r.orderId}</td>
              <td style={styles.td}>{r.product}</td>
              <td style={styles.td}>{r.qty}</td>
              <td style={styles.td}>₹ {r.amount}</td>
              <td style={styles.td}>
                {/* <span style={getStatusStyle(r.status, isDark)}>{r.status}</span> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
