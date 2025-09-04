import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


export function ProductPage () {
    const {id} = useParams();
    const [product, setProduct] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    console.log(product);
    

    useEffect(() => {
        async function fetchData (){
            try{
                setLoading(true);
                const product = await axios.get(`http://127.0.0.1:8000/api/product/${id}`)
                setProduct(product.data.data);
            }catch(err){
                if(err.response || err.response.data){
                  setError(err.response.data.message || "Failed to get data");
                } else{
                    setError("Server Error");
                }
            }finally{
                setLoading(false)
            }
        }

        fetchData();
    }, [id])
    
    
    if (loading) return <p>...loading</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    return(
        <div>
                <div className="p-4 flex flex-col md:flex-row gap-6 m-18">
                    <div className="w-45 md:w-150 md:h-80 flex justify-center items-center bg-white rounded-lg shadow-md p-4">
                        <img
                        src={product.base_image}
                        alt={product.name}
                        className="max-w-full max-h-80 object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center ml-12">
                        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                        <p className="text-lg text-gray-700 mb-2">₹{product.price}</p>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-black text-2xl mt-4">Available offers</p>
                        <div className="mt-2 flex flex-row">
                           <p className="text-gray-900 mr-1 font-medium ">Bank Offer  </p>
                           <p className="text-gray-700">   5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter .</p>
                        </div>
                      
                        
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <div className="m-4 ">
                        <button className="text-white bg-amber-300 text-2xl p-3 border rounded-2xl">Add To Cart</button>
                    </div>
                    <div className="m-4">
                        <button className="text-white bg-red-300 text-2xl p-3 border rounded-2xl">Buy Now</button>
                    </div>
                </div>
        </div> 
    )
}