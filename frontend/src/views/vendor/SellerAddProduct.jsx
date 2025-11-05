import {
  useGetAllSubCategoriesQuery,
  useAddNewProductMutation,
  useGetAllBrandsQuery,
} from "../../context/slice/productSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";
import { Navigate, useNavigate } from "react-router-dom";

export const SellerAddProduct = () => {
  const { data, isLoading, isError } = useGetAllSubCategoriesQuery();
  const { data: brandsData, isLoading: brandLoading, isError: brandError } =
    useGetAllBrandsQuery();
  const navigate = useNavigate();

  const [addProduct, { isLoading: addingProduct }] = useAddNewProductMutation();


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sub_catagory_id: "",
    brand: "",
    status: "Active",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("sub_catagory_id", formData.sub_catagory_id);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("image", image); 

    try {
      await addProduct(formDataToSend).unwrap();
      toast.success("Product inserted successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        sub_catagory_id: "",
        brand: "",
        status: "Active",
      });
      setImage(null);
      setPreview(null);
      navigate("/seller/layout/sellerDashboard");
    } catch (err) {
      toast.error("Failed to insert product ❌");
      console.error(err);
    }
  };

  if (isLoading || brandLoading) return <ProductPageLoader />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-gray-100 rounded-xl shadow mt-5">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 mt-3 object-cover rounded-lg border shadow"
            />
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="block font-medium mb-1">Brand</label>
          {brandError ? (
            <p className="text-red-500">Failed to load brands</p>
          ) : (
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Brand --</option>
              {brandsData?.data?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Sub Category */}
        <div>
          <label className="block font-medium mb-1">Sub Category</label>
          {isError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            <select
              name="sub_catagory_id"
              value={formData.sub_catagory_id}
              onChange={handleChange}
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

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {addingProduct  ? "Adding Product..." : "Add Product"}
        </button>
         <button
          type="button"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
