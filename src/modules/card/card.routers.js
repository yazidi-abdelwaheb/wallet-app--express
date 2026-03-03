import { Router } from "express";
import controller from "./card.controller.js";

const router = Router();
router.get("/",  controller.liste);
router.post("/",  controller.createOne);
router.get("/all",  controller.all);
router.get("/cardNumber/:cardNumber",  controller.readByCardNumber);
router.get("/:id",  controller.readOne);
router.put("/:id",  controller.updateOne);
router.delete("/:id",  controller.deleteOne);

router.patch("/recharge/:id",  controller.recharge);
router.patch("/toggleActive/:id",  controller.toggleActive);


export default router;
