import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";


dotenv.config();


// console.log("Cloudinary config test:");
// console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API key:", process.env.CLOUDINARY_API_KEY);
// console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


export {cloudinary};