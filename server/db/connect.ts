import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB(): Promise<void> {
  const url = process.env.MONGO_URL;

  if (!url) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(url);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Failed to connect mongoDB.", error);
    process.exit(1);
  }
}
