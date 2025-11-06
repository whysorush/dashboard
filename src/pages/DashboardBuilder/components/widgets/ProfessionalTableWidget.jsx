import React, { useState, useMemo, useEffect } from "react";
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../../../context/ThemeContext";
import { useExcelData } from "../ExcelDataContext";

const styles = {
  section: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    marginTop: 18,
    overflowX: "auto",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--panel) 98%, transparent)",
    flexWrap: "wrap",
  },
  search: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--search-bar-bg)",
    border: "1px solid var(--border)",
    padding: "8px 10px",
    borderRadius: 10,
    minWidth: 220,
    flex: "1 1 260px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
    width: "100%",
    font: "inherit",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "var(--primary)" },
  th: {
    textAlign: "left",
    fontWeight: 600,
    color: "var(--table-th-font)",
    padding: "10px 12px",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid var(--border)",
    color: "var(--table-td-font)",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderTop: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--panel) 98%, transparent)",
    gap: 12,
  },
  pageSize: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  muted: { color: "var(--muted)", fontSize: 12, fontWeight: 600 },
  rangeText: { color: "var(--muted)", fontSize: 12 },
  nav: { display: "flex", alignItems: "center", gap: 6 },
  btn: {
    minWidth: 34,
    height: 34,
    padding: "0 8px",
    background: "var(--panel)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    cursor: "pointer",
    transition:
      "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize",
  },
};

