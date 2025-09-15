// src/components/StatCards.jsx
import {
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaArrowUp,
} from "react-icons/fa";

const styles = {
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginTop: 18,
  },
  card: {
    display: "grid",
    gridTemplateColumns: "54px 1fr",
    gap: 14,
    background: "linear-gradient(180deg, color-mix(in oklab, var(--panel) 92%, transparent), color-mix(in oklab, var(--panel) 100%, transparent))",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 16,
  },
  icon: {
    width: 54,
    height: 54,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "var(--icon-stat-bg)",
    color: "var(--icon-stat-font)",
    marginBottom: 8,
  },
  title: { margin: 0, fontSize: 14, color: "var(--text)" },
  value: { fontSize: 28, fontWeight: 800, color: "var(--text)", width: "50%" },
  change: { display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 12, marginTop: 24 },
};

function StatCard({ icon: Icon, title, value, changeText }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>
        <Icon />
      </div>
      <div>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.value}>{value}</div>
        <div style={styles.change}>
          <FaArrowUp />
          <span>{changeText}</span>
        </div>
      </div>
    </div>
  );
}

export default function StatCards() {
  return (
    <section style={styles.list}>
      <StatCard
        icon={FaDollarSign}
        title="Total Revenue"
        value="$847,293"
        changeText="5.1% from last week"
      />
      <StatCard
        icon={FaShoppingCart}
        title="Orders"
        value="$2,847"
        changeText="8.2% from last week"
      />
      <StatCard
        icon={FaUsers}
        title="Customers"
        value="12,483"
        changeText="7.3% from last week"
      />
    </section>
  );
}
