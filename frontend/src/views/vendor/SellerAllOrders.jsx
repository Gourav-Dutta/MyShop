import { useGetOrderOfSellerQuery } from "../../context/slice/productSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const SellerAllOrders = () => {
  const { data, isLoading, isError, error } = useGetOrderOfSellerQuery();
  console.log(data);
  
  const navigate = useNavigate();

  if (isLoading) return <p className="text-center py-6">Loading orders...</p>;
  if (isError) return <p className="text-center text-red-500">Error: {error?.message}</p>;

  const orders = data?.data || [];

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>

      {/* Empty state */}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ordered At</th>
                <th className="p-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">#{item.order_id}</td>
                  <td className="p-3">{item.productVariety?.name}</td>
                  <td className="p-3">₹{item.price}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-semibold">
                    ₹{Number(item.price) * item.quantity}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : item.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(item.order?.order_at).toLocaleDateString()}
                  </td>
                  <td>
                  <button className="rounded-2xl bg-amber-300 w-30 my-4" onClick={() =>navigate(`/seller/layout/update/order/${item.id}/${item.status}`)}>
                    UPDATE
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
