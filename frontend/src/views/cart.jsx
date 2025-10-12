import {
  useGetAddToCardQuery,
  useRemoveFromAddToCartMutation,
  useAddOrderMutation,
} from "../context/slice/productSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ProductPageLoader } from "./ProductPageLoader";

export function Cart() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAddToCardQuery();
  const [removeFromAddToCart] = useRemoveFromAddToCartMutation();
  const [addOrder, { isLoading: isPlacingOrder }] = useAddOrderMutation();
  const products = data?.data || [];

  const token = localStorage.getItem("ACCESS_TOKEN");
  if (!token) {
    navigate("/auth/requestLogin");
    return;
  }

  if(isLoading) return <ProductPageLoader/>;


  async function handlePlaceOrder() {
    if (products.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderData = {
      items: products.map((item) => ({
        productVariety_id: String(item.productVariety.id),
        price: String(item.productVariety.price),
        quantity: String(item.quantity),
      })),
    };

    try {
      await addOrder(orderData).unwrap();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order ❌");
    }
  }

  async function handleRemoveCart({ productVarietyId }) {
    try {
      await removeFromAddToCart({ productVarietyId }).unwrap();
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error("Failed to remove item ❌");
      console.error(err);
    }
  }

  const totalPrice = products.reduce(
    (sum, item) => sum + item.productVariety?.price * item.quantity,
    0
  );
  const shippingCost = 50;

  return (
    <div className="bg-gray-100 py-10 px-4 md:px-20 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>

          {products.length === 0 ? (
            <p className="text-gray-600">Your cart is empty 🛒</p>
          ) : (
            products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={
                        item.productVariety?.images?.find((img) => img.is_primary)?.url
                      }
                      alt={item.productVariety?.name}
                      className="object-contain h-full w-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.productVariety?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {item.productVariety?.color} | {item.productVariety?.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      SKU: {item.productVariety?.sku}
                    </p>
                    <button
                      onClick={() =>
                        handleRemoveCart({
                          productVarietyId: String(item.productVariety.id),
                        })
                      }
                      className="text-red-500 text-sm mt-1 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-indigo-600 font-bold text-lg">
                    ₹{item.productVariety?.price}
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Items ({products.length})</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingCost}</span>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="promo" className="font-medium text-gray-600">
                Promo Code
              </label>
              <input
                id="promo"
                type="text"
                placeholder="Enter your code"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
              <button className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">
                Apply
              </button>
            </div>

            <div className="border-t pt-4 mt-4 font-bold text-lg flex justify-between">
              <span>Total Cost</span>
              <span>₹{totalPrice + shippingCost}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
          >
            {isPlacingOrder ? "Placing Order..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
