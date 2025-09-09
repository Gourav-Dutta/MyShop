import { Link } from "react-router-dom";

export function LoginRequest() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-100 p-6 rounded-2xl shadow-md">
      <p className="text-lg font-medium text-gray-700 mb-4">
        🚫 You need to log in to access this resource!
      </p>
      <Link
        to="/auth/login"
        className="bg-amber-500 text-white px-6 py-2 rounded-xl shadow hover:bg-amber-600 transition"
      >
        Login here
      </Link>
    </div>
  );
}
