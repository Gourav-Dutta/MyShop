import { Router } from "express";
import { SignUpFunction,
         userLoginFunction
       } from "../controllers/auth.controller.js";


const router = Router();




router
.post("/user/register", SignUpFunction)
.post("/user/login", userLoginFunction);




export {
    router as authRouter
}