import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.config.js";
import User from "../modules/users/schemas/user.schema.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

   
    const decoded = jwt.verify(token, SECRET_KEY);

    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

   
    req.user = user;
    next(); 
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
