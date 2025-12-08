import express from "express";
import cors from "cors";
import userRouters from "./modules/users/user.routers.js";
import authRouters from "./modules/auth/auth.routers.js";
import cardRouters from "./modules/card/card.routers.js";
import transactionRouters from "./modules/transaction/transaction.routers.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouters);
app.use("/api/users", userRouters);
app.use("/api/cards", cardRouters);
app.use("/api/transactions", transactionRouters);

export default app;