const ProfessionalTableWidget = ({ apiUrl }) => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [apiData, setApiData] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [apiError, setApiError] = useState(null);
  const pageSize = 10; // default page size
  const { isDark } = useTheme();
  const { excelData, excelHeaders } = useExcelData();

  const getStatusStyle = (status) => {
    const baseStyle = styles.statusBadge;

    // Define status colors for light and dark modes
    const statusColors = {
      pending: {
        light: { color: "#FF9500", background: "#FFF0DB" },
        dark: { color: "#FF9500", background: "#7A4800" },
      },
      delivered: {
        light: { color: "#07D91E", background: "#E6FEE9" },
        dark: { color: "#07D91E", background: "#057613" },
      },
      "in transit": {
        light: { color: "#25CFFD", background: "#E6F9FF" },
        dark: { color: "#25CFFD", background: "#005D7A" },
      },
      active: {
        light: { color: "#07D91E", background: "#E6FEE9" },
        dark: { color: "#07D91E", background: "#057613" },
      },
      inactive: {
        light: { color: "#FF9500", background: "#FFF0DB" },
        dark: { color: "#FF9500", background: "#7A4800" },
      },
    };

    const statusKey = String(status ?? "").toLowerCase();
    const colorConfig = statusColors[statusKey];

    if (colorConfig) {
      const modeColors = isDark ? colorConfig.dark : colorConfig.light;
      return { ...baseStyle, ...modeColors };
    }

    // Default fallback
    return { ...baseStyle, color: "var(--text)", background: "var(--muted)" };
  };

  const mockData = useMemo(
    () => [
      {
        id: 1,
        customer: "Amelia Jones",
        orderId: "YO0086-CHN",
        productName: "Popcorn Seasoning",
        quantity: 9,
        orderAmount: "₹ 60",
        status: "Pending",
      },
      {
        id: 2,
        customer: "Selena McCoy",
        orderId: "YO0086-HRS",
        productName: "Secret Shake-In Sauce",
        quantity: 10,
        orderAmount: "₹ 80",
        status: "Delivered",
      },
      {
        id: 3,
        customer: "Boston Cooper",
        orderId: "YO0086-CHN",
        productName: "White vinegar",
        quantity: 50,
        orderAmount: "₹ 100",
        status: "Delivered",
      },
      {
        id: 4,
        customer: "Kathryn Murphy",
        orderId: "YO0086-HRS",
        productName: "Cadbury Cake Bars",
        quantity: 10,
        orderAmount: "₹ 300",
        status: "Delivered",
      },
      {
        id: 5,
        customer: "Savannah Nguyen",
        orderId: "YO0086-HRS",
        productName: "Easy Cheese",
        quantity: 2,
        orderAmount: "₹ 160",
        status: "In Transit",
      },
      {
        id: 6,
        customer: "Brooklyn Simmons",
        orderId: "YO0087-DNE",
        productName: "Doritos",
        quantity: 4,
        orderAmount: "₹ 20",
        status: "Pending",
      },
      {
        id: 7,
        customer: "Robert Fox",
        orderId: "YO0086-CHN",
        productName: "Quaker Instant Oatmeal",
        quantity: 3,
        orderAmount: "₹ 120",
        status: "Delivered",
      },
      {
        id: 8,
        customer: "Jane Cooper",
        orderId: "YO0088-ABC",
        productName: "Spaghetti",
        quantity: 12,
        orderAmount: "₹ 240",
        status: "Pending",
      },
      {
        id: 9,
        customer: "Wade Warren",
        orderId: "YO0089-DEF",
        productName: "Olive Oil",
        quantity: 6,
        orderAmount: "₹ 180",
        status: "Delivered",
      },
      {
        id: 10,
        customer: "Cody Fisher",
        orderId: "YO0090-GHI",
        productName: "Ketchup",
        quantity: 8,
        orderAmount: "₹ 96",
        status: "Delivered",
      },
      {
        id: 11,
        customer: "Jenny Wilson",
        orderId: "YO0091-JKL",
        productName: "Mustard",
        quantity: 7,
        orderAmount: "₹ 84",
        status: "In Transit",
      },
      {
        id: 12,
        customer: "Courtney Henry",
        orderId: "YO0092-MNO",
        productName: "Pickles",
        quantity: 5,
        orderAmount: "₹ 75",
        status: "Pending",
      },
      {
        id: 13,
        customer: "Esther Howard",
        orderId: "YO0093-PQR",
        productName: "Tortilla Chips",
        quantity: 11,
        orderAmount: "₹ 110",
        status: "Delivered",
      },
      {
        id: 14,
        customer: "Guy Hawkins",
        orderId: "YO0094-STU",
        productName: "Salsa",
        quantity: 9,
        orderAmount: "₹ 135",
        status: "Delivered",
      },
      {
        id: 15,
        customer: "Leslie Alexander",
        orderId: "YO0095-VWX",
        productName: "Brown Rice",
        quantity: 3,
        orderAmount: "₹ 90",
        status: "Pending",
      },
      {
        id: 16,
        customer: "Jacob Jones",
        orderId: "YO0096-YZA",
        productName: "Black Beans",
        quantity: 4,
        orderAmount: "₹ 60",
        status: "Delivered",
      },
      {
        id: 17,
        customer: "Theresa Webb",
        orderId: "YO0097-BCD",
        productName: "Pasta Sauce",
        quantity: 10,
        orderAmount: "₹ 200",
        status: "Delivered",
      },
      {
        id: 18,
        customer: "Arlene McCoy",
        orderId: "YO0098-EFG",
        productName: "Cereal",
        quantity: 6,
        orderAmount: "₹ 150",
        status: "In Transit",
      },
      {
        id: 19,
        customer: "Annette Black",
        orderId: "YO0099-HIJ",
        productName: "Peanut Butter",
        quantity: 2,
        orderAmount: "₹ 70",
        status: "Pending",
      },
      {
        id: 20,
        customer: "Darlene Robertson",
        orderId: "YO0100-KLM",
        productName: "Jam",
        quantity: 8,
        orderAmount: "₹ 160",
        status: "Delivered",
      },
    ],
    []
  );

  // Is the table driven by Excel data?
  const isExcelDriven =
    Array.isArray(excelData) &&
    excelData.length > 0 &&
    Array.isArray(excelHeaders) &&
    excelHeaders.length > 0;

  // Decide the base dataset depending on apiUrl and fetch status
  const { baseData, showBlankState, isLoading, activeHeaders } = useMemo(() => {
    if (!apiUrl) {
      if (isExcelDriven) {
        const withIds = excelData.map((r, idx) => ({ __rowIndex: idx, ...r }));
        return {
          baseData: withIds,
          showBlankState: false,
          isLoading: false,
          activeHeaders: excelHeaders,
        };
      }
      return {
        baseData: mockData,
        showBlankState: false,
        isLoading: false,
        activeHeaders: [
          "id",
          "customer",
          "orderId",
          "productName",
          "quantity",
          "orderAmount",
          "status",
        ],
      };
    }
    if (!apiLoaded) {
      return {
        baseData: [],
        showBlankState: false,
        isLoading: true,
        activeHeaders: [],
      };
    }
    if (apiError || (Array.isArray(apiData) && apiData.length === 0)) {
      return {
        baseData: [],
        showBlankState: true,
        isLoading: false,
        activeHeaders: [],
      };
    }
    return {
      baseData: Array.isArray(apiData) ? apiData : [],
      showBlankState: false,
      isLoading: false,
      activeHeaders: [],
    };
  }, [
    apiUrl,
    apiLoaded,
    apiError,
    apiData,
    mockData,
    excelData,
    excelHeaders,
    isExcelDriven,
  ]);

  const processedData = useMemo(() => {
    let result = [...baseData];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (isExcelDriven) {
        result = result.filter((row) =>
          activeHeaders.some((h) =>
            String(row[h] ?? "")
              .toLowerCase()
              .includes(q)
          )
        );
      } else {
        result = result.filter(
          (item) =>
            String(item.customer ?? "")
              .toLowerCase()
              .includes(q) ||
            String(item.orderId ?? "")
              .toLowerCase()
              .includes(q) ||
            String(item.productName ?? "")
              .toLowerCase()
              .includes(q) ||
            String(item.status ?? "")
              .toLowerCase()
              .includes(q)
        );
      }
    }

    if (sortField) {
      result.sort((a, b) => {
        let A = a[sortField];
        let B = b[sortField];
        const toNum = (v) =>
          v === null || v === undefined || v === "" || isNaN(Number(v))
            ? null
            : Number(v);
        const numA = toNum(A);
        const numB = toNum(B);
        if (numA !== null && numB !== null) {
          if (numA < numB) return sortDirection === "asc" ? -1 : 1;
          if (numA > numB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        A = String(A ?? "").toLowerCase();
        B = String(B ?? "").toLowerCase();
        if (A < B) return sortDirection === "asc" ? -1 : 1;
        if (A > B) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [
    baseData,
    searchTerm,
    sortField,
    sortDirection,
    isExcelDriven,
    activeHeaders,
  ]);

  // Fetch data from API if apiUrl is provided
  useEffect(() => {
    if (!apiUrl) {
      setApiLoaded(false);
      setApiError(null);
      setApiData([]);
      return;
    }

    let isCancelled = false;
    async function fetchData() {
      try {
        setApiLoaded(false);
        setApiError(null);
        setApiData([]);
        console.log("Fetching data from API:", apiUrl);
        console.log("api is hitted");
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (isCancelled) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setApiData(list);
        console.log("API response:", data);
      } catch (err) {
        if (isCancelled) return;
        setApiError(err);
        console.error("API error:", err);
      } finally {
        if (!isCancelled) setApiLoaded(true);
      }
    }

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [apiUrl]);

  // Reset to page 0 whenever filters or sort change
  useEffect(() => setCurrentPage(0), [searchTerm, sortField, sortDirection]);
  // Clear selections when the underlying dataset changes
  useEffect(() => setSelectedRows(new Set()), [baseData]);

  const totalItems = processedData.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const start = currentPage * pageSize;
  const end = Math.min(start + pageSize, totalItems);
  const pagedData = useMemo(
    () => processedData.slice(start, end),
    [processedData, start, end]
  );

  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (rowKey) => {
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(rowKey)) {
        newSelected.delete(rowKey);
      } else {
        newSelected.add(rowKey);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === pagedData.length) {
      setSelectedRows(new Set());
    } else {
      const keys = pagedData.map((item) =>
        isExcelDriven ? item.__rowIndex : item.id
      );
      setSelectedRows(new Set(keys));
    }
  };

  const isRowSelected = (rowKey) => selectedRows.has(rowKey);
  const isAllSelected =
    selectedRows.size === pagedData.length && pagedData.length > 0;

  return (
    <section style={styles.section} aria-label="Orders table">
      <div style={styles.toolbar}>
        <div style={styles.search} role="search">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            style={{ color: "var(--muted)" }}
          >
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
            />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            aria-label={
              isExcelDriven
                ? "Search in table"
                : "Search by customer, order id, product or status"
            }
            style={styles.searchInput}
          />
        </div>
        {/* Excel file input removed in favor of global uploader */}
      </div>

      <table style={styles.table}>
        <thead style={styles.thead}>
          {isExcelDriven ? (
            <tr>
              <th style={styles.th}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              {excelHeaders.map((h) => (
                <th key={h} style={styles.th} onClick={() => handleSort(h)}>
                  {h}
                  {sortField === h &&
                    (sortDirection === "asc" ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    ))}
                </th>
              ))}
            </tr>
          ) : (
            <tr>
              <th style={styles.th}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th style={styles.th} onClick={() => handleSort("id")}>
                Sr No.
                {sortField === "id" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
              <th style={styles.th} onClick={() => handleSort("customer")}>
                Customer
                {sortField === "customer" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
              <th style={styles.th} onClick={() => handleSort("orderId")}>
                Order ID
                {sortField === "orderId" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
              <th style={styles.th} onClick={() => handleSort("productName")}>
                Product Name
                {sortField === "productName" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
              <th style={styles.th} onClick={() => handleSort("quantity")}>
                Order Qty
                {sortField === "quantity" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
              <th style={styles.th} onClick={() => handleSort("orderAmount")}>
                Order Amount
                {sortField === "orderAmount" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
              <th style={styles.th} onClick={() => handleSort("status")}>
                Status
                {sortField === "status" &&
                  (sortDirection === "asc" ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  ))}
              </th>
            </tr>
          )}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                style={styles.td}
                colSpan={isExcelDriven ? excelHeaders.length + 1 : 8}
              >
                Loading…
              </td>
            </tr>
          ) : pagedData.length ? (
            pagedData.map((item) => {
              const rowKey = isExcelDriven ? item.__rowIndex : item.id;
              return (
                <tr
                  key={rowKey}
                  style={{
                    ...styles.td,
                    cursor: "pointer",
                    backgroundColor: isRowSelected(rowKey)
                      ? "var(--primary)"
                      : "transparent",
                    color: isRowSelected(rowKey)
                      ? "#ffffff"
                      : "var(--table-td-font)",
                    transition: "none",
                    userSelect: "none",
                    transform: "scale(1)",
                  }}
                  onClick={() => handleRowClick(rowKey)}
                  onMouseEnter={(e) => {
                    if (!isRowSelected(rowKey)) {
                      e.currentTarget.style.backgroundColor =
                        "var(--hover-bg, rgba(0, 0, 0, 0.05))";
                      e.currentTarget.style.transform = "scale(1.01)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.borderLeft =
                        "3px solid var(--primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isRowSelected(rowKey)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderLeft = "none";
                    }
                  }}
                >
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={isRowSelected(rowKey)}
                      onChange={() => handleRowClick(rowKey)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: "pointer" }}
                    />
                  </td>

                  {isExcelDriven ? (
                    excelHeaders.map((h) => (
                      <td key={h} style={styles.td}>
                       
                          {String(item[h] ?? "")}
                        {console.log("first", String(item[h]))}

                        {console.log("second", item[h])}
                      </td>
                    ))
                  ) : (
                    <>
                      <td style={styles.td}>{item.id}</td>
                      <td style={styles.td}>{item.customer}</td>
                      <td style={styles.td}>{item.orderId}</td>
                      <td style={styles.td}>{item.productName}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>{item.orderAmount}</td>
                      <td
                      // style={styles.td}
                      >
                        <span style={getStatusStyle(item.status)}>
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                style={styles.td}
                colSpan={isExcelDriven ? excelHeaders.length + 1 : 8}
              >
                {showBlankState
                  ? "No data available"
                  : "No matching records found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={styles.pagination} role="navigation" aria-label="Pagination">
        <div style={styles.pageSize}>
          <span style={styles.muted}>Rows:</span>
          <strong>10</strong>
          <span style={styles.rangeText}>
            • Showing {totalItems === 0 ? 0 : start + 1}–{end} of {totalItems}
          </span>
        </div>

        <div style={styles.nav}>
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            style={styles.btn}
            aria-label="Previous page"
            title="Previous page"
          >
            <FiChevronLeft />
          </button>

          <span
            style={{ ...styles.rangeText, padding: "0 8px" }}
            aria-live="polite"
          >
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            style={styles.btn}
            aria-label="Next page"
            title="Next page"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalTableWidget;
