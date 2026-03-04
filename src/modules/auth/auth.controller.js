import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  errorCatch,
  resetPasswordTemplate,
  sendMail,
  subjects,
  verificationLoginTemplate,
  verificationMailTemplate,
  CustomError,
  userRoleEnums,
} from "../../shared/index.js";
import User from "../users/schemas/user.schema.js";
import { SECRET_KEY } from "../../config/env.config.js";
import Opt from "./schemas/opt.schema.js";
import mongoose, { model } from "mongoose";

export default class AuthController {
  static async signUp(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new CustomError("Email already exists", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: userRoleEnums.client,
        accountActive: false,
      });
      user.save();

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

      const opt = await Opt.create({
        userId: user._id,
        code,
        expiredAt,
        attempts: 5,
        type: "sign-up",
      });
      opt.save();

      res.json({
        message: "OPT sent to user",
        opt: opt._id,
      });

      await sendMail(
        user.email,
        subjects.verification_mail,
        verificationMailTemplate({ code: code }),
      );
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async verifyOPTSignUp(req, res) {
    try {
      const { optId, code } = req.body;

      const opt = await Opt.findOne({ _id: optId, type: "sign-up" });

      if (!opt) throw new CustomError("OPT not found, try again!", 400);

      if (opt.attempts === 0)
        throw new CustomError("The end OPT attempts, try again!", 400);
      if (opt.expiredAt < new Date()) throw new CustomError("OPT expired", 400);
      if (opt.code !== code) throw new CustomError("Invalid OPT code", 400);

      const user = await User.findById(opt.userId);
      if (!user) throw new CustomError("User not found", 400);

      user.accountActive = true;
      user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "10h" },
      );

      return res.status(200).json({ message: "Sign Up successful", token });
    } catch (error) {
      const opt = await Opt.findById(req.body.optId);
      opt.attempts = opt.attempts > 0 ? opt.attempts - 1 : 0;
      await opt.save();
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

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

      const opt = await Opt.create({
        userId: user._id,
        code,
        expiredAt,
        attempts: 5,
        type: "sign-in",
      });
      opt.save();

      console.log(opt._id);
      res.json({
        message: "OPT sent to user",
        opt: opt._id,
      });
      await sendMail(
        user.email,
        subjects.verification_login,
        verificationLoginTemplate({ code: code }),
      );
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async verifyOTPSignIn(req, res) {
    try {
      const { optId, code } = req.body;

      const opt = await Opt.findOne({ _id: optId, code, type: "sign-in" });
      if (!opt) throw new CustomError("Invalid OPT code", 400);
      if (opt.expiredAt < new Date()) throw new CustomError("OPT expired", 400);

      const user = await User.findById(opt.userId);
      if (!user) throw new CustomError("User not found", 400);

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "10h" },
      );

      return res.status(200).json({ message: "Sign in successful", token });
    } catch (error) {
      const opt = await Opt.findById(req.body.optId);
      opt.attempts = opt.attempts - 1;
      await opt.save();
      errorCatch(error, req, res);
    }
  }

  static async me(req, res) {
    try {
      const _id = req.user._id;
      const doc = await User.findById(_id).select(
        "lastName firstName email role",
      );
      return res.status(200).json(doc);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOpt(req, res) {
    try {
      const _id = req.params.id;
      const doc = await Opt.findById(_id);
      return res.status(200).json(doc);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async UpdateMyAccount(req, res) {
    try {
      const _id = req.user._id;
      const { firstName, lastName } = req.body.user;
      console.log(req.body);
      await User.updateOne({ _id }, { firstName, lastName });
      return res.status(200).json({ message: "Account updated successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
