import { Router } from "express";
import controller from "./user.controller.js";
import { isAuth } from "../../middelwares/auth.middelware.js";

const router = Router();

const routerBalance = Router();
routerBalance.patch("/recharge", isAuth, controller.rechargeBalance);

routerBalance.get("/", isAuth, controller.readAmount);

router.use("/balance", routerBalance);

router.get("/", isAuth, controller.liste);
router.post("/", isAuth, controller.createOne);
router.get("/:id", isAuth, controller.readOne);
router.put("/:id", isAuth, controller.updateOne);
router.delete("/:id", isAuth, controller.deleteOne);


export default router;
