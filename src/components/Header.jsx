// src/components/Header.jsx
import { FaSearch, FaBell } from "react-icons/fa";
import logo from "../assets/man.png"; // Adjust the path as necessary
import ThemeToggle from "./ThemeToggle";
import ColorPalette from "./ColorPalette";

const styles = {
  header: {
    display: "flex",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--search-bar-bg)",
    border: "1px solid var(--border)",
    padding: "10px 12px",
    borderRadius: 10,
    justifySelf: "start",
    width: "75%",
    justifyContent: "right",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
    width: "100%",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "25%",
    justifyContent: "end",
  },
  notificationIcon: {
    color: "var(--primary)",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--panel)",
    padding: 6,
    width: 38,
    height: 38,
  },
  userAvatar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--panel)",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid var(--border)",
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
  },
};

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.searchBar}>
        <FaSearch />
        <input type="text" placeholder="Search" style={styles.searchInput} />
      </div>

      <div style={styles.userProfile}>
        <ColorPalette />
        <ThemeToggle />
        <FaBell style={styles.notificationIcon} />
        <div style={styles.userAvatar}>
          <img src={logo} alt="stacklogix" style={styles.avatarImg} />
          <span>stacklogix</span>
        </div>
      </div>
    </header>
  );
}
