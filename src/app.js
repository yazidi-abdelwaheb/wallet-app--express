import express from "express";
import cors from "cors";
import userRouters from "./modules/users/user.routers.js";
import authRouters from "./modules/auth/auth.routers.js";
import cardRouters from "./modules/card/card.routers.js";
import transactionRouters from "./modules/transaction/transaction.routers.js";
import featuresRouters from "./modules/features/features.routers.js";
import { isAuth } from "./middlewares/auth.middleware.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouters);
app.use("/api/users", isAuth, userRouters);
app.use("/api/cards",isAuth, cardRouters);
app.use("/api/transactions",isAuth, transactionRouters);

app.use("/api/features",isAuth, featuresRouters);

export default app;


