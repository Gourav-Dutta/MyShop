import {
  useGetProductOfLoginSellerQuery,
  useDeleteProductMutation,
} from "../../context/slice/productSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ProductPageLoader } from "../ProductPageLoader";
export const SellerAllProduct = () => {
  const { data, isLoading, isError } = useGetProductOfLoginSellerQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  if (isLoading)
    return <ProductPageLoader/>;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to fetch products.
      </p>
    );

   const handleDeleteProduct = async (productId) => {
    try {
      const res = await deleteProduct({ productId });
  
      
      if (res?.error) {
        const msg = res.error?.data?.msg || "Failed to delete product";
        toast.error(msg);
        return;
      }
  
     
      if (res?.data?.message) {
        toast.success("✅ Item deleted Successfully");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting the product.");
    }
  };

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
                  <button
                    className="w-36 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                    onClick={() =>
                      navigate(`/seller/layout/update/product/${product.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="w-36 bg-red-600 hover:bg-red-700 text-white rounded-2xl"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
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
