import {
  useGetUserProfileQuery,
  useUpdateAddIs_PrimaryMutation,
} from "../context/slice/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProductPageLoader } from "./ProductPageLoader";
export const MyProfile = () => {
  const { data, isLoading, isError, error } = useGetUserProfileQuery();
  const [updateAddIs_Primary] = useUpdateAddIs_PrimaryMutation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      navigate("/auth/requestLogin");
    }
  }, [navigate]);

  const user = data?.data;
  // console.log(user);

  const handleMakePrimary = async ({ addId, is_primary }) => {
    // console.log("Handle Make Primary Called");
    updateAddIs_Primary({ addId: addId, is_primary: is_primary });
  };
  if (isLoading) return <ProductPageLoader/>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">My Profile</h2>

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Phone:</span> {user.phone_no}
          </p>
        </div>
      </div>

      {/* Update Button */}
      <div className="text-right">
        <Link to="/update/profile">
          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            Update Profile
          </button>
        </Link>
      </div>

      {/* Addresses */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Addresses</h3>

        <div className="mb-6">
          <Link to="/new/address">
            <button
              className="
        px-5 py-2 
        bg-blue-600 
        text-white 
        text-sm 
        font-semibold 
        rounded-lg 
        shadow 
        hover:bg-blue-700 
        focus:ring-2 
        focus:ring-blue-400 
        focus:outline-none 
        transition
      "
            >
              ➕ Add Address
            </button>
          </Link>
        </div>

        {user.address.length === 0 ? (
          <p className="text-gray-500">No addresses found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {user.address.map((addr) => (
              <div key={addr.id} className="flex flex-col justify-between">
                <div
                  className={`relative p-4 rounded-lg shadow-md border ${
                    addr.is_primary
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="absolute top-3 right-3 flex items-center">
                    <button
                      onClick={() =>
                        handleMakePrimary({
                          addId: addr.id,
                          is_primary: true,
                        })
                      }
                      className="w-5 h-5 rounded-full border border-black flex items-center justify-center"
                      title={
                        addr.is_primary ? "Primary address" : "Make primary"
                      }
                    >
                      {/* Inner circle */}
                      <div
                        className={`w-3 h-3 rounded-full transition ${
                          addr.is_primary ? "bg-blue-600" : "bg-white"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Label if primary */}
                  {addr.is_primary && (
                    <span className="ml-8 text-sm text-blue-600 font-semibold">
                      Primary
                    </span>
                  )}

                  {/* Address Details */}
                  <p className="text-gray-800">
                    <span className="font-semibold">House No:</span>{" "}
                    {addr.house_no}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">City:</span> {addr.city}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">State:</span> {addr.state}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">PIN:</span> {addr.pin_no}
                  </p>
                </div>

                {/* Update Button */}
                <div className="mt-2 text-right">
                  <Link to={`/update/address/${addr.id}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition">
                      Update Address
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
