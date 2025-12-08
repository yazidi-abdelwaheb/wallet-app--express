import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: "Users", required: true },
  code: { type: String },
  expiredAt: { type: Date },
  attempts: { type: Number },
  type: {
    type: String,
    enum: ["sign-in", "sign-up", "reset-password"],
    default: "sign-in",
  },
});

const Otp = model("Otps", otpSchema);

export default Otp;
