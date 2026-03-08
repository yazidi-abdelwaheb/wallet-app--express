import { Router } from "express";
import controller from "./user.controller.js";

const router = Router();

// routers for /balance end point
const routerBalance = Router();
routerBalance.patch("/recharge",  controller.rechargeBalance);

routerBalance.get("/",  controller.readAmount);

router.use("/balance", routerBalance);

// routers for /me end point
const routerMe = Router();
routerMe.get("/" ,  controller.me)
routerMe.put("/" , controller.UpdateMyAccount)

routerMe.patch("/theme" , controller.changeTheme)
routerMe.patch("/language" , controller.changeLanguage)

router.use("/me", routerMe);


router.get("/",  controller.list);
router.post("/",  controller.createOne);
router.get("/:id",  controller.readOne);
router.put("/:id",  controller.updateOne);
router.delete("/:id",  controller.deleteOne);




export default router;
