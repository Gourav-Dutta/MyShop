import { useGetProductsByCategoryQuery } from "../context/slice/productSlice";
import { Link } from "react-router-dom";
import { ProductPageLoader } from "./ProductPageLoader";

export const AllProductPage = () => {
  const { data, isLoading, isError } = useGetProductsByCategoryQuery();

  if (isLoading) return <ProductPageLoader/>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load products</p>;

  const products = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center bg-white shadow rounded-lg p-4  hover:shadow-md transition"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={product.base_image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="ml-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center space-x-6">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-auto flex flex-col space-y-2">
                <Link
                  to={`/product/${product.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  View More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
