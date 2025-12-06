import { Router } from "express";
import controller from "./auth.controller.js";
import { isAuth } from "../../middelwares/auth.middelware.js";
const router = Router()

router.post("/sign-in" , controller.signIn)
router.post("/sign-up" , controller.signUp)
router.get("/me" , isAuth, controller.me)
router.put("/me" , isAuth, controller.UpdateMyAccount)

export default router