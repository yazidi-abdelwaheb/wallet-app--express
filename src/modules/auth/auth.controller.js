import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorCatch } from "../../shared/index.js";
import User from "../users/schemas/user.schema.js";
import { SECRET_KEY } from "../../config/env.config.js";

export default class AuthController {
  static async signUp(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      /*// 2FA
            const twoFASecret = speakeasy.generateSecret({ length: 20 }).base32;*/

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "client",
      });
      user.save();
      res.status(201).json({ message: "User created" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
  static async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ error: "Email or password Invalid" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(401).json({ error: "Email or password Invalid" });

      // Génération du JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "10h" }
      );

      res.json({ message: "Sign in successful", token });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async me(req, res) {
    try {
      const _id = req.user._id;
      const doc = await User.findById(_id).select(
        "lastName firstName email role"
      );
      return res.status(200).json({ doc });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async UpdateMyAccount(req, res) {
    try {
      const _id = req.user._id;
      const { firstName, lastName } = req.body.user;
      console.log(req.body)
      await User.updateOne({ _id }, { firstName, lastName });
      return res.status(200).json({ message : "Account updated successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
