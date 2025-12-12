import {
  CustomError,
  errorCatch,
  subjects,
  transactionTemplate,
  transactionTypeEnums,
} from "../../shared/index.js";
import Card from "../card/schemas/card.schema.js";
import User from "../users/schemas/user.schema.js";
import Transaction from "./schemas/transaction.schema.js";
import bcrypt from "bcrypt";

const model = Transaction;
export default class TransactionController {
  static async createOne(req, res) {
    try {
      console.log(req.body);
      const { sourceCard, destinationCard, amount, cvv } = req.body;
      const userId = req.user._id;

      const intAmount = parseInt(amount, 10);
      if (isNaN(intAmount)) throw new CustomError("invalid Amount", 400);

      const source = await Card.findOne({ cardNumber: sourceCard });
      if (!source) throw new CustomError("Source card not found", 404);

      const destination = await Card.findOne({ cardNumber: destinationCard });
      if (!destination)
        throw new CustomError("Destination card not found", 404);

      const cvvCompare = await bcrypt.compare(cvv, source.cvv);
      if (!cvvCompare) throw new CustomError("Invalid CVV", 400);

      await source.spend(intAmount);

      destination.amount += intAmount;
      await destination.save();

      let type = transactionTypeEnums.transfer;

      if (destination.userId.toString() === userId.toString()) {
        type = transactionTypeEnums.top_up;
      }

      const transaction = await model.create({
        userId,
        sourceCard: source._id,
        destinationCard: destination._id,
        amount: intAmount,
        type,
      });
      transaction.save();

      return res.status(201).json({ message: "Transaction completed" });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async history(req, res) {
    try {
      let { page, limit } = req.query;
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1) limit = 5;

      const userId = req.user._id;
      const transactions = await model
        .find({ userId })
        .populate("sourceCard", "holderName cardNumber")
        .populate("destinationCard", "holderName cardNumber")
        .populate("destinationUser" , "firstName lastName")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalDocs = await model.countDocuments({ userId });
      return res.status(200).json({
        docs: transactions,
        page,
        limit,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
      });
    } catch (error) {
      errorCatch(error, req, res);
    }
  }

  static async receive(req, res) {
    try {
      const { cardNumber, cvv, amount } = req.body;
      const userId = req.user._id;
      const amountNumber = parseInt(amount, 10);

      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new CustomError("This amount is not valid!", 400);
      }
      const card = await Card.findOne({
        cardNumber,
        isActive: true,
        isDeleted: true,
      });
      if (!card) {
        throw new CustomError("Card not found!");
      }
      const cvvCompare = await bcrypt.compare(cvv, card.cvv);
      if (!cvvCompare) {
        throw new CustomError("Cvv not valid!");
      }

      await card.spend();

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $inc: { amount: amountNumber } },
        { new: true }
      );
      const sourceUser = await User.findById(card.userId);
      res
        .status(200)
        .json({ message: "Transaction receive with successfully" });

      const sourceTansaction = new model({
        type: transactionTypeEnums.transfer,
        userId: sourceUser._id,
        sourceCard: card._id,
        destinationUser: userId,
        amount: amountNumber,
      });
      await sourceTansaction.save();

      const distinationTansaction = new model({
        type: transactionTypeEnums.receive,
        userId: userId,
        sourceCard: card._id,
        destinationUser: userId,
        amount: amountNumber,
      });
      await distinationTansaction.save();


      await sendMail(
        sourceUser.email,
        subjects.transaction_confirmation,
        transactionTemplate({
          amount,
          receiver: `${user.firstName} ${user.lastName}`,
        })
      );
    } catch (error) {
      console.log(error);
      errorCatch(error, req, res);
    }
  }
}
