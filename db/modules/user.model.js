import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: String,
  age: Number,
  password: String,
  email: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

export const userModel = model("User", userSchema);
