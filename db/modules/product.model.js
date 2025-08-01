import { model, Schema } from "mongoose";

const productSchema = new Schema({
  id:String ,
  title: String,
  description: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export const productModel = model("Product", productSchema);
