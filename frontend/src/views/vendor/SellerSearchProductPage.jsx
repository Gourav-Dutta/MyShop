import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllBrandsQuery,
  useLazyGetProductsBySearchQuery,
  useGetSellerProductQuery,
  useDeleteProductMutation
} from "../../context/slice/productSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";

export function SellerSearchProductPage() {
  const { Search_Item } = useParams();
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");

  // Fetch products for seller
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
    error: productErr,
  } = useGetSellerProductQuery({ q: Search_Item });
  const [deleteProduct] = useDeleteProductMutation();

  // Brands query
  const {
    data: brandsData,
    isLoading: brandsLoading,
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
        Failed to fetch products: {productErr?.data?.message || "Something went wrong"}
      </p>
    );
  }

  const handleDeleteProduct = async (productId) => {
      try{
        await deleteProduct({productId: productId});
        toast.success("Product deleted");
      }catch(err){
        console.log(err.message);
        toast.fail("Failed to delete product");
      }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <button
          onClick={() => navigate("/seller/addProduct")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Sidebar (Brand Filter) */}
        <aside className="md:col-span-1 bg-white rounded-xl shadow p-4 h-fit ">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Filter by Brand</h2>
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-2">
              <li
                className={`cursor-pointer px-3 py-2 rounded-md ${
                  selectedBrand === ""
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setSelectedBrand("");
                  triggerBrandQuery({ q: Search_Item });
                }}
              >
                All Brands
              </li>

              {brands.map((brand) => (
                <li
                  key={brand.id}
                  className={`cursor-pointer px-3 py-2 rounded-md ${
                    selectedBrand === brand.name
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedBrand(brand.name);
                    triggerBrandQuery({ q: Search_Item, brand: brand.name });
                  }}
                >
                  {brand.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Seller Product Table */}
        <div className="md:col-span-3 lg:col-span-4">
          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={product.base_image}
                          alt={product.name}
                          className="h-12 w-12 rounded object-contain border"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3">{product.brand?.name || "-"}</td>
                      <td className="px-4 py-3">{product.sub_category?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            product.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/seller/layout/update/product/${product.id}`)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => navigate(`/seller/layout/productVeriety/${product.id}`)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          Veriety
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
