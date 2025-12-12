import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorCatch, resetPasswordTemplate, sendMail, subjects, verificationLoginTemplate, verificationMailTemplate } from "../../shared/index.js";
import User from "../users/schemas/user.schema.js";
import { SECRET_KEY } from "../../config/env.config.js";
import Otp from "../users/schemas/otp.schema.js";

export default class AuthController {
  static async signUp(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "client",
        accountActive: false,
      });
      user.save();

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

      const otp = await Otp.create({
        userId: user._id,
        code,
        expiredAt,
        attempts: 5,
        type: "sign-up",
      });
      otp.save();

      res.json({
        message: "OTP sent to user",
        otp: otp._id,
      });

      await sendMail(
        user.email,
        subjects.verification_mail,
        verificationMailTemplate({ code: code })
      );
    } catch (error) {
      console.error(error)
      errorCatch(error, req, res);
    }
  }

  static async verifyOtpSignUp(req, res) {
    try {
      const { otpId, code } = req.body;

      const otp = await Otp.findOne({ _id: otpId, code, type: "sign-up" });
      if (!otp) return res.status(400).json({ error: "Invalid OTP" });
      if (otp.expiredAt < new Date())
        return res.status(400).json({ error: "OTP expired" });

      const user = await User.findById(otp.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.accountActive = true;
      user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "10h" }
      );

      return res.json({ message: "Sign in successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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

      const otp = await Otp.create({
        userId: user._id,
        code,
        expiredAt,
        attempts: 5,
        type: "sign-in",
      });
      otp.save();

      console.log(otp._id);
      res.json({
        message: "OTP sent to user",
        otp: otp._id,
      });
      await sendMail(
        user.email,
        subjects.verification_login,
        verificationLoginTemplate({ code: code })
      );
    } catch (error) {
      console.error(error)
      errorCatch(error, req, res);
    }
  }

  static async verifyOtpSignIn(req, res) {
    try {
      const { otpId, code } = req.body;

      const otp = await Otp.findOne({ _id: otpId, code, type: "sign-in" });
      if (!otp) return res.status(400).json({ error: "Invalid OTP" });
      if (otp.expiredAt < new Date())
        return res.status(400).json({ error: "OTP expired" });

      const user = await User.findById(otp.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "10h" }
      );

      return res.json({ message: "Sign in successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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

  static async readOtp(req, res) {
    try {
      const _id = req.params.id;
      const doc = await Otp.findById(_id);
      return res.status(200).json({ doc });
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
