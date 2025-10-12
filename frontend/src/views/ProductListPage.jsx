import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllBrandsQuery,
  useLazyGetProductsBySearchQuery,
  useGetProductsBySearchQuery
} from "../context/slice/productSlice";
import { useState } from "react";
import { ProductPageLoader } from "./ProductPageLoader";

export function ProductListPage() {
  const { Search_Item } = useParams();
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");

  // Products query
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
    error: productErr,
  } = useGetProductsBySearchQuery({q:Search_Item});

  // Brands query
  const {
    data: brandsData,
    isLoading: brandsLoading,
    isError: brandsError,
    error: brandsErr,
  } = useGetAllBrandsQuery();

  const [
    triggerBrandQuery,
    { data: brandProductData, isLoading: brandProductLoading },
  ] = useLazyGetProductsBySearchQuery();

  const products = brandProductData?.data || productData?.data || [];
  const brands = brandsData?.data || [];

  if (productLoading || brandsLoading || brandProductLoading) {
    return <ProductPageLoader/>;
  }

  if (productError) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to fetch products:{" "}
        {productErr?.data?.message || "Something went wrong"}
      </p>
    );
  }

  return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Page heading */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Products
      </h1>
      {selectedBrand && (
        <button
          onClick={() => setSelectedBrand("")}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear Brand Filter
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {/* Sidebar (Brand Filter) */}
      <aside className="md:col-span-1 bg-white rounded-xl shadow p-4 h-fit">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Filter by Brand
        </h2>
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {/* All brands */}
            <li
              className={`cursor-pointer px-3 py-2 rounded-md transition ${
                selectedBrand === ""
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                setSelectedBrand("");
                triggerBrandQuery({
                    q: Search_Item,
                  });
                // revert to main query
              }}
            >
              All Brands
            </li>

            {brands.map((brand) => (
              <li
                key={brand.id}
                className={`cursor-pointer px-3 py-2 rounded-md transition ${
                  selectedBrand === brand.name
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setSelectedBrand(brand.name);
                  triggerBrandQuery({
                    q: Search_Item,
                    brand: brand.name,
                  });
                }}
              >
                {brand.name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="md:col-span-3 lg:col-span-4">
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div className="h-44 flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={product.base_image}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 mt-3">
                  <h3 className="text-md font-semibold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Footer Meta + CTA */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>⭐ 4.3</span>
                  <span>🔥 {Math.floor(Math.random() * 500 + 50)} sold</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

  
}
