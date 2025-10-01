import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateOrderStatusMutation } from "../../context/slice/productSlice";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const SellerUpdateOrder = () => {
  const { orderId, currentOrderStatus } = useParams();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState(`${currentOrderStatus}`);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderStatus({ orderId, status: orderStatus });
      toast.success("Successfully updated order status");
      navigate("/seller/layout/order/All");
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Update Order #{orderId}
      </h1>

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="PENDING">⏳ Pending</option>
            <option value="REJECTED">❌ Rejected</option>
            <option value="DELIVERED">✅ Delivered</option>
          </select>
        </div>

        {/* Current Status  */}
        <div className="flex items-center gap-2">
          {orderStatus === "PENDING" && (
            <Clock className="text-yellow-500" />
          )}
          {orderStatus === "REJECTED" && (
            <XCircle className="text-red-500" />
          )}
          {orderStatus === "DELIVERED" && (
            <CheckCircle className="text-green-500" />
          )}
          <span className="font-medium text-gray-700">{orderStatus}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
        >
          Update Status
        </button>
      </form>
    </div>
  );
};
