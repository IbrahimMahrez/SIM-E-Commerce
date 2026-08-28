import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  age: { type: Number, required: true, min: 18 },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  accountType: { type: String, enum: ['customer', 'merchant'], default: 'customer' },
  loyaltyPoints: { type: Number, default: 0, min: 0 },
  storeCategories: { type: [String], default: [] },
  storePhone: { type: String, default: '', trim: true },
  storeName: { type: String, default: 'SIM MARKET', trim: true, maxlength: 60 },
  storeDescription: { type: String, default: '', trim: true, maxlength: 280 },
  vodafoneCashNumber: { type: String, default: '', trim: true, maxlength: 20 },
  bankTransferDetails: { type: String, default: '', trim: true, maxlength: 300 },
  shippingCost: { type: Number, default: 0, min: 0 },
  shippingZones: { type: [{ name: { type: String, trim: true }, cost: { type: Number, min: 0 } }], default: [] },
  freeShippingAt: { type: Number, default: 100, min: 0 }
}, {
  timestamps: true,
  versionKey: false
});

export const userModel = model("User", userSchema);
