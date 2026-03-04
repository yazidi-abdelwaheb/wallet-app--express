import mongoose from "mongoose";
import { DB_NAME, NODE_ENV, DB_PASSWORD } from "./env.config.js";

const getConnectionURI = () => {
  return NODE_ENV === "production"
    ? `mongodb+srv://walletapp:${DB_PASSWORD}@cluster0.vs8qxcw.mongodb.net/${DB_NAME}`
    : `mongodb://localhost:27017/${DB_NAME}`;
};

export default async function connectDB() {
  try {

    const mongoURI = getConnectionURI()
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully in : " + mongoURI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}
