import { useGetUserProfileQuery, useUpdateProfileMutation } from "../../context/slice/productSlice";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerUpdateProfilePage = () => {
  const { data, isLoading, isError, error } = useGetUserProfileQuery();
  const [UpdateProfile] = useUpdateProfileMutation();
  const navigate = useNavigate();
  const user = data?.data;

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_no: user.phone_no || "",
      });
    }
  }, [user]);

 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      console.log("Updated data:", formData);
      UpdateProfile(formData);
      toast.success("Profile updated successfully!");
      navigate("/seller/layout/myProfile");
    } catch (err) {
      console.log(`An error occured : ${err.message}`);
      toast.error("Failed to update Profile ❌");
    }
  };

  if (isLoading) return <ProductPageLoader/>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone_no"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.phone_no}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
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
            className="w-48 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
