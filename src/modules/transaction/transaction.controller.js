import {
  CustomError,
  errorCatch,
  transactionTypeEnums,
} from "../../shared/index.js";
import Card from "../card/schemas/card.schema.js";
import Transaction from "./schemas/transaction.schema.js";
import bcrypt from "bcrypt";

export default class TransactionController {
  static async createOne(req, res) {
    try {
      console.log(req.body);
      const { sourceCard, destinationCard, amount, cvv } = req.body;
      const userId = req.user._id;

      const intAmount = parseInt(amount , 10)
      if(isNaN(intAmount)) throw new CustomError("invalid Amount", 400);

      const source = await Card.findOne({ cardNumber: sourceCard });
      if (!source) throw new CustomError("Source card not found", 404);

      const destination = await Card.findOne({ cardNumber: destinationCard });
      if (!destination)
        throw new CustomError("Destination card not found", 404);

      const cvvCompare = await bcrypt.compare(cvv, source.cvv);
      if (!cvvCompare) throw new CustomError("Invalid CVV", 400);

      await source.spend(intAmount);

      destination.amount += intAmount ;
      await destination.save();

      let type = transactionTypeEnums.transfer;

      if (destination.userId.toString() === userId.toString()) {
        type = transactionTypeEnums.top_up;
      }

      const transaction = await Transaction.create({
        userId,
        sourceCard: source._id,
        destinationCard: destination._id,
        amount : intAmount,
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
      const userId = req.user._id;
      const transactions = await Transaction.find({ userId })
        .populate("sourceCard", "holderName cardNumber")
        .populate("destinationCard", "holderName cardNumber")
        .sort({ createdAt: -1 });

      return res.status(200).json({ docs: transactions });
    } catch (error) {
        console.log(error)
      errorCatch(error, req, res);
    }
  }
}
