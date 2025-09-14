import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllBrandsQuery,
  useGetProductBySubCategoryQuery,
  useLazyGetBrandSpecificProductQuery,
} from "../context/slice/productSlice";
import { useState } from "react";

export function ProductListPage() {
  const { Sub_Category } = useParams();
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");

  // Products query
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
    error: productErr,
  } = useGetProductBySubCategoryQuery(Sub_Category);

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
  ] = useLazyGetBrandSpecificProductQuery();

  const products = brandProductData?.data || productData?.data || [];
  const brands = brandsData?.data || [];

  if (productLoading || brandsLoading || brandProductLoading) {
    return <p className="text-center mt-10 text-xl">Loading products...</p>;
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
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {Sub_Category} Products
      </h1>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white rounded-lg shadow p-5 sticky top-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">Filter by Brand</h2>
          <ul className="space-y-3">
            {brands.map((brand) => (
              <li
                key={brand.id}
                className={`cursor-pointer px-3 py-2 rounded-md border transition ${
                  selectedBrand === brand.name
                    ? "bg-blue-100 text-blue-700 border-blue-400 font-semibold"
                    : "hover:bg-gray-100 text-gray-700 border-transparent"
                }`}
                onClick={() => {
                  setSelectedBrand(brand.name);
                  triggerBrandQuery({
                    subCategoryName: Sub_Category,
                    brandName: brand.name,
                  });
                }}
              >
                {brand.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="col-span-9">
          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* Product Image */}
                  <div className="h-48 flex justify-center items-center bg-gray-50 rounded-md overflow-hidden">
                    <img
                      src={product.base_image}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Footer Meta + CTA */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>⭐ 4.3</span>
                    <span>🔥 {Math.floor(Math.random() * 500 + 50)} sold</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
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
