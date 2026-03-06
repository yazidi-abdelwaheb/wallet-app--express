import { model, Schema } from "mongoose";
import {
  userLanguageEnums,
  userRoleEnums,
  userThemeEnums,
} from "../../../shared/index.js";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(userRoleEnums),
    default: userRoleEnums.client,
  },
  amount: { type: Number, default: 0 },

  theme: {
    type: String,
    enum: Object.values(userThemeEnums),
    default: userThemeEnums.light,
  },
  language: {
    type: String,
    enum: Object.values(userLanguageEnums),
    default: userLanguageEnums.en,
  },

  accountActive: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = model("Users", userSchema);

export default User;
