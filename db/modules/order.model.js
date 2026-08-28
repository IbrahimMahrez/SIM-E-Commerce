import { model, Schema } from 'mongoose';

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { name: { type: String, required: true }, email: { type: String, required: true, lowercase: true, trim: true }, phone: { type: String, required: true }, address: { type: String, required: true }, note: String },
  items: [{ productId: String, title: String, price: Number, quantity: Number, image: String }],
  total: { type: Number, required: true, min: 0 },
  shipping: { zone: { type: String, trim: true }, cost: { type: Number, default: 0, min: 0 } },
  coupon: { code: String, percent: Number, discount: Number },
  status: { type: String, enum: ['new', 'processing', 'shipped', 'completed', 'cancelled'], default: 'new' },
  paymentMethod: { type: String, enum: ['cash_on_delivery', 'vodafone_cash', 'bank_transfer'], default: 'cash_on_delivery' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  tracking: { company: { type: String, trim: true, maxlength: 80 }, number: { type: String, trim: true, maxlength: 100 } }
}, { timestamps: true, versionKey: false });

export const orderModel = model('Order', orderSchema);
