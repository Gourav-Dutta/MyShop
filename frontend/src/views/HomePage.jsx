import { Link } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../context/slice/productSlice";

export function HomePage() {
  const { data, isLoading, error } = useGetProductsByCategoryQuery();
  const products = data?.data || [];

  if (isLoading) return <p className="text-gray-600">Loading products...</p>;
  if (error) return <p className="text-red-500">Error loading products</p>;

  const topProducts = products.slice(0, 10);

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="h-72 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl mb-6 flex flex-col justify-center items-center text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
          GRAB THE BEST DEAL NOW!
        </h1>
        <p className="text-lg md:text-xl font-medium text-center">
          Shop at <span className="font-bold">MyShop</span> and save big today!
        </p>
        <Link to={"/allProductPage"}>
        <button className="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow hover:bg-gray-100 transition">
          Start Shopping
        </button>
        </Link>
      </div>

      {/* Top Products */}
      <h2 className="text-2xl text-gray-800 font-bold mb-4">Top Products</h2>
      <ul className="flex gap-4 overflow-x-auto scrollbar-hide p-2 bg-gray-200 rounded-lg">
        {topProducts.map((product) => (
          <li
            key={product.id}
            className="bg-gray-100 flex-shrink-0 flex flex-col justify-between items-center text-center w-48 p-2 rounded-lg shadow overflow-hidden "
          >
            <Link
              to={`/product/${product.id}`}
              className="flex flex-col items-center w-full h-full transform transition-transform hover:scale-105"
            >
              <div className="w-40 h-40 bg-white flex justify-center items-center rounded mb-2 overflow-hidden">
                <img
                  src={product.base_image}
                  alt={product.name}
                  className="max-w-32 max-h-32 object-contain"
                />
              </div>
              <h3 className="text-sm font-semibold text-black mt-2 w-full truncate">
                {product.name}
              </h3>
            </Link>
          </li>
        ))}
      </ul>

      {/* Space before More Products */}
      <div className="my-15"></div>

      {/* More Products */}
      <h2 className="text-2xl text-gray-800 font-bold mb-4">More Products</h2>
      <ul className="grid grid-cols-7 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.id}
              className="bg-gray-100 flex flex-col justify-between items-center text-center p-2 rounded-lg shadow overflow-hidden my-5"
            >
              <Link
                to={`/product/${product.id}`}
                className="flex flex-col items-center w-full h-full transform transition-transform hover:scale-105"
              >
                <div className="w-36 h-36 bg-white flex justify-center items-center rounded mb-2 overflow-hidden">
                  <img
                    src={product.base_image}
                    alt={product.name}
                    className="max-w-28 max-h-28 object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold text-black mt-2 w-full truncate">
                  {product.name}
                </h3>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-black">No more products available</p>
        )}
      </ul>
    </div>
  );
}
