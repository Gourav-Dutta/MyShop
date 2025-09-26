import { useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { getAuthSelector, logout } from "../context/slice/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export function SellerLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(getAuthSelector);
  const [open, setOpen] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    const storedUser = localStorage.getItem("USER");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token) {
      navigate("/auth/login");
    } else {
      if (user?.role?.role !== "SELLER") {
        navigate("/homepage");
      }
    }
  }, [navigate]);

  function handleProductSearch(searchItem) {
    navigate(`/seller/layout/seller/products/${searchItem}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/seller/layout/sellerDashboard")}
          className="text-3xl font-bold text-blue-600 cursor-pointer"
        >
          MyShop Seller
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[350px]"
          onChange={(e) => setSearchItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleProductSearch(searchItem);
            }
          }}
        />

        {/* Nav Links */}
        <div className="flex space-x-6 text-lg font-medium">
          <Link
            to="/seller/layout/sellerDashboard"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Dashboard
          </Link>
          <Link
            to="/seller/layout/product"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Products
          </Link>
          <Link
            to="/seller/orders"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Orders
          </Link>
          <Link
            to="/seller/analytics"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Analytics
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative inline-block text-left">
          {auth.token ? (
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 px-3 py-2  rounded-full hover:bg-gray-300"
              >
                <span className="font-medium text-lg">
                  {auth.user?.name || "Seller"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <ul className="py-2 text-sm">
                    <li>
                      <Link
                        to="/seller/profile"
                        className="block px-4 py-2 hover:bg-gray-100 text-xl font-normal"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/seller/payouts"
                        className="block px-4 py-2 hover:bg-gray-100 text-xl font-normal"
                      >
                        Payouts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/seller/settings"
                        className="block px-4 py-2 hover:bg-gray-100 text-xl font-normal"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-xl font-medium"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Seller Support */}
          <div>
            <h2 className="text-lg font-semibold mb-4">SELLER SUPPORT</h2>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Payout Queries
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Shipping Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Growth Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">GROW WITH US</h2>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Seller University
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Advertising
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Business Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h2 className="text-lg font-semibold mb-4">POLICIES</h2>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4">CONTACT</h2>
            <p className="text-gray-400">support@myshop.com</p>
            <p className="text-gray-400">+91 98765 43210</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-900 py-4">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} MyShop Seller. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
