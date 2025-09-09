import { useParams } from "react-router-dom";
import {
  useAddToCartMutation,
  useGetProductVerityBtProductIdQuery,
} from "../context/slice/productSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductVerityBtProductIdQuery(id);
  const [addToCart] = useAddToCartMutation();
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  console.log(data);
  const navigate = useNavigate();

  if (isLoading) return <p className="text-center">...loading</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const varieties = data?.data || [];
  const currentVariety = selectedVariety || varieties[0]; // Initially the first index of varieties is current variety , but when we use setSelectedVariety then this selected variety is become current variety

  // pick primary image
  const primaryImage =
    previewImg ||
    currentVariety?.images?.find((img) => img.is_primary)?.url ||
    currentVariety?.images?.[0]?.url;

  // const primaryImage = previewImg || currentVariety?.images?.find( (img) => img.is_primary === true);
  // // console.log(primaryImage);

  // Calculate Offer price
  const price = currentVariety?.price;
  const offers = currentVariety?.product?.product_offers || [];

  let bestDiscountedPrice = price;
  let bestOffer = null;

  offers.forEach((offer) => {
    const { discount_type, discount_value, is_active } = offer.offer;
    if (is_active === false) return;

    let discountedPrice = price;

    if (discount_type === "percentage") {
      discountedPrice = Math.round(
        price - (price * Number(discount_value)) / 100
      );
    } else if (discount_type === "flat") {
      discountedPrice = Math.max(0, price - Number(discount_value));
    }

    if (discountedPrice < bestDiscountedPrice) {
      bestDiscountedPrice = discountedPrice;
      bestOffer = offer.offer;
    }
  });

  // Add-To-Card Functionality :
  async function handleAdd({ productVarietyId, quantity }) {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      navigate("/auth/requestLogin");
      return;
    }

    await addToCart({
      productVarietyId: productVarietyId,
      quantity: quantity,
    });

    toast.success("Item added to your cart 🎉");
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={primaryImage}
            alt={currentVariety?.name}
            className="w-full max-h-[400px] object-contain rounded-lg shadow-md mt-25"
          />

          {/* Thumbnail images */}
          <div className="flex gap-2 mt-4">
            {currentVariety?.images?.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={img.alt_text}
                onClick={() => setPreviewImg(img.url)} // Setting image to previewImg
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  previewImg === img.url
                    ? "border-amber-400"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentVariety?.name}</h1>
            {/*price */}
            <div className="flex items-center gap-3 mb-2">
              {bestOffer ? (
                <>
                  {/* Original price with strikethrough */}
                  <p className="text-xl text-gray-500 line-through">₹{price}</p>

                  {/* Best discounted price */}
                  <p className="text-2xl text-green-600 font-semibold">
                    ₹{bestDiscountedPrice}
                  </p>

                  {/* Show offer label */}
                  <span className="text-sm text-red-500 font-medium">
                    {bestOffer.discount_type === "percentage"
                      ? `${bestOffer.discount_value}% OFF`
                      : `Save ₹${bestOffer.discount_value}`}
                  </span>
                </>
              ) : (
                <p className="text-2xl text-green-600 font-semibold">
                  ₹{price}
                </p>
              )}
            </div>

            {/* Show all available offers */}
            {offers.length > 0 && (
              <div className="mt-3">
                <p className="text-black text-lg font-semibold">
                  Available Offers
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  {offers.map((firstOffer) => (
                    <li
                      key={firstOffer.id}
                      className="font-medium text-gray-500"
                    >
                      {firstOffer.offer.discount_type === "percentage"
                        ? `${firstOffer.offer.discount_value}% OFF`
                        : `Flat ₹${firstOffer.offer.discount_value} OFF`}{" "}
                      - {firstOffer.offer.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-gray-600 mb-3 mt-3">
              SKU: {currentVariety?.sku} | Size: {currentVariety?.size}
            </p>
            <p className="text-gray-800 mb-4">Color: {currentVariety?.color}</p>

            {/* description */}
            <p className="text-gray-800 text-xl font-medium">
              {currentVariety.product?.description}
            </p>

            {/* Stock info */}
            <p
              className={`mb-4 ${
                currentVariety?.stock > 0
                  ? "text-green-500"
                  : "text-red-500 font-semibold"
              }`}
            >
              {currentVariety?.stock > 0
                ? `${currentVariety?.stock} in stock`
                : "Out of stock"}
            </p>

            {/* Varieties Selection */}
            <div className="mb-4">
              <p className="font-medium mb-2">Choose Variety:</p>
              <div className="flex gap-2">
                {varieties.map((verity) => (
                  <button
                    key={verity.id}
                    onClick={() => {
                      setSelectedVariety(verity);
                      setPreviewImg(null);
                    }}
                    className={`px-4 py-2 border rounded-lg ${
                      currentVariety.id === verity.id
                        ? "bg-amber-300 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {verity.color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 bg-amber-400 text-white text-xl py-3 rounded-2xl shadow hover:bg-amber-500"
              onClick={() =>
                handleAdd({
                  productVarietyId: String(currentVariety.id),
                  quantity: String(1),
                })
              }
            >
              Add To Cart
            </button>
            <button className="flex-1 bg-red-400 text-white text-xl py-3 rounded-2xl shadow hover:bg-red-500">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
