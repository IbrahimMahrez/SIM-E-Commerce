import { model, Schema } from "mongoose";

const productSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  id:{ type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, default: 0, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  saleEndsAt: { type: Date, default: null },
  image: String,
  category: {
  type: String,
  required: true,
  trim: true
}
  ,
  quantity: {
    type: Number,
    default: 0,
    min: 0
  }
  ,
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVisible: { type: Boolean, default: true }
}, {
  timestamps: true,
  versionKey: false
});

export const productModel = model("Product", productSchema);
