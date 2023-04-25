import { Router } from "express";
import { getProfile, login, logout, signUp, forgotPassword } from "../controllers/auth.controller";
import {  isLoggedIn } from "../middlewares/auth.middleware";



const router = Router()

router.post("/signup", signUp)
router.post("/login", login)
router.get("/logout", logout)
router.post("/password/forgot", forgotPassword)
router.post("/password/reset/:token", forgotPassword)

router.get("/profile", isLoggedIn, getProfile)


export default router;