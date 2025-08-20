// src/components/Filters.jsx
export default function Filters() {
  return (
    <section className="filters">
      <div className="filter-group">
        <label>Date Filter</label>
        <div className="date-inputs">
          <input type="date" placeholder="From" />
          <input type="date" placeholder="To" />
        </div>
      </div>

      <div className="filter-group">
        <label>Transaction Amount</label>
        <select>
          <option>0-10K</option>
          <option>10K-50K</option>
          <option>50K+</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Product</label>
        <select>
          <option>All Type</option>
          <option>Manufacturing</option>
          <option>Marketing</option>
          <option>Branding</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select>
          <option>All</option>
          <option>Pending</option>
          <option>Delivered</option>
          <option>Processing</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Order Quantity</label>
        <select>
          <option>1-100</option>
          <option>101-500</option>
          <option>500+</option>
        </select>
      </div>
    </section>
  );
}
