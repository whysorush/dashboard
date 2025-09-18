import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardBuilder from "./pages/DashboardBuilder";
import BarChartBox from "./components/BarChart";
import DataTable from "./components/DataTable";
import Filters from "./components/Filters";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatCards from "./components/StatCard";
import "./index.css";
import "./App.css";

import React from "react";
import SmoothFunnelChartWidget from "./pages/DashboardBuilder/components/widgets/SmoothFunnelChartWidget";
import GradientBarChartWidget from "./pages/DashboardBuilder/components/widgets/GradientBarChartWidget";
import AdvancedFilterBarWidget from "./pages/DashboardBuilder/components/widgets/AdvancedFilterBarWidget";
import ProfessionalTableWidget from "./pages/DashboardBuilder/components/widgets/ProfessionalTableWidget";

const styles = {
  dashboardContainer: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  sidebar: {
    background: "var(--panel)",
    borderRight: "1px solid var(--border)",
    padding: "20px 16px",
    position: "relative",
    zIndex: 20,
    transition:
      "transform 0.25s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  },
  mainContent: {},
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 18,
  },
};

function DashboardLayout() {
  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <Sidebar />
      </aside>

      <main style={styles.mainContent}>
        <Header />
        <AdvancedFilterBarWidget />
        <StatCards />

        <section style={styles.chartsSection}>
          <GradientBarChartWidget />
          <SmoothFunnelChartWidget />
        </section>

        <ProfessionalTableWidget />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <main style={{ flex: 1, overflow: "auto" }}>
                <DashboardLayout />
              </main>
            }
          />
          <Route path="/dashboard-builder" element={<DashboardBuilder />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
