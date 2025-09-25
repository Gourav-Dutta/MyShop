import { useGetProductOfLoginSellerQuery } from "../../context/slice/productSlice";


export const SellerProduct = () => {
  const { data, isLoading, isError } = useGetProductOfLoginSellerQuery();

  if (isLoading) return <p className="text-center mt-10">Loading products...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">Failed to fetch products.</p>;

  const products = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">📦 My Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-600">You have not listed any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden h-100 relative"
            >
              {/* Product Image */}
              <img
                src={product.base_image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="h-48 w-full object-cover"
              />

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>

                {/* Status & Dates */}
                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-17 mt-5 flex-row absolute bottom-3">
                  <button className="w-36 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl">
                    Edit
                  </button>
                  <button className="w-36 bg-red-600 hover:bg-red-700 text-white rounded-2xl">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
