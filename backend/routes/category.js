import Router from 'express';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';
import { newCategoryFunction,
         newSub_CategoryFunction,
         getAllCategoryItem,
         getOneCategoryItem,
         updateCategoryItem,
         deleteCategoryItem,
         getAllSub_CategoryFunction,
         getOneSub_CategoryFunction,
         updateOneSub_CategoryFunction,
         deleteOneSub_CategoryFunction
       } from '../controllers/category.js';


const router = Router();



// main-category routes 
router
.post("/main_category/post", authMiddleware, adminMiddleware,  newCategoryFunction)
.get("/main_category/All", authMiddleware, adminMiddleware, getAllCategoryItem)
.get("/main_category/One/:categoryId", authMiddleware, adminMiddleware, getOneCategoryItem )
.patch("/main_category/update/:categoryId", authMiddleware, adminMiddleware, updateCategoryItem)
.delete("/main_category/delete/:categoryId", authMiddleware, adminMiddleware, deleteCategoryItem)



// sun-category routes
router
.post("/sub_category/post",authMiddleware, adminMiddleware, newSub_CategoryFunction )
.get("/sub_category/All", authMiddleware, adminMiddleware, getAllSub_CategoryFunction)
.get("/sub_category/one/:categoryId", authMiddleware, adminMiddleware,getOneSub_CategoryFunction )
.patch("/sub_category/update/:categoryId", authMiddleware, adminMiddleware, updateOneSub_CategoryFunction)
.delete("/sub_category/delete/:categoryId", authMiddleware, adminMiddleware, deleteOneSub_CategoryFunction )
export { router as categoryRouter}