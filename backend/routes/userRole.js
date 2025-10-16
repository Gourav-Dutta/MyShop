import { Router } from "express";
import {UserRoleInsert} from "../controllers/userRole.controller.js"

const router = Router();


router.post("/userRole", UserRoleInsert)


export { router as UserRoleRouter}