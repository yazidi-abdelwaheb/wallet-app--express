import { Router } from "express";
import controller from "./auth.controller.js";
import { isAuth } from "../../middlewares/auth.middleware.js";
const router = Router()

// Public routes
router.post("/sign-in" , controller.signIn)
router.post("/sign-in/opt" , (req,res)=> controller.verifyOTP(req,res,"sign-in"))
router.post("/sign-up" , controller.signUp)
router.post("/sign-up/opt" , (req,res)=> controller.verifyOTP(req,res,"sign-up"))
router.get("/opt/:id", controller.readOpt)


router.post("/forgot-password",controller.forgotPassword)
router.post("/opt/resend-code/:id", controller.resendCode)


// Protected routes for authenticated users
router.get("/me" , isAuth, controller.me)
router.put("/me" , isAuth, controller.UpdateMyAccount)

export default router