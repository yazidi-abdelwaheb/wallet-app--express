import { Schema, model } from "mongoose";
import { randomInt, randomUUID } from "crypto";
import { type } from "os";

const cardSchema = new Schema({
  cardNumber: { type: String, default: () => randomUUID() },
  holderName: { type: String},
  cvv: { type: String, default: () => randomInt(100000, 1000000).toString() },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, default: 0 },
  weeklyLimit: { type: Number, default: 1000 },
  spentThisWeek: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

// Vérifie si 7 jours sont passés depuis le dernier reset
cardSchema.methods.resetWeeklyLimitIfNeeded = async function () {
  const now = new Date();
  const diffMs = now - this.lastReset; // différence en millisecondes
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays >= 7) {
    this.spentThisWeek = 0;
    this.lastReset = now;
    await this.save();
  }
};

// Dépenser de l’argent
cardSchema.methods.spend = async function (amount) {
  await this.resetWeeklyLimitIfNeeded();

  if (this.spentThisWeek + amount > this.weeklyLimit) {
    throw new Error("Plafond hebdomadaire dépassé !");
  }
  if (amount > this.amount) {
    throw new Error("Solde insuffisant !");
  }

  this.spent_this_week += amount;
  this.amount -= amount;
  return this.save();
};

// Recharger la carte
cardSchema.methods.topUp = async function (amount) {
  this.amount += amount;
  return this.save();
};

export default model("Card", cardSchema);
