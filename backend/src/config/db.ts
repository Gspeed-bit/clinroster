import mongoose from "mongoose";
import { getKeys } from "./keys.js";

export class DB {
  static async connect() {
    const { mongoUri } = getKeys();
    if (!mongoUri) throw new Error("MONGO_URI not set");
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  }
}
