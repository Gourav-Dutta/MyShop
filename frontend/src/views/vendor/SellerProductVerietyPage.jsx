import { useParams, Link } from "react-router-dom";
import { useGetProductVerityBtProductIdQuery, useDeleteVarietyMutation } from "../../context/slice/productSlice";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";
export const SellerProductVerietyPage = () => {
  const { productId } = useParams();
  const { data, isLoading, isError } =
    useGetProductVerityBtProductIdQuery(productId);
    const [deleteVariety] = useDeleteVarietyMutation();

  const productVariety = data?.data || [];
  
  

  if (isLoading)
    return <ProductPageLoader/>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load product varieties
      </p>
    );

    const handleDeleteVariety =  async (varietyId) => {
        try {
          await deleteVariety({ varietyId: varietyId });
          toast.success("Product variety deleted");
        } catch (err) {
          console.log(err.message);
          toast.fail("Failed to delete variety");
        }
      };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Varieties</h1>
        <Link
          to={`/seller/layout/add/productVeriety/${productId}`}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          + Add Variety
        </Link>
      </div>

      {/* Empty State */}
      {productVariety.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500 mb-4">No product varieties found.</p>
          <Link
            to={`/seller/layout/add/productVeriety/${productId}`}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Add Your First Variety
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {productVariety.map((variety) => (
            <div
              key={variety.id}
              className="flex items-center justify-between bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
            >
              {/* Image + Info */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    variety.images?.[0]?.url 
                  }
                  alt={variety.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {variety.name}
                  </h2>
                  <p className="text-sm text-gray-500">SKU: {variety.sku}</p>
                  <div className="flex gap-3 text-sm text-gray-600 mt-1">
                    <span>Color: {variety.color || "—"}</span>
                    <span>Size: {variety.size || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Stock & Price */}
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  ₹{variety.price}
                </p>
                <p
                  className={`text-sm font-medium ${
                    variety.stock > 10 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {variety.stock > 0
                    ? `Stock: ${variety.stock}`
                    : "Out of Stock"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/seller/layout/update/productVariety/${variety.id}`}
                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDeleteVariety(variety.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
