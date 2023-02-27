import mongoose from "mongoose";

export const connectDatabase: any = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect("mongodb://localhost:27017/todoList");
  console.log("Connected to todoList database");
};
