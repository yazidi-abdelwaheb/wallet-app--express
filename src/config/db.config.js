import mongoose from "mongoose";
import { DB_NAME } from "./env.config.js";

const mongoUri = `mongodb://localhost:27017/${DB_NAME}`;

async function connectDB() {
  try {
    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

connectDB();
