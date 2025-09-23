import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddAddressMutation } from "../context/slice/productSlice";
import toast from "react-hot-toast";

export const AddAddress = () => {
  const [AddAddress] = useAddAddressMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: "",
    house_no: "",
    pin_no: "",
    state: "",
    is_primary: "false",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(formData);

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      console.log("Form Data Submitted:", formData);
      AddAddress({
        city: formData.city,
        house_no: formData.house_no,
        pin_no: formData.pin_no,
        state: formData.state,
        is_primary: formData.is_primary,
      });
      toast.success("Address added successfully!");
      navigate("/myProfile");
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to add new Address ❌");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Add New Address
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4"
      >
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="Enter City"
            onChange={handleChange}
            value={formData.city}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* House No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            House No
          </label>
          <input
            type="text"
            name="house_no"
            placeholder="Enter House No"
            onChange={handleChange}
            value={formData.house_no}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN
          </label>
          <input
            type="text"
            name="pin_no"
            placeholder="Enter PIN"
            onChange={handleChange}
            value={formData.pin_no}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            placeholder="Enter State"
            onChange={handleChange}
            value={formData.state}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Primary Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_primary"
            checked={formData.is_primary === "true"}
            onChange={(e) =>
              setFormData({
                ...formData,
                is_primary: e.target.checked ? "true" : "false",
              })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">
            Set as Primary Address
          </label>
        </div>

      
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};
