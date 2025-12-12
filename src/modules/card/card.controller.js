import { CustomError, errorCatch } from "../../shared/index.js";
import User from "../users/schemas/user.schema.js";
import Card from "./schemas/card.schema.js";
import bcrypt from "bcrypt";
const model = Card;

export default class CardController {
  static async liste(req, res) {
    try {
      const userId = req.user._id;
      let { page, limit, search, isDeleted , isActive } = req.query;

      // pagination
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 4;

      // valeurs par défaut
      let filter = { userId };

      // conversion string -> booléen
      if (typeof isActive === "string") {
        filter.isActive = isActive === "true";
      }

      if (typeof isDeleted === "string") {
        filter.isDeleted = isDeleted === "true";
      }

      // recherche textuelle
      if (search && search.trim()) {
        filter.$or = [
          { holderName: { $regex: search.trim(), $options: "i" } },
          { cardNumber: { $regex: search.trim(), $options: "i" } },
        ];
      }

      const totalDocs = await model.countDocuments(filter);

      const docs = await model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        docs,
        page,
        limit,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async all(req, res) {
    try {
      const { isActive, isDeleted } = req.query;
      const userId = req.user._id;
      const doc = await model.find({
        userId,
        isActive: true,
        isDeleted: false,
      });
      return res.status(201).json({ doc });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async createOne(req, res) {
    try {
      const { card } = req.body;
      const userId = req.user._id;

      const existeHolderName = await model.findOne({
        userId,
        holderName: { $regex: new RegExp(`^${card.holderName}$`, "i") },
      });

      if (existeHolderName) {
        throw new CustomError("This holder name is already in use.", 400);
      }

      const user = await User.findById(userId);

      if (card.amount > user.amount) {
        throw new CustomError("Insufficient balance", 400);
      }

      user.amount -= card.amount;
      await user.save();

      const doc = new model(card);
      doc.userId = userId;
      const cvv = doc.cvv;
      doc.cvv = await bcrypt.hash(cvv, 10);
      await doc.save();
      return res
        .status(200)
        .json({ message: "Card created successfully", cvv });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readOne(req, res) {
    try {
      const _id = req.params.id;
      const doc = await model.findOne({ _id });
      return res.status(201).json({ doc });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async readByCardNumber(req, res) {
    try {
      const { cardNumber } = req.params;
      console.log(cardNumber)
      const doc = await model
        .findOne({ cardNumber, isActive: true, isDeleted: false })
        .select("cardNumber holderName");
      if (!doc) {
        throw new CustomError("Card not found", 400);
      }

      return res
        .status(201)
        .json({ cardNumber: doc.cardNumber, holderName: doc.holderName });
    } catch (error) {
      console.log(error)
      errorCatch(error, req, res);
    }
  }

  static async updateOne(req, res) {
    try {
      const _id = req.params.id;
      const { card } = req.body;
      const doc = await model.findByIdAndUpdate(_id, card, { new: true });
      await doc.save();
      return res.status(200).json({ message: "Card updated successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async toggleActive(req, res) {
    try {
      const _id = req.params.id;
      const doc = await model.findById(_id);
      doc.isActive = !doc.isActive
      await doc.save();
      return res.status(200).json({ message: "Status changed successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async deleteOne(req, res) {
    try {
      const _id = req.params.id;
      const doc = await model.findById(_id);
      doc.isActive =false
      doc.isDeleted = true
      const amount = doc.amount
      await User.updateOne({ _id : doc.userId }, { $inc: { amount: amount } });
      doc.amount = 0
      await doc.save()
      return res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async recharge(req, res) {
    try {
      const cardId = req.params.id;
      const userId = req.user._id;
      const { amount } = req.body;

      const user = await User.findById(userId);

      if (amount > user.amount) {
        throw new CustomError("Insufficient balance", 400);
      }

      user.amount -= amount;
      await user.save();

      await model.updateOne({ _id: cardId }, { $inc: { amount: amount } });

      return res.status(200).json({ message: "Card recharged successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
