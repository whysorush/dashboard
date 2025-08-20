// components/OrdersTable.jsx
const orders = [
  {
    id: 1,
    customer: "Amruta Joshi",
    orderId: "100086-CBN",
    product: "Popcorn seasoning",
    qty: 19,
    amount: 60,
    status: "Pending",
  },
  {
    id: 2,
    customer: "Arlene McCoy",
    orderId: "100086-MRS",
    product: "Secret Stadium Sauce",
    qty: 10,
    amount: 80,
    status: "Delivered",
  },
  {
    id: 3,
    customer: "Becci Coner",
    orderId: "100086-CBN",
    product: "White sesame",
    qty: 30,
    amount: 150,
    status: "In Progress",
  },
];

const statusClass = {
  Pending: "bg-yellow-400 text-black",
  Delivered: "bg-green-500 text-white",
  "In Progress": "bg-blue-400 text-white",
};

const OrdersTable = () => {
  return (
    <div className="bg-[#1e293b] p-6 rounded-lg overflow-x-auto">
      <h3 className="text-lg mb-4">Orders</h3>
      <table className="min-w-full text-left text-sm text-white">
        <thead>
          <tr className="text-gray-400 border-b border-gray-600">
            <th className="py-2 px-4">Sr No.</th>
            <th className="py-2 px-4">Customer</th>
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Product Name</th>
            <th className="py-2 px-4">Order Qty</th>
            <th className="py-2 px-4">Order Amount</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-700">
              <td className="py-2 px-4">{o.id}</td>
              <td className="py-2 px-4">{o.customer}</td>
              <td className="py-2 px-4">{o.orderId}</td>
              <td className="py-2 px-4">{o.product}</td>
              <td className="py-2 px-4">{o.qty}</td>
              <td className="py-2 px-4">₹ {o.amount}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded text-xs ${statusClass[o.status]}`}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
