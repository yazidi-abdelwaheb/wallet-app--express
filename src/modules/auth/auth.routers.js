import { Router } from "express";
import controller from "./auth.controller.js";
import { isAuth } from "../../middelwares/auth.middelware.js";
const router = Router()

// Public routes
router.post("/sign-in" , controller.signIn)
router.post("/sign-in/otp" , controller.verifyOtpSignIn)
router.post("/sign-up" , controller.signUp)
router.post("/sign-up/otp" , controller.verifyOtpSignUp)
router.get("/otp/:id", controller.readOtp)

// Protected routes for authenticated users
router.get("/me" , isAuth, controller.me)
router.put("/me" , isAuth, controller.UpdateMyAccount)

export default router