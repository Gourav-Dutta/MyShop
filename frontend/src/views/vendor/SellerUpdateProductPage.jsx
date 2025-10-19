import { useParams, useNavigate } from "react-router-dom";
import { useGetProductDetailsByProductIdQuery, useUpdateProductMutation, useGetAllBrandsQuery } from "../../context/slice/productSlice";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerUpdateProductPage = () => {
  const { productId } = useParams();
  const { data, isLoading, isError } = useGetProductDetailsByProductIdQuery(productId);
  
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_image: "",
    brand_id: "",
    sub_catagory_id: "",
    status: "active",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name,
        description: data.data.description,
        base_image: data.data.base_image,
        brand_id: data.data.brand.name,
        sub_catagory_id: data.data.sub_category.name,
        status: data.data.status,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await updateProduct({ productId, formData }).unwrap();
    toast.success("Product updated successfully!");
    navigate(-1);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update product!");
  }
};


  if (isLoading) return <ProductPageLoader/>;
  if (isError) return <p className="text-center text-red-500">Failed to load product.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Update Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
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
            placeholder="Enter product description"
            rows={5}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="base_image"
            value={formData.base_image}
            onChange={handleChange}
            placeholder="Enter image link"
            className="w-full border rounded-md p-2"
          />
          {formData.base_image && (
            <img
              src={formData.base_image}
              alt="Product Preview"
              className="mt-3 h-40 rounded-lg shadow"
            />
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-1">Brand </label>
          <input
            type="text"
            name="brand_id"
            value={formData.brand_id}
            readOnly
            placeholder="Enter brand id"
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Sub Category  */}
        <div>
          <label className="block text-sm font-medium mb-1">Sub Category </label>
          <input
            type="text"
            name="sub_catagory_id"
            value={formData.sub_catagory_id}
            readOnly
            placeholder="Enter sub category id"
            className="w-full border rounded-md p-2"
          />
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
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};
