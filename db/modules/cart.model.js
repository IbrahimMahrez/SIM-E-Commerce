import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Types.ObjectId, 
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: Types.ObjectId, 
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

export const cartModel = model("Cart", cartSchema);
