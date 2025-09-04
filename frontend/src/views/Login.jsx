import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import {useAuthContext} from '../context/ContextProvider';
import { login } from "../context/slice/authSlice";
import {useDispatch} from 'react-redux';
import axios from "axios";

export function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
   // Defining  State
    const [email, setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // const {login, setUser, token, user} = useAuthContext();    
    

    // Validation Check : 
    const ValidationError = () => {
        if(!email.includes("@")) return "Enter a valid Email";
        if(password.length < 6) return "Password must be at-least 6 character"
        return null;
    }
    
    // Creating Payload
    const payload = {email, password};

    
    // Function on Onsubmit
    const handleSubmit = async (e) => {
         e.preventDefault();
         setError("");
        
        const errorValidate = ValidationError();
        if(errorValidate){
           setError(ValidationError)
           return ;
        }

        setLoading(true);

        try{

            const response = await axios.post("http://127.0.0.1:8000/api/user/login", payload);

            console.log(response.data.token);
            dispatch(login({ token :response.data.token, user : response.data.data.name}));
            // setUser(response.data.data.name);
            // console.log(token);  
            // console.log(user.role.role);
            // console.log(response); 
            // console.log(response.data.data);
            // console.log("Let's go");
            navigate("/default/homepage");
        }catch(err){

            if(err.response && err.response.data){
                setError(err.response.data.message || "Envalid Email address or password");
            }else{
                setError("Server error")
            }
        }finally{
            setLoading(false)
        }
    }
  
  return (
     <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h1 className="text-xl font-semibold text-center text-gray-800">
            Login to your account
          </h1>
          
          {error &&( 
           <p className="text-red-700 text-sm mb-4 text-center ">{error}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            onChange={ (e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={ (e) => setPassword(e.target.value)}
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
          
          { loading ? "Please wait to log in ..." : null}

          <p className="text-center text-sm text-gray-600">
            Not Registered?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
  )
}