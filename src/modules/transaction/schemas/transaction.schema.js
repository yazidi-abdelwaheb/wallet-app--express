import { Schema, model } from "mongoose";
import { transactionTypeEnums } from "../../../shared/index.js";

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    sourceCard: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    destinationCard: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: transactionTypeEnums,
      default: transactionTypeEnums.transfer,
    },
    createAt : {
        type : Date,
        default : Date.now
    }
  },
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
