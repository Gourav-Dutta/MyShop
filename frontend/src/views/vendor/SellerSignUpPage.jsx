import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export function SellerSignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_no, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SELLER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (!email.includes("@")) return "Enter a valid email";
    if (phone_no.length < 10) return "Enter a valid phone number";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const payload = { name, email, phone_no, password, role };

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCAL_API
      : import.meta.env.VITE_PROD_API;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}user/register`,
        payload
      );
      // console.log(response.data);
      toast.success("Registration successful! Please log in.");
      navigate("/auth/seller/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Signup Failed Please Try Again");
      } else {
        setError("Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded shadow-lg animate-fade-in-down">
      <form onSubmit={handleSubmit}>
        <h1 className="title text-2xl font-bold mb-6 text-center text-gray-800">
          Signup as Seller
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Phone No"
          value={phone_no}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>

        {loading ? "Signing Up... " : null}

        <p className="message text-sm mt-4 text-center text-gray-700">
          Already Registered?{" "}
          <Link to="/auth/seller/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
