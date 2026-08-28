import { model, Schema } from 'mongoose';

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true, versionKey: false });

export const wishlistModel = model('Wishlist', wishlistSchema);
