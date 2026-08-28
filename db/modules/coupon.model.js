import { model, Schema } from 'mongoose';
const couponSchema = new Schema({ ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, code: { type: String, required: true, trim: true, uppercase: true }, percent: { type: Number, required: true, min: 1, max: 100 }, expiresAt: Date, active: { type: Boolean, default: true } }, { timestamps: true, versionKey: false });
couponSchema.index({ ownerId: 1, code: 1 }, { unique: true });
export const couponModel = model('Coupon', couponSchema);
