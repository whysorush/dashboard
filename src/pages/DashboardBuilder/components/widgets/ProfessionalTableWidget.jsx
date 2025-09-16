// src/pages/DashboardBuilder/components/widgets/ProfessionalTableWidget.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProfessionalTableWidget = () => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // default page size

  const mockData = useMemo(
    () => [
      { id: 1,  customer: "Amelia Jones",       orderId: "YO0086-CHN", productName: "Popcorn Seasoning",      quantity: 9,  orderAmount: "₹ 60",  status: "Pending"   },
      { id: 2,  customer: "Selena McCoy",       orderId: "YO0086-HRS", productName: "Secret Shake-In Sauce",  quantity: 10, orderAmount: "₹ 80",  status: "Delivered" },
      { id: 3,  customer: "Boston Cooper",      orderId: "YO0086-CHN", productName: "White vinegar",          quantity: 50, orderAmount: "₹ 100", status: "Delivered" },
      { id: 4,  customer: "Kathryn Murphy",     orderId: "YO0086-HRS", productName: "Cadbury Cake Bars",      quantity: 10, orderAmount: "₹ 300", status: "Delivered" },
      { id: 5,  customer: "Savannah Nguyen",    orderId: "YO0086-HRS", productName: "Easy Cheese",            quantity: 2,  orderAmount: "₹ 160", status: "In Transit"},
      { id: 6,  customer: "Brooklyn Simmons",   orderId: "YO0087-DNE", productName: "Doritos",                quantity: 4,  orderAmount: "₹ 20",  status: "Pending"   },
      { id: 7,  customer: "Robert Fox",         orderId: "YO0086-CHN", productName: "Quaker Instant Oatmeal", quantity: 3,  orderAmount: "₹ 120", status: "Delivered" },
      // add more rows to see multiple pages
      { id: 8,  customer: "Jane Cooper",        orderId: "YO0088-ABC", productName: "Spaghetti",              quantity: 12, orderAmount: "₹ 240", status: "Pending"   },
      { id: 9,  customer: "Wade Warren",        orderId: "YO0089-DEF", productName: "Olive Oil",              quantity: 6,  orderAmount: "₹ 180", status: "Delivered" },
      { id: 10, customer: "Cody Fisher",        orderId: "YO0090-GHI", productName: "Ketchup",                quantity: 8,  orderAmount: "₹ 96",  status: "Delivered" },
      { id: 11, customer: "Jenny Wilson",       orderId: "YO0091-JKL", productName: "Mustard",                quantity: 7,  orderAmount: "₹ 84",  status: "In Transit"},
      { id: 12, customer: "Courtney Henry",     orderId: "YO0092-MNO", productName: "Pickles",                quantity: 5,  orderAmount: "₹ 75",  status: "Pending"   },
      { id: 13, customer: "Esther Howard",      orderId: "YO0093-PQR", productName: "Tortilla Chips",         quantity: 11, orderAmount: "₹ 110", status: "Delivered" },
      { id: 14, customer: "Guy Hawkins",        orderId: "YO0094-STU", productName: "Salsa",                  quantity: 9,  orderAmount: "₹ 135", status: "Delivered" },
      { id: 15, customer: "Leslie Alexander",   orderId: "YO0095-VWX", productName: "Brown Rice",             quantity: 3,  orderAmount: "₹ 90",  status: "Pending"   },
      { id: 16, customer: "Jacob Jones",        orderId: "YO0096-YZA", productName: "Black Beans",            quantity: 4,  orderAmount: "₹ 60",  status: "Delivered" },
      { id: 17, customer: "Theresa Webb",       orderId: "YO0097-BCD", productName: "Pasta Sauce",            quantity: 10, orderAmount: "₹ 200", status: "Delivered" },
      { id: 18, customer: "Arlene McCoy",       orderId: "YO0098-EFG", productName: "Cereal",                 quantity: 6,  orderAmount: "₹ 150", status: "In Transit"},
      { id: 19, customer: "Annette Black",      orderId: "YO0099-HIJ", productName: "Peanut Butter",          quantity: 2,  orderAmount: "₹ 70",  status: "Pending"   },
      { id: 20, customer: "Darlene Robertson",  orderId: "YO0100-KLM", productName: "Jam",                    quantity: 8,  orderAmount: "₹ 160", status: "Delivered" },
    ],
    []
  );

  const processedData = useMemo(() => {
    let result = [...mockData];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.customer.toLowerCase().includes(q) ||
          item.orderId.toLowerCase().includes(q) ||
          item.productName.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        let A = a[sortField];
        let B = b[sortField];
        if (sortField === "quantity") {
          A = Number(A);
          B = Number(B);
        }
        if (A < B) return sortDirection === "asc" ? -1 : 1;
        if (A > B) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [mockData, searchTerm, sortField, sortDirection]);

  // Reset to page 0 whenever filters or sort change
  useEffect(() => setCurrentPage(0), [searchTerm, sortField, sortDirection]);

  const totalItems = processedData.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const start = currentPage * pageSize;
  const end = Math.min(start + pageSize, totalItems);
  const pagedData = useMemo(() => processedData.slice(start, end), [processedData, start, end]);

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

  return (
    <section className="data-table" aria-label="Orders table">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-search" role="search">
          <svg className="icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
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
            aria-label="Search by customer, order id, product or status"
          />
        </div>
        <div className="table-actions" />
      </div>

      {/* Table */}
      <table>
        <thead className="table-header">
          <tr>
            <th onClick={() => handleSort("id")}>
              Sr No.
              {sortField === "id" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
            <th onClick={() => handleSort("customer")}>
              Customer
              {sortField === "customer" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
            <th onClick={() => handleSort("orderId")}>
              Order ID
              {sortField === "orderId" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
            <th onClick={() => handleSort("productName")}>
              Product Name
              {sortField === "productName" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
            <th onClick={() => handleSort("quantity")}>
              Order Qty
              {sortField === "quantity" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
            <th onClick={() => handleSort("orderAmount")}>
              Order Amount
              {sortField === "orderAmount" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
            <th onClick={() => handleSort("status")}>
              Status
              {sortField === "status" && (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
          </tr>
        </thead>

        <tbody>
          {pagedData.length ? (
            pagedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.customer}</td>
                <td>{item.orderId}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.orderAmount}</td>
                <td><span>{item.status}</span></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="table-pagination" role="navigation" aria-label="Pagination">
        <div className="page-size">
          <span className="muted">Rows:</span>
          <strong>10</strong>
          <span className="range">
            • Showing {totalItems === 0 ? 0 : start + 1}–{end} of {totalItems}
          </span>
        </div>

        <div className="nav">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="btn"
            aria-label="Previous page"
            title="Previous page"
          >
            <FiChevronLeft />
          </button>

          <span className="range" aria-live="polite" style={{ padding: "0 8px" }}>
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className="btn"
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
