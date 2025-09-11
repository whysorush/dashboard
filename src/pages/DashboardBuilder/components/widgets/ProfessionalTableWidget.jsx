// src/pages/DashboardBuilder/components/widgets/ProfessionalTableWidget.jsx
import React, { useState, useMemo } from "react";
import { FiChevronUp, FiChevronDown, FiSearch } from "react-icons/fi";
import BaseWidget from "./BaseWidget";

const ProfessionalTableWidget = ({ widget, isSelected, onClick }) => {
  const config = widget?.config || {};
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

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
    ],
    []
  );

  const processedData = useMemo(() => {
    let result = [...mockData];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.customer.toLowerCase().includes(lowerSearchTerm) ||
          item.orderId.toLowerCase().includes(lowerSearchTerm) ||
          item.productName.toLowerCase().includes(lowerSearchTerm) ||
          item.status.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (sortField) {
      result.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];
        if (sortField === "quantity") {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [mockData, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadgeClass = (status) => {
    return ""; // removed status badge styling classes
  };

  return (
    <section className="data-table" aria-label="Orders table">
      <div className="table-toolbar">
        <div className="table-search" role="search">
          {/* inline SVG so no extra deps */}
          <svg
            className="icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
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
            aria-label="Search by customer, order id, product or status"
          />
        </div>

        {/* (Optional) place for extra actions, export, filters, etc. */}
        <div className="table-actions" />
      </div>

      <table>
        <thead className="table-header">
          <tr>
            <th onClick={() => handleSort("id")}>
              Sr No.
              {sortField === "id" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>

            <th onClick={() => handleSort("customer")}>
              Customer
              {sortField === "customer" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>

            <th onClick={() => handleSort("orderId")}>
              Order ID
              {sortField === "orderId" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>

            <th onClick={() => handleSort("productName")}>
              Product Name
              {sortField === "productName" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>

            <th onClick={() => handleSort("quantity")}>
              Order Qty
              {sortField === "quantity" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>

            <th onClick={() => handleSort("orderAmount")}>
              Order Amount
              {sortField === "orderAmount" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>

            <th onClick={() => handleSort("status")}>
              Status
              {sortField === "status" &&
                (sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
            </th>
          </tr>
        </thead>
        <tbody>
          {processedData.length > 0 ? (
            processedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.customer}</td>
                <td>{item.orderId}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.orderAmount}</td>
                <td>
                  <span>{item.status}</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default ProfessionalTableWidget;
