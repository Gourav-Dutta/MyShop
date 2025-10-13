import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSpecificVarietyDetailsQuery,
  useUpdateProductVarietyMutation
} from "../../context/slice/productSlice";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerUpdateProductVariety = () => {
  const { varietyId } = useParams();
  const { data, isLoading, isError, error } =
    useGetSpecificVarietyDetailsQuery(varietyId);
    // console.log(data);
    
    const [updateProductVariety] = useUpdateProductVarietyMutation();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    color: "",
    size: "",
    weight: "",
    liter: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        sku: data.data.sku || "",
        color: data.data.color || "",
        size: data.data.size || "",
        weight: data.data.weight || "",
        liter: data.data.liter || "",
        price: data.data.price || "",
        stock: data.data.stock || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=   await updateProductVariety({varietyId:varietyId, formData:formData});
      // console.log(res);
      
      toast.success("Product variety updated successfully!");
      navigate(`/seller/layout/productVeriety/${res.data.product.productId}`);
    } catch (err) {
      toast.error("Failed to update product variety");
      console.error(err);
    }
  };

  if (isLoading)
    return <ProductPageLoader/>;
  if (isError)
    return (
      <p className="text-center text-red-500">Error: {error?.message}</p>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Update Product Variety
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Color & Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Weight & Liter */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Liter</label>
            <input
              type="text"
              name="liter"
              value={formData.liter}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Variety
        </button>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
