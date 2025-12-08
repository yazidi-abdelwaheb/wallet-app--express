import { Router } from "express";
import controller from "./card.controller.js";
import { isAuth } from "../../middelwares/auth.middelware.js";

const router = Router();
router.get("/", isAuth, controller.liste);
router.post("/", isAuth, controller.createOne);
router.get("/all", isAuth, controller.all);
router.get("/cardNumber/:cardNumber", isAuth, controller.readByCardNumber);
router.get("/:id", isAuth, controller.readOne);
router.put("/:id", isAuth, controller.updateOne);
router.delete("/:id", isAuth, controller.deleteOne);

router.patch("/:id/recharge", isAuth, controller.recharge);

export default router;
