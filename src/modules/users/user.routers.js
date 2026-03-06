import { Router } from "express";
import controller from "./user.controller.js";

const router = Router();

const routerBalance = Router();
routerBalance.patch("/recharge",  controller.rechargeBalance);

routerBalance.get("/",  controller.readAmount);

router.use("/balance", routerBalance);

router.get("/",  controller.list);
router.post("/",  controller.createOne);
router.get("/:id",  controller.readOne);
router.put("/:id",  controller.updateOne);
router.delete("/:id",  controller.deleteOne);

router.get("/me" ,  controller.me)
router.put("/me" , controller.UpdateMyAccount)

router.patch("/me/theme" , controller.changeTheme)
router.patch("/me/language" , controller.changeLanguage)


export default router;
