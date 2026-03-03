import { Router } from "express";
import controller from "./features.controller.js";


const router = Router();

router.get("/" , controller.list)
router.get("/:id" , controller.readOne)
router.put("/:id" , controller.updateOne)
router.patch("/:id" , controller.toggleActive)
router.delete("/:id" , controller.deleteOne)


export default router;
