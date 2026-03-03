import { Router } from "express";
import controller from "./transaction.controller.js";

const router = Router();

router.post("/",  controller.createOne);
router.post("/receive",  controller.receive);
router.get("/",  controller.history);


export default router;
