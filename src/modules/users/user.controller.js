import {
  CustomError,
  errorCatch,
  userLanguageEnums,
  userRoleEnums,
  userThemeEnums,
} from "../../shared/index.js";
import User from "./schemas/user.schema.js";

const model = User;

export default class UserController {
  static async list(req, res) {
    try {
      const { role, search, page, limit } = req.query;
      const filter = {};
      if (role) {
        filter.role = role;
      }
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
      const docs = await model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      const total = await model.countDocuments(filter);
      return res.status(200).json({ docs, total });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
  static async createOne(req, res) {
    try {
      const { user } = req.body;
      const doc = new model(user);
      doc.role = userRoleEnums.admin;
      await doc.save();
      return res
        .status(200)
        .json({ message: "Admin user created successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    try {
      const _id = req.params.id;
      const doc = await model.findOne({ _id, role: userRoleEnums.admin });
      return res.status(201).json({ doc });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async updateOne(req, res) {
    try {
      const _id = req.params.id;
      const { user } = req.body;
      const doc = await model.findByIdAndUpdate(_id, user, { new: true });
      doc.role = "admin";
      await doc.save();
      return res
        .status(200)
        .json({ message: "Admin user updated successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    try {
      const _id = req.params.id;
      const doc = await model.findById(_id);
      if (doc.role !== "admin") {
        throw new Error("User is not an admin");
      } else {
        await model.deleteOne({ _id });
      }
      return res
        .status(200)
        .json({ message: "Admin user deleted successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async rechargeBalance(req, res) {
    try {
      const { amount } = req.body;
      const _id = req.user._id;

      const amountNumber = parseInt(amount, 10);

      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new CustomError("This amount is not valid!", 400);
      }

      await model.updateOne({ _id }, { $inc: { amount: amountNumber } });

      return res.json({ message: "Balance recharge successfully!" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readAmount(req, res) {
    try {
      const { _id } = req.user;
      const user = await model.findById(_id).select("amount");
      return res.status(200).json({ amount: user.amount });
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

  static async me(req, res) {
    try {
      
      const _id = req.user._id;

      const doc = await User.findById(_id).select(
        "lastName firstName email role language theme",
      );
      return res.status(200).json(doc);
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async changeTheme(req, res) {
    try {
      const { _id } = req.user;
      let { theme } = req.body;

      theme = Object.values(userThemeEnums).includes(theme.trim().toUpperCase())
        ? theme.trim().toUpperCase()
        : userThemeEnums.light;

      await User.updateOne({ _id }, { theme });

      return res
        .status(200)
        .json({ message: `Theme changed successfully to ${theme}` });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async changeLanguage(req, res) {
    try {
      const { _id } = req.user;
      let { language } = req.body;

      language = Object.values(userLanguageEnums).includes(
        language.trim().toUpperCase(),
      )
        ? language.trim().toUpperCase()
        : userLanguageEnums.en;

      await User.updateOne({ _id }, { language });

      return res
        .status(200)
        .json({ message: `Language changed successfully to ${language}` });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
