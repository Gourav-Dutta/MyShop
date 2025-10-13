import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAddOnaddIdQuery,
  useUpdateAddressMutation,
} from "../context/slice/productSlice";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProductPageLoader } from "./ProductPageLoader";

export const UpdateAddress = () => {
  const { addId } = useParams();
  const navigate = useNavigate();

 
  const { data, isLoading, isError, error } = useGetAddOnaddIdQuery(addId);
  const [updateAddress] = useUpdateAddressMutation();

  
  const [formData, setFormData] = useState({
    house_no: "",
    city: "",
    state: "",
    pin_no: "",
  });

  
  useEffect(() => {
    if (data?.data?.length) {
      const addr = data.data[0];
      setFormData({
        house_no: addr.house_no,
        city: addr.city,
        state: addr.state,
        pin_no: addr.pin_no,
      });
    }
  }, [data]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      updateAddress({
        addId,
        house_no: formData.house_no,
        city: formData.city,
        state: formData.state,
        pin_no: formData.pin_no,
      });
      // console.log("Updated Data to send:", formData);
      toast.success("Successfully update address");
      navigate("/myProfile");
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to update address ❌");
    }
  };

  if (isLoading)
    return <ProductPageLoader/>;

  if (isError)
    return (
      <p className="text-red-500 text-center mt-10">
        Error: {error?.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Update Address
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
      >
        {/* House No */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            House No
          </label>
          <input
            type="text"
            name="house_no"
            value={formData.house_no}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* State */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* PIN */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">PIN</label>
          <input
            type="text"
            name="pin_no"
            value={formData.pin_no}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
