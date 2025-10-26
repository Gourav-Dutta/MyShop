import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductDetailsByProductIdQuery,
  useUpdateProductMutation,
} from "../../context/slice/productSlice";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerUpdateProductPage = () => {
  const { productId } = useParams();
  const { data, isLoading, isError } = useGetProductDetailsByProductIdQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name,
        description: data.data.description,
        status: data.data.status,
      });
      setPreviewUrl(data.data.base_image);
    }
  }, [data]);

  // handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("status", formData.status);

      if (selectedFile) {
        payload.append("base_image", selectedFile);
      }

      await updateProduct({ productId, formData: payload }).unwrap();
      toast.success("Product updated successfully!");
      navigate("/seller/layout/sellerDashboard");
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update product!");
    }
  };

  if (isLoading) return <ProductPageLoader />;
  if (isError) return <p className="text-center text-red-500">Failed to load product.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Update Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload New Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-md p-2"
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="h-40 rounded-lg border shadow object-cover"
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};
