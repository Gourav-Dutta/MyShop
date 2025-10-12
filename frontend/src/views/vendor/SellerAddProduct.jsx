import {
  useGetAllSubCategoriesQuery,
  useAddNewProductMutation,
  useGetAllBrandsQuery,
} from "../../context/slice/productSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerAddProduct = () => {
  const { data, isLoading, isError } = useGetAllSubCategoriesQuery();
  const { data: brandsData, isLoading: brandLoading } = useGetAllBrandsQuery();
  //   console.log("Sub-Categories: ", data);
  //   console.log("Brand data : ", brandsData);

  const [addProduct] = useAddNewProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sub_catagory_id: "",
    base_image: "",
    brand: "",
    status: "Active",
  });
  console.log(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  if (brandLoading) return <ProductPageLoader />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        name: formData.name,
        description: formData.description,
        sub_catagory_id: formData.sub_catagory_id,
        base_image: formData.base_image,
        brand: formData.brand,
        status: formData.status,
      }).unwrap();
      setFormData({
        name: "",
        description: "",
        sub_catagory_id: "",
        base_image: "",
        brand: "",
        status: "Active",
      });
      toast.success("Producted inserted successfully!");
    } catch (err) {
      toast.error("Failed to inserted product ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-gray-200 rounded-xl shadow mt-5">
      <h2 className="text-2xl font-bold mb-6"> Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={formData.description}
            rows="3"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="base_image"
            onChange={handleChange}
            value={formData.base_image}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block font-medium mb-1">Brand</label>
          {isLoading ? (
            <p className="text-gray-500">Loading brands...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load brands</p>
          ) : (
            <select
              name="brand"
              onChange={handleChange}
              value={formData.brand}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Brand Name --</option>
              {brandsData?.data?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            onChange={handleChange}
            value={formData.status}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block font-medium mb-1">Sub Category</label>
          {isLoading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            <select
              name="sub_catagory_id"
              onChange={handleChange}
              value={formData.sub_catagory_id}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Sub Category --</option>
              {data?.data?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};
