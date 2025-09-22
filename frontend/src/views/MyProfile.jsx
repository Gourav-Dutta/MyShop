import React from "react";
import { useGetUserProfileQuery } from "../context/slice/productSlice";

export const MyProfile = () => {
  const { data, isLoading, isError, error } = useGetUserProfileQuery();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  const user = data.data; // user object

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">My Profile</h2>

      {/* User Info */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="text-gray-700"><span className="font-semibold">Phone:</span> {user.phone_no}</p>
        <p className="text-gray-700"><span className="font-semibold">Role:</span> {user.role.role}</p>
      </div>

      {/* Addresses */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Addresses</h3>
        {user.address.length === 0 ? (
          <p className="text-gray-500">No addresses found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {user.address.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-lg shadow-md border ${
                  addr.is_primary ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                }`}
              >
                {addr.is_primary && (
                  <span className="text-sm text-blue-600 font-semibold">Primary</span>
                )}
                <p className="text-gray-800"><span className="font-semibold">House No:</span> {addr.house_no}</p>
                <p className="text-gray-800"><span className="font-semibold">City:</span> {addr.city}</p>
                <p className="text-gray-800"><span className="font-semibold">State:</span> {addr.state}</p>
                <p className="text-gray-800"><span className="font-semibold">PIN:</span> {addr.pin_no}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
