import {
  useGetAddToCardQuery,
  useRemoveFromAddToCartMutation,
} from "../context/slice/productSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function Cart() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAddToCardQuery();
  const [removeFromAddToCart] = useRemoveFromAddToCartMutation();
  const products = data?.data || [];
  console.log(products);

  const token = localStorage.getItem("ACCESS_TOKEN");
  if (!token) {
    navigate("/auth/requestLogin"); // ✅ fixed route
    return;
  }

  if (isLoading) return <p className="text-gray-600">Loading cart...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  async function handleRemoveCart({ productVarietyId }) {
    try {
      await removeFromAddToCart({ productVarietyId }).unwrap();
      toast.success("Successfully removed item from your cart.");
    } catch (err) {
      toast.error("Failed to remove item ❌");
      console.error(err);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">Your cart is empty 🛒</p>
      ) : (
        <div className="grid gap-6">
          {products.map((item) => (
            <div key={item.id}>
              <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  <div className="w-24 h-24 bg-gray-200 flex justify-center items-center rounded-lg overflow-hidden">
                    <img
                      src={
                        item.productVariety?.images?.find(
                          (img) => img.is_primary === true
                        )?.url
                      }
                      alt={item.productVariety?.name}
                      className="object-contain max-h-24"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.productVariety?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {item.productVariety?.color} | {item.productVariety?.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      SKU: {item.productVariety?.sku}
                    </p>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                  <p className="text-xl font-bold text-indigo-600">
                    ₹{item.productVariety?.price}
                  </p>
                  <p className="text-gray-700">Qty: {item.quantity}</p>

                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <button
                  onClick={() =>
                    handleRemoveCart({
                      productVarietyId: String(item.productVariety.id),
                    })
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove From Cart
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow p-6 mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Total</h2>
            <p className="text-2xl font-bold text-indigo-600">
              ₹
              {products.reduce(
                (sum, item) => sum + item.productVariety?.price * item.quantity,
                0
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
