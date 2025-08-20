// src/components/DataTable.jsx
const rows = [
  { id: 1, customer: 'Amruta Joshi', orderId: '100086-CBN', product: 'Popcorn seasoning', qty: 19, amount: 60, status: 'Pending' },
  { id: 2, customer: 'Arlene McCoy', orderId: '100086-MRS', product: 'Secret Stadium Sauce', qty: 10, amount: 80, status: 'Delivered' },
  { id: 3, customer: 'Brooklyn Simmons', orderId: '100086-CBN', product: 'White chocolate', qty: 150, amount: 100, status: 'Processing' },
];

export default function DataTable() {
  return (
    <section className="data-table">
      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Customer</th>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Order Qty</th>
            <th>Order Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.customer}</td>
              <td>{r.orderId}</td>
              <td>{r.product}</td>
              <td>{r.qty}</td>
              <td>₹ {r.amount}</td>
              <td><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
