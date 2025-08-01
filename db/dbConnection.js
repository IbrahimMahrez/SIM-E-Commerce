import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb+srv://ibrahimmahrez726:dQZtGrD82RL7kCPS@cluster0.whetqr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
  }
};
