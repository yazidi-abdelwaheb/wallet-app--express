import { CustomError, errorCatch } from "../../shared/index.js";
import card from "./schemas/card.schema.js";
import bcrypt from "bcrypt";
const model = card;

export default class CardController {
  static async liste(req, res) {
    try {
      const userId = req.user._id;
      let { page, limit, search } = req.query;

      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 4;

      let filter = { userId };

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

  static async deleteOne(req, res) {
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });
      return res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }
}
