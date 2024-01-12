import mongoose from "mongoose";

export default async function connectMongoDb() {
  const { DB_CONNECTION } = process.env;
  if (!DB_CONNECTION) {
    throw new Error("DB_CONNECTION must be set!");
  }
  return mongoose.connect(DB_CONNECTION);
}
