import { useParams } from "react-router-dom";
import {
  useAddToCartMutation,
  useGetProductVerityBtProductIdQuery,
  useAddOrderMutation,
} from "../context/slice/productSlice";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProductPageLoader } from "./ProductPageLoader";

export function ProductPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductVerityBtProductIdQuery(id);
  const [addOrder] = useAddOrderMutation();
  const [addToCart] = useAddToCartMutation();
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();



  const varieties = data?.data || [];
  const currentVariety = selectedVariety || varieties[0] || {};

  // pick primary image
  const primaryImage =
    previewImg ||
    currentVariety?.images?.find((img) => img.is_primary)?.url ||
    currentVariety?.images?.[0]?.url ||
    currentVariety?.product?.base_image ||
    "/placeholder.png";

  // Calculate Offer price 
  const price = Number(currentVariety?.price || 0);
  const offers = currentVariety?.product?.product_offers || [];

  let bestDiscountedPrice = price;
  let bestOffer = null;

  offers.forEach((offer) => {
    const { discount_type, discount_value, is_active } = offer.offer;
    if (is_active === false) return;

    let discountedPrice = price;

    if (discount_type === "percentage") {
      discountedPrice = Math.round(price - (price * Number(discount_value)) / 100);
    } else if (discount_type === "flat") {
      discountedPrice = Math.max(0, price - Number(discount_value));
    }

    if (discountedPrice < bestDiscountedPrice) {
      bestDiscountedPrice = discountedPrice;
      bestOffer = offer.offer;
    }
  });

  // delivery date = today + 7 days
  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const opts = { day: "numeric", month: "long", year: "numeric" };
    return d.toLocaleDateString(undefined, opts);
  }, []);

  if (isLoading) return <ProductPageLoader/>;
  if (error) return <p className="text-red-500 text-center py-10">{error.message}</p>;
  if (data?.message === "No variety found of this product")
    return (
      <p className="text-center text-gray-600 py-10">
        Sorry, we are unable to find this product. Please try again later.
      </p>
    );

  // Add-To-Cart Functionality :
  async function handleAdd({ productVarietyId, quantity }) {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      navigate("/auth/requestLogin");
      return;
    }

    try {
     const res =  await addToCart({
        productVarietyId,
        quantity,
      }).unwrap();
      if (res.Message && res.Message.includes("already added")) {
      toast(res.Message, {
        icon: "🛒",
      });
      return;
    }

    toast.success("Product added to cart 🛍️");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart ❌");
    }
  }

  // To order :
  async function handlePlaceOrder() {
    const orderData = {
      status: "pending",
      items: [
        {
          productVariety_id: String(currentVariety.id),
          price: String(currentVariety.price),
          quantity: String(quantity || 1),
        },
      ],
    };

    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      navigate("/auth/requestLogin");
      return;
    }

    try {
      await addOrder(orderData).unwrap();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Place order error:", err);
      toast.error("Failed to place order ❌");
    }
  }

  // quantity handlers
  function increaseQty() {
    setQuantity((q) => Math.min(q + 1, currentVariety?.stock || 9999));
  }
  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-full bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
            <img
              src={primaryImage}
              alt={currentVariety?.name || currentVariety?.product?.name}
              className="w-full max-h-[420px] object-contain rounded-md"
            />
          </div>

          {/*  images */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {(currentVariety?.images || []).map((img) => (
              <button
                key={img.id}
                onClick={() => setPreviewImg(img.url)}
                className={`w-20 h-20 flex items-center justify-center rounded-lg overflow-hidden border ${
                  previewImg === img.url ? "border-amber-400 ring-2 ring-amber-200" : "border-gray-200"
                }`}
                aria-label={`Preview ${img.alt_text || "image"}`}
              >
                <img src={img.url} alt={img.alt_text || "thumb"} className="w-full h-full object-cover cursor-pointer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              {currentVariety?.name || currentVariety?.product?.name}
            </h1>

            {/* price */}
            <div className="flex items-end gap-4 mb-3">
              {bestOffer ? (
                <>
                  <p className="text-lg text-gray-500 line-through">₹{price.toLocaleString()}</p>
                  <p className="text-3xl text-emerald-600 font-semibold">₹{bestDiscountedPrice.toLocaleString()}</p>
                  <span className="ml-2 inline-block text-sm font-medium text-red-600">
                    {bestOffer.discount_type === "percentage"
                      ? `${bestOffer.discount_value}% OFF`
                      : `Save ₹${bestOffer.discount_value}`}
                  </span>
                </>
              ) : (
                <p className="text-3xl text-emerald-600 font-semibold">₹{price.toLocaleString()}</p>
              )}
            </div>

            {/* SKU / size / color */}
            <p className="text-gray-600 mb-2">
              <span className="font-medium">SKU:</span> {currentVariety?.sku || "N/A"}{" "}
              <span className="mx-2">|</span>
              <span className="font-medium">Size:</span> {currentVariety?.size || "N/A"}{" "}
              <span className="mx-2">|</span>
              <span className="font-medium">Color:</span> {currentVariety?.color || "N/A"}
            </p>

            {/* short description */}
            <p className="text-gray-800 mb-4">{currentVariety?.product?.description || "No description available."}</p>

            {/* Stock */}
            <p
              className={`mb-4 font-medium ${
                Number(currentVariety?.stock) > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {Number(currentVariety?.stock) > 0
                ? `${currentVariety?.stock} in stock`
                : "Out of stock"}
            </p>

            {/* Varieties Selection */}
            {varieties.length > 1 && (
              <div className="mb-4">
                <p className="font-medium mb-2">Choose Variety:</p>
                <div className="flex gap-2 flex-wrap cursor-pointer">
                  {varieties.map((verity) => {
                    const active = currentVariety?.id === verity.id;
                    return (
                      <button
                        key={verity.id}
                        onClick={() => {
                          setSelectedVariety(verity);
                          setPreviewImg(null);
                          setQuantity(1);
                        }}
                        className={`px-4 py-2 border rounded-lg text-sm ${
                          active ? "bg-amber-400 text-white border-amber-400" : "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                        }`}
                      >
                        {verity.color || verity.name || "Variety"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Offers */}
            {offers.length > 0 && (
              <div className="mt-4">
                <p className="text-black text-lg font-semibold mb-2">Available Offers</p>
                <ul className="list-disc list-inside text-gray-700">
                  {offers.map((firstOffer) => (
                    <li key={firstOffer.id} className="font-medium text-gray-600">
                      {firstOffer.offer.discount_type === "percentage"
                        ? `${firstOffer.offer.discount_value}% OFF`
                        : `Flat ₹${firstOffer.offer.discount_value} OFF`}{" "}
                      - {firstOffer.offer.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Quantity */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={decreaseQty}
                  className="px-3 py-2 text-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={currentVariety?.stock || 9999}
                  onChange={(e) => {
                    const v = Math.max(1, Number(e.target.value || 1));
                    const mx = currentVariety?.stock ? Number(currentVariety.stock) : 9999;
                    setQuantity(Math.min(v, mx));
                  }}
                  className="w-16 text-center px-3 py-2 outline-none cursor-pointer"
                />
                <button
                  onClick={increaseQty}
                  className="px-3 py-2 text-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

             
              <button
                className="flex-1 border border-amber-400 text-amber-500 text-lg py-3 rounded-2xl shadow-sm hover:bg-amber-50 cursor-pointer"
                onClick={() =>
                  handleAdd({
                    productVarietyId: String(currentVariety.id),
                    quantity: String(quantity),
                  })
                }
              >
                Add To Cart
              </button>

              
              <button
                className="flex-1 bg-emerald-600 text-white text-lg py-3 rounded-2xl shadow hover:bg-emerald-700 cursor-pointer"
                onClick={handlePlaceOrder}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery info */}
            <p className="text-sm text-gray-600 mb-2">
              🚚 Free delivery by <span className="font-medium text-gray-800">{deliveryDate}</span>
            </p>

           
            <div className="text-sm text-gray-500">
              <span>Sold by: <span className="font-medium text-gray-700">{currentVariety?.product?.brand?.name || "Brand"}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-2">Product Description</h2>
        <div className="h-0.5 w-24 bg-gray-200 mb-4" />
        <p className="text-gray-800 leading-relaxed">
          {currentVariety?.product?.description || "No additional product description available."}
        </p>
      </div>
    </div>
  );
}
