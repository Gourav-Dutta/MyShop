import { useState } from "react";
import { useParams } from "react-router-dom";
import { useInsertNewVarietyMutation } from "../../context/slice/productSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const SellerAddProductVeriety = () => {
  const { productId } = useParams();
  const [insertNewVariety, { isLoading }] = useInsertNewVarietyMutation();
  const [formData, setFormData] = useState({
    color: "",
    weight: "",
    size: "",
    liter: "",
    price: "",
    stock: "",
    name: "",
  });
const navigate = useNavigate();
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res =  await insertNewVariety({ productId, ...formData }).unwrap();
      // console.log(res);
      toast.success("Successfully inserted the variety");
      navigate(`/seller/layout/add/productVarietyImage/${res.data.id}`)
      setFormData({
        ...formData,
        color: "",
        weight: "",
        size: "",
        liter: "",
        price: "",
        stock: "",
        name: "",
      });
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to insert new variety");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add Product Variety
        </h1>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {[
            { label: "Name", name: "name", required: true },
            { label: "Color", name: "color" },
            { label: "Weight", name: "weight" },
            { label: "Size", name: "size" },
            { label: "Liter", name: "liter" },
            { label: "Price", name: "price", required: true },
            { label: "Stock", name: "stock", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor={field.name}
              >
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleOnChange}
                placeholder={`Enter ${field.label}`}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            </div>
          ))}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? "Saving..." : "Save Variety"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
