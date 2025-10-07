import React, { lazy, Suspense, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import "./App.css";

// Lazy load components for better performance with preloading
const DashboardBuilder = lazy(() =>
  import("./pages/DashboardBuilder").then((module) => {
    // Preload related components
    import("./pages/DashboardBuilder/components/Canvas");
    import("./pages/DashboardBuilder/components/ComponentPalette");
    return module;
  })
);

// Lazy load dashboard components with better chunking
const BarChartBox = lazy(() => import("./components/BarChart"));
const LineChartWidget = lazy(() =>
  import("./pages/DashboardBuilder/components/widgets/LineChartWidget")
); //

const DataTable = lazy(() => import("./components/DataTable"));
const Filters = lazy(() => import("./components/Filters"));
const Header = lazy(() => import("./components/Header"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const StatCards = lazy(() => import("./components/StatCard"));

// Lazy load dashboard widgets with preloading
const SmoothFunnelChartWidget = lazy(() =>
  import("./pages/DashboardBuilder/components/widgets/SmoothFunnelChartWidget")
);
const GradientBarChartWidget = lazy(() =>
  import("./pages/DashboardBuilder/components/widgets/GradientBarChartWidget")
);
const AdvancedFilterBarWidget = lazy(() =>
  import("./pages/DashboardBuilder/components/widgets/AdvancedFilterBarWidget")
);
const ProfessionalTableWidget = lazy(() =>
  import("./pages/DashboardBuilder/components/widgets/ProfessionalTableWidget")
);
const PieChartWidget = lazy(() =>
  import("./pages/DashboardBuilder/components/widgets/PieChartWidget")
);

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
    padding: "10px",
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

// Memoized loading fallback components
const SidebarFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
));

const HeaderFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 h-16 w-full rounded mb-4"></div>
));

const FilterFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 h-12 w-full rounded mb-4"></div>
));

const StatCardsFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 h-24 w-full rounded mb-4"></div>
));

const ChartFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
));

const TableFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 h-96 w-full rounded"></div>
));

const DashboardLayout = memo(() => {
  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>
      </aside>

      <main style={styles.mainContent}>
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>

        <Suspense fallback={<FilterFallback />}>
          <AdvancedFilterBarWidget 
            widget={{
              id: "overview-filter",
              type: "advanced-filter-bar",
              config: {
                sections: [
                  { id: "date", label: "Date Filter", type: "date", visible: true },
                  { id: "transaction", label: "Transaction Amount", type: "select", visible: true },
                  { id: "product", label: "Product", type: "select", visible: true },
                  { id: "status", label: "Status", type: "select", visible: true },
                  { id: "quantity", label: "Order Quantity", type: "select", visible: true },
                ]
              }
            }}
            isSelected={false}
            onClick={() => {}}
            isPreview={true}
          />
        </Suspense>

        <Suspense fallback={<StatCardsFallback />}>
          <StatCards />
        </Suspense>

        <section style={styles.chartsSection}>
          <Suspense fallback={<ChartFallback />}>
            <GradientBarChartWidget />
          </Suspense>
          <Suspense fallback={<ChartFallback />}>
            <SmoothFunnelChartWidget />
          </Suspense>
          <Suspense fallback={<ChartFallback />}>
            <PieChartWidget />
          </Suspense>

          <Suspense fallback={<ChartFallback />}>
            <LineChartWidget />
          </Suspense>
        </section>

        <Suspense fallback={<TableFallback />}>
          <ProfessionalTableWidget />
        </Suspense>
      </main>
    </div>
  );
});

DashboardLayout.displayName = "DashboardLayout";

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
          <Route
            path="/dashboard-builder"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                }
              >
                <DashboardBuilder />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
