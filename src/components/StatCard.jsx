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
    // display: "grid",
    gridTemplateColumns: "54px 1fr",
    gap: 14,
    background:
      "linear-gradient(180deg, color-mix(in oklab, var(--panel) 92%, transparent), color-mix(in oklab, var(--panel) 100%, transparent))",
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
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text)" },
  value: {
    // fontSize: 28,
    // fontWeight: 800,
    // color: "var(--text)",
    // width: "50%",
    display: "flex",
    marginTop: 24,

    // justifyContent: "right",
  },
  change: {
    // display: "flex",
    // alignItems: "center",
    gap: 6,
    // color: "#22c55e",
    fontSize: 12,
    // marginTop: 24,
    width: "50%",
    textAlign: "right",
  },
};

function StatCard({ icon, title, value, percentage, changeText }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <div>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <div style={styles.value} className="below_div">
        <div style={{ width: "50%", fontWeight: "700", fontSize: "22px" }}>
          {value}
        </div>

        <div style={styles.change}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              justifyContent: "right",
              color: "#22c55e",
            }}
          >
            <FaArrowUp /> {percentage}
          </p>
          <p>{changeText}</p>
        </div>
      </div>
    </div>
  );
}

// Array of JSON data for stat cards
const statCardsData = [
  {
    id: 1,
    icon: "💰",
    title: "Total Revenue",
    value: "$847,293",
    percentage: "5.1%",
    changeText: "from last week",
  },
  {
    id: 2,
    icon: "📦",
    title: "Orders",
    value: "$2,847",
    percentage: "8.2%",
    changeText: "from last week",
  },
  {
    id: 3,
    icon: "👥",
    title: "Customers",
    value: "12,483",
    percentage: "7.3%",
    changeText: "from last week",
  },
];

export default function StatCards() {
  return (
    <section style={styles.list}>
      {statCardsData.map((card) => (
        <StatCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          value={card.value}
          percentage={card.percentage}
          changeText={card.changeText}
        />
      ))}
    </section>
  );
}
