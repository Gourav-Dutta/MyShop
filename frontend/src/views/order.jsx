import { useNavigate } from "react-router-dom";
import {
  useGetUserOrderQuery,
  useDeleteOrderMutation,
} from "../context/slice/productSlice";
import toast from "react-hot-toast";

export function Order() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUserOrderQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const token = localStorage.getItem("ACCESS_TOKEN");

  if (!token) {
    navigate("/auth/requestLogin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong while loading orders.
      </div>
    );
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder({ orderId: orderId });
      toast.success("Successfully deleted your order");
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to delete order");
    }
  };

  const orders = data?.data || [];
  console.log("Orders:", JSON.stringify(orders, null, 2));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          You don’t have any orders yet.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-2xl mb-8 overflow-hidden"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                🗑 Delete Order
              </button>
            </div>
            {/* Order Summary */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700">
                    Ordered on: {new Date(order.order_at).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    Total: ₹{order.total_price}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Item #</th>
                    <th className="py-2 px-4 border-b text-left">Product</th>
                    <th className="py-2 px-4 border-b text-left">Price</th>
                    <th className="py-2 px-4 border-b text-left">Quantity</th>
                    <th className="py-2 px-4 border-b text-left">Subtotal</th>
                    <th className="py-2 px-4 border-b text-left">
                      Item Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        {item.productVariety?.name || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">₹{item.price}</td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`capitalize px-2 py-1 rounded-md text-white ${
                            item.status === "PENDING"
                              ? "bg-yellow-500"
                              : item.status === "DELIVERED"
                              ? "bg-green-500"
                              : item.status === "REJECTED"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
