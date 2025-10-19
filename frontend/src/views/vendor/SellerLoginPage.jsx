import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../context/slice/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export function SellerLoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation
  const ValidationError = () => {
    if (!email.includes("@")) return "Enter a valid Email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCAL_API
      : import.meta.env.VITE_PROD_API;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errorValidate = ValidationError();
    if (errorValidate) {
      setError(errorValidate);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, {
        email,
        password,
      });

      // Save token + user in redux
      dispatch(login({ token: response.data.token, user: response.data.data }));
      console.log("The role is: ", response);
      if (response.data.data.role == "SELLER") {
        navigate("/seller/layout/sellerDashboard");
      } else {
        // Redirect to homepage
        navigate("/homepage");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid email or password");
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Login to your account 
        </h1>

        {error && (
          <p className="text-red-700 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium transition ${
            loading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {loading && (
          <p className="text-center text-sm text-gray-500">
            Please wait, logging in...
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Not Registered?{" "}
          <Link to="/auth/seller/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
