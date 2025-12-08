import { Router } from "express";
import controller from "./transaction.controller.js";
import { isAuth } from "../../middelwares/auth.middelware.js";

const router = Router();

router.post("/", isAuth, controller.createOne);
router.get("/", isAuth, controller.history);


export default router;
