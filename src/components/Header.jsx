// src/components/Header.jsx
import { FaSearch, FaBell } from "react-icons/fa";
import logo from "../assets/man.png"; // Adjust the path as necessary
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <FaSearch />
        <input type="text" placeholder="Search" />
      </div>

      <div className="user-profile">
        <ThemeToggle />
        <FaBell className="notification-icon" />
        <div className="user-avatar">
          <img src={logo} alt="stacklogix" />
          <span>stacklogix</span>
        </div>
      </div>
    </header>
  );
}
