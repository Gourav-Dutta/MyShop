import {Router} from 'express';
import { getOneUserFunction,
         getAllUsers,
         updateUser,
         deleteUser,
         getUserUsingRole,
         getUser_RoleFromUserId
        } from '../controllers/user.controller.js';
import { authMiddleware,
         adminMiddleware
       } from '../middleware/auth.js';
const router =  Router();



router
.get("/user/all", authMiddleware, adminMiddleware, getAllUsers )
.get("/user/one", authMiddleware, getOneUserFunction )
.get("/user/userRole/:id", authMiddleware,adminMiddleware,  getUser_RoleFromUserId)
.get("/user/:role" , authMiddleware, adminMiddleware, getUserUsingRole)
.patch("/user/update", authMiddleware,  updateUser)
.delete("/user/:id", authMiddleware,  deleteUser)

export {router as userRouter}