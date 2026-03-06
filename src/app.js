import express, { urlencoded } from "express";
import cors from "cors";
import userRouters from "./modules/users/user.routers.js";
import authRouters from "./modules/auth/auth.routers.js";
import cardRouters from "./modules/card/card.routers.js";
import transactionRouters from "./modules/transaction/transaction.routers.js";
import featuresRouters from "./modules/features/features.routers.js";
import { isAuth } from "./middlewares/auth.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);



app.get("/", (req, res , next) => {
  res.status(200).json({ message: "server running successfully." });
  next()
});

app.use("/api/auth", authRouters);
app.use("/api/users", isAuth, userRouters);
app.use("/api/cards", isAuth, cardRouters);
app.use("/api/transactions", isAuth, transactionRouters);

app.use("/api/features", isAuth, featuresRouters);


app.use((req, res) => {
  res
    .status(404)
   .json({message : "404 : NOT FOUND"})
});

export default app;
