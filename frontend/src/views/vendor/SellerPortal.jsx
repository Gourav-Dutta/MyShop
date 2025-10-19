import {
  useGetSellerOrderDetailsQuery,
  useGetProductOfLoginSellerQuery,
} from "../../context/slice/productSlice";
import { Link } from "react-router-dom";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerPortal = () => {
  const { data, isLoading, isError } = useGetSellerOrderDetailsQuery();
  const { data: productData, isLoading: productLoading } =
    useGetProductOfLoginSellerQuery();
  // console.log(data);
  // console.log(productData);

  if (isLoading) return <ProductPageLoader />;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to fetch orders</p>
    );

  const orders = data?.data || [];
  const products = productData?.data || [];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, item) => acc + parseFloat(item.price),
    0
  );
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome Back, Seller 👋
      </h2>

      {/* Stats Section :: */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-lg font-medium">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-lg font-medium">Revenue</h3>
          <p className="text-3xl font-bold mt-2">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-lg font-medium">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-lg font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link to="/seller/layout/addProduct">
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
            <h4 className="text-xl font-semibold text-blue-700">
              ➕ Add Product
            </h4>

            <p className="text-gray-600 mt-2 text-sm">
              List a new product and expand your catalog.
            </p>
          </div>
        </Link>
        <Link to="/seller/layout/order/All">
          <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
            <h4 className="text-xl font-semibold text-green-700">
              📦 Manage Orders
            </h4>
            <p className="text-gray-600 mt-2 text-sm">
              Track, update, and fulfill customer orders.
            </p>
          </div>
        </Link>
        <div className="bg-amber-50 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
          <h4 className="text-xl font-semibold text-amber-700">
            📊 View Analytics
          </h4>
          <p className="text-gray-600 mt-2 text-sm">
            Monitor your store's performance and growth.
          </p>
        </div>
      </div>

      {/* Recent Orders ::  */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                {/* Left Section */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">
                    Order ID:{" "}
                    <span className="text-gray-700">#{order.order_id}</span>
                  </p>

                  <p className="text-base font-semibold text-gray-800 truncate max-w-[300px]">
                    {order.productVariety?.name || "N/A"}
                  </p>

                  <p className="text-sm text-gray-600">
                    Customer: {order.order?.user?.name || "Unknown"}
                  </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6 mt-3 md:mt-0">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{order.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
