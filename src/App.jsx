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
import FunnelChartBox from "./components/FunnelChart";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatCards from "./components/StatCard";
import "./index.css";
import "./App.css";

import React from "react";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="main-content">
        <Header />
        <Filters />
        <StatCards />

        <section className="charts-section">
          <BarChartBox />
          <FunnelChartBox />
        </section>

        <DataTable />
      </main>
    </div>
  );
}

// export default function App() {
//   return (
//     <ThemeProvider>
//       <Router>
//         <div className="min-h-screen bg-[var(--bg)]">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />
//             <Route path="/dashboard" element={<DashboardLayout />} />
//             <Route path="/dashboard-builder" element={<DashboardBuilder />} />
//           </Routes>
//         </div>
//       </Router>
//     </ThemeProvider>
//   );
// }

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <main className="flex-1 overflow-auto">
                <DashboardLayout />
              </main>

              // <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              //   <Sidebar />
              //   <div className="flex-1 flex flex-col">
              //     <Header />
              //     <main className="flex-1 overflow-auto">
              //       <DashboardLayout />
              //     </main>
              //   </div>
              // </div>
            }
          />
          <Route path="/dashboard-builder" element={<DashboardBuilder />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
