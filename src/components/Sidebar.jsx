// src/components/Sidebar.jsx
import {
  FaChartPie, FaPlug, FaRobot, FaChartLine,
  FaLightbulb, FaChartBar, FaCog, FaQuestionCircle
} from 'react-icons/fa';

export default function Sidebar() {
  return (
    <>
      <div className="logo">
        <h2>Stack Logix</h2>
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <p className="nav-title">Home</p>
          <ul>
            <li className="active"><FaChartPie /> Overview</li>
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
