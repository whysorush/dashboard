// src/components/DataTable.jsx
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

const statusStyle = (status) => {
  const base = { padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 600 };
  const map = {
    pending: { background: "var(--status-pending-bg)", color: "var(--status-pending-text)" },
    delivered: { background: "var(--status-delivered-bg)", color: "var(--status-delivered-text)" },
    'in-transit': { background: "var(--status-in-transit-bg)", color: "var(--status-in-transit-text)" },
    processing: { background: "#e5e7eb", color: "#6b7280" },
  };
  return { ...base, ...(map[status.toLowerCase()] || {}) };
};

export default function DataTable() {
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
                <span style={statusStyle(r.status)}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
