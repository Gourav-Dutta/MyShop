import { useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { getAuthSelector } from "../context/slice/authSlice";
import { logout } from "../context/slice/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function DefaultLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(getAuthSelector);
  const [open, setOpen] = useState(false);
  const [subCategory, setSubCategory] = useState("");
  console.log("your token is : ", localStorage.getItem("ACCESS_TOKEN"));

  function handleProductList(subCategory) {
    navigate(`/productList/${subCategory}`);
  }

  return (
    <div>
      {/* Navbar */}
      <div className="bg-white shadow-md px-4 py-3 flex justify-evenly items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-blue-600">MyShop</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search here..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-3xl"
          onChange={(e)=> setSubCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleProductList(subCategory);
            }
          }}
        />

        {/* Nav Links */}
        <div className="flex space-x-8">
          <Link
            to="/homepage"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Home
          </Link>
          <Link
            to="/cart"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Cart
          </Link>
          <Link
            to="#"
            className="hover:text-blue-500 text-xl font-normal text-shadow-black"
          >
            Become a Seller
          </Link>
        </div>

        <div className="relative inline-block text-left">
          {/* Profile Button */}
          {auth.token ? (
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 px-3 py-2  rounded-full hover:bg-gray-300"
              >
                <span className="font-medium text-xl">
                  {auth.user || "User"}
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${
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

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                  <ul className="py-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 text-xl font-normal"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 text-xl font-normal"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={(e) => dispatch(logout())}
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
              className="px-2 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xl font-medium "
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Outlet (child pages) */}
      <Outlet />

      <footer className="w-full bg-gray-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand + Contact */}
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-4 cursor-pointer">
              MyShop
            </h1>
            <p className="text-gray-300 mb-2 cursor-pointer">Contact Us:</p>
            <p className="text-gray-400 cursor-pointer">
              duttagourav047@gmail.com
            </p>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 cursor-pointer">ABOUT</h2>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  MyShop Stories
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 cursor-pointer">HELP</h2>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Consumer Policy Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 cursor-pointer">
              CONSUMER POLICY
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Security
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-300">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-900 py-4">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} MyShop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
