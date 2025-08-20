import { Link, useLocation } from 'react-router-dom';
import {
  FaChartPie, FaPlug, FaRobot, FaChartLine,
  FaLightbulb, FaChartBar, FaCog, FaQuestionCircle,
  FaTools
} from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="logo">
        <h2>Stack Logix</h2>
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <p className="nav-title">Home</p>
          <ul>
            <li className={isActive('/dashboard') ? 'active' : ''}>
              <Link to="/dashboard" className="flex items-center gap-2">
                <FaChartPie /> Overview
              </Link>
            </li>
            <li className={isActive('/dashboard-builder') ? 'active' : ''}>
              <Link to="/dashboard-builder" className="flex items-center gap-2">
                <FaTools /> Dashboard Builder
              </Link>
            </li>
            <li><FaPlug /> Integrations</li>
            <li><FaRobot /> AI Assistant</li>
            <li><FaChartLine /> Custom Dashboard</li>
            <li><FaLightbulb /> Auto Insights</li>
            <li><FaChartBar /> Analytics</li>
          </ul>
        </div>

        <div className="nav-section">
          <p className="nav-title">Preferences</p>
          <ul>
            <li><FaCog /> Settings</li>
            <li><FaQuestionCircle /> Help</li>
          </ul>
        </div>
      </nav>
    </>
  );
}