import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role : { type: String, enum: ["client", "admin","super" ], default: "client" },  
  accountActive: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

const User = model("Users", userSchema);

export default User;
