import { useNavigate } from "react-router-dom";
import {
  useGetUserOrderQuery,
  useDeleteOrderMutation,
} from "../context/slice/productSlice";
import toast from "react-hot-toast";
import { ProductPageLoader } from "./ProductPageLoader";

export function Order() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUserOrderQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const token = localStorage.getItem("ACCESS_TOKEN");
  const user = JSON.parse(localStorage.getItem("USER") || "null");

  if (!token) {
    navigate("/auth/requestLogin");
    return null;
  }

  if (isLoading) return <ProductPageLoader />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong while loading orders.
      </div>
    );

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder({ orderId });
      toast.success("Order Cancled successfully!");
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  const orders = data?.data || [];
//  console.log(orders);
 
  return (
    <div className="flex max-w-7xl mx-auto min-h-screen px-4 py-8">
      
      <aside className="w-64 hidden md:block mr-8">
        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              
            </div>
          </div>
          <nav className="space-y-3">
            <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 font-medium text-gray-700 cursor-pointer">
              🛒 My Orders
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer">
              💳 Payments
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer">
              🏠 Address Book
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer">
              ⚙️ Settings
            </button>
          </nav>
        </div>
      </aside>

     
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

       
        <div className="flex gap-4 mb-6 border-b pb-2">
          <button className="font-semibold text-emerald-600 border-b-2 border-emerald-600 pb-1 cursor-pointer">Upcoming Orders</button>
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer">Previous Orders</button>
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer">Scheduled Orders</button>
        </div>

        {/* Order Cards */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">You don’t have any orders yet.</div>
        ) : (
          <div className="space-y-6">
           {orders.map((order) => {
  const orderDate = new Date(order.order_at);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // ✅ Check if any item is delivered
  const hasDeliveredItem = order.items.some(
    (item) => item.status === "DELIVERED"
  );

  return (
    <div
      key={order.id}
      className="bg-white rounded-xl shadow border p-6 space-y-4"
    >
      {/* Order Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Order #{order.id}
          </h2>
          <p className="text-sm text-gray-500">
            Ordered on: {orderDate.toLocaleDateString()} • Delivery by:{" "}
            <span className="text-gray-800 font-medium">
              {formattedDeliveryDate}
            </span>
          </p>
        </div>

        {/* Buttons Area */}
        <div className="flex gap-2">
          <button className="text-sm px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 cursor-pointer">
            Order Details
          </button>

          {/* Conditional cancel button or message */}
          {hasDeliveredItem ? (
            <span className="text-sm px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed">
              ❌ Cannot cancel — item delivered
            </span>
          ) : (
            <button
              onClick={() => handleDeleteOrder(order.id)}
              className="text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Order Status Tracker */}
      <div className="flex items-center gap-4 mt-2">
        {["Confirmed", "Preparing", "Picked up", "Delivered"].map(
          (stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  index <= 1 ? "bg-emerald-500" : "bg-gray-300"
                }`}
              ></div>
              <p
                className={`text-xs ${
                  index <= 1 ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {stage}
              </p>
              {index < 3 && <div className="w-6 h-px bg-gray-300"></div>}
            </div>
          )
        )}
      </div>

      {/* Order Items */}
      <div className="text-sm text-gray-600 mt-3 space-y-1">
        <p className="font-medium text-gray-800 mb-1">Items:</p>
        {order.items.map((item) => (
          <div
            key={item.id}
            className={`pl-2 flex items-center gap-2 ${
              item.status === "DELIVERED" ? "text-green-600" : ""
            }`}
          >
            • {item.productVariety?.name || "Unnamed Product"} x {item.quantity}{" "}
            <span className="text-xs text-gray-500">[{item.status}]</span>
          </div>
        ))}
        <p className="mt-2">
          <span className="font-medium">Total: ₹{order.total_price}</span>
        </p>
      </div>
    </div>
  );
})}

          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
