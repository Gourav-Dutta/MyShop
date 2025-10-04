import { useEffect } from "react";
import {
  useGetAllOrderQuery,
  useGetAllUserQuery,
  useGetProductsByCategoryQuery,
} from "../context/slice/productSlice";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const { data: userData, isLoading: userLoading } = useGetAllUserQuery();
  const { data: orderData, isLoading: orderLoading } = useGetAllOrderQuery();
  const { data: productData, isLoading: productLoading } =
    useGetProductsByCategoryQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user?.role?.role !== "ADMIN") {
      navigate("/homepage");
    }
  }, [navigate]);

  if (userLoading || orderLoading || productLoading) {
    return (
      <div className="p-6 text-center text-lg text-blue-600 animate-pulse">
        Loading...
      </div>
    );
  }
  const user = JSON.parse(localStorage.getItem("USER") || "null");

  //Split users into USER and SELLER
  const users = userData?.data?.filter((u) => u.role?.role === "USER") || [];
  const sellers =
    userData?.data?.filter((u) => u.role?.role === "SELLER") || [];

  //  Total order amount
  const totalOrderAmount = orderData?.orders?.reduce(
    (acc, order) => acc + order.total_price,
    0
  );

  return (
    <div className="p-8 space-y-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-gray-600">
        {user?.name}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-center text-white">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 rounded-2xl shadow-lg text-center text-white">
          <h3 className="text-xl font-semibold">Total Sellers</h3>
          <p className="text-3xl font-bold mt-2">{sellers.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-center text-white">
          <h3 className="text-xl font-semibold">Total Order Amount</h3>
          <p className="text-3xl font-bold mt-2">₹{totalOrderAmount}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">📦 All Orders</h3>
        <table className="w-full border-collapse">
          <thead className="bg-indigo-50">
            <tr className="text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orderData?.orders?.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition text-center"
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.user_id}</td>
                <td className="p-3 text-green-600 font-medium">
                  ₹{order.total_price}
                </td>
                <td className="p-3">
                  {new Date(order.order_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          👥 All Users & Sellers
        </h3>
        <table className="w-full border-collapse">
          <thead className="bg-purple-50">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {userData?.data?.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gray-50 transition text-center"
              >
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td
                  className={`p-3 font-semibold ${
                    u.role?.role === "SELLER"
                      ? "text-indigo-600"
                      : "text-gray-700"
                  }`}
                >
                  {u.role?.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          🛒 All Products
        </h3>
        <table className="w-full border-collapse">
          <thead className="bg-green-50">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {productData?.data?.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 transition text-center"
              >
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-gray-600">{p.description}</td>
                <td
                  className={`p-3 font-semibold ${
                    p.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
