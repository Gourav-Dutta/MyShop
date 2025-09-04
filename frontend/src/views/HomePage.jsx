import { useEffect, useState } from "react";
import { getAuthSelector } from "../context/slice/authSlice"
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

export function HomePage(){
  const auth = useSelector(getAuthSelector);
  const [mainCategory, setMainCategory] = useState({});
  const Categories = ["Electronics", "Cloths"];
  console.log("Products : ", mainCategory);
  
        useEffect(  () => {
            async function fetchProducts(){
              try{
                for (const cat of Categories){
                  // console.log(cat);
                   if(mainCategory[cat]) continue;
                const products =  await axios.get(`http://127.0.0.1:8000/api/product/main_category/${cat}`);
                // console.log(products);
                // setProducts(products.data.data);
                setMainCategory( (prev) => {
                  return { ...prev, [cat] : products.data.data}
                })

                }
                

              }catch(err){
                if(err.response && err.response.data){
                  console.log(err.response.data.message || "Error fetching products");
                  
                }else{
                  console.log("Server error");
                  
                }
              }
              
            }

            fetchProducts(); 
          },[])  
  
  
    return (
      <div className="p-4">
      {Categories.map((category) => (
        <div
          key={category}
          className="bg-gray-100 w-full rounded-xl shadow-md mb-8 p-4"
        >
          <h2 className="text-2xl text-gray-800 font-bold mb-4">{category}</h2>
          <ul className="flex flex-row flex-wrap gap-4 justify-evenly">
            {mainCategory[category]?.length > 0 ? (
              mainCategory[category].map((product) => (
                <li
                  key={product.id}
                  className="bg-gray-100 flex flex-col justify-center items-center text-center w-52 p-2 rounded-lg shadow"
                >
                  <Link  to={`/default/product/${product.id}`}>
                  <div className="w-40 h-50 bg-white flex justify-center items-center rounded mb-2">
                    <img
                      src={product.base_image}
                      alt={product.name}
                      className="max-w-36 max-h-36 object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-black mt-2 truncate">
                    {product.name}
                  </h3>
                  
                  </Link>
                </li> 
              ))
            ) : (
              <p className="text-black">No products available</p>
            )}
          </ul>
        </div>
      ))}
    </div>
    )
}