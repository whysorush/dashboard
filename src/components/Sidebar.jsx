import { Link, useLocation } from 'react-router-dom';
import {
  FaChartPie, FaPlug, FaRobot, FaChartLine,
  FaLightbulb, FaChartBar, FaCog, FaQuestionCircle,
  FaTools
} from 'react-icons/fa';

const styles = {
  logoH2: {
    margin: "0 0 16px",
    fontWeight: 800,
    color: "var(--text)",
  },
  navSection: { marginTop: 18 },
  navTitle: {
    color: "var(--muted)",
    fontSize: 12,
    margin: "8px 10px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  ul: { listStyle: 'none', padding: 0, margin: '8px 0' },
  li: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  liActive: {
    background: 'color-mix(in oklab, var(--primary) 22%, transparent)',
    color: 'var(--text)',
  },
  a: { display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none', color: 'inherit' },
};

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const liStyle = (active) => active ? { ...styles.li, ...styles.liActive } : styles.li;

  return (
    <>
      <div>
        <h2 style={styles.logoH2}>Stack Logix</h2>
      </div>

      <nav>
        <div style={styles.navSection}>
          <p style={styles.navTitle}>Home</p>
          <ul style={styles.ul}>
            <li style={liStyle(isActive('/dashboard'))}>
              <Link to="/dashboard" style={styles.a}>
                <FaChartPie /> Overview
              </Link>
            </li>
            <li style={liStyle(isActive('/dashboard-builder'))}>
              <Link to="/dashboard-builder" style={styles.a}>
                <FaTools /> Dashboard Builder
              </Link>
            </li>
            <li style={styles.li}><FaPlug /> Integrations</li>
            <li style={styles.li}><FaRobot /> AI Assistant</li>
            <li style={styles.li}><FaChartLine /> Custom Dashboard</li>
            <li style={styles.li}><FaLightbulb /> Auto Insights</li>
            <li style={styles.li}><FaChartBar /> Analytics</li>
          </ul>
        </div>

        <div style={styles.navSection}>
          <p style={styles.navTitle}>Preferences</p>
          <ul style={styles.ul}>
            <li style={styles.li}><FaCog /> Settings</li>
            <li style={styles.li}><FaQuestionCircle /> Help</li>
          </ul>
        </div>
      </nav>
    </>
  );
}