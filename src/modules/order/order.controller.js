import { orderModel } from '../../../db/modules/order.model.js';
import { cartModel } from '../../../db/modules/cart.model.js';
import { couponModel } from '../../../db/modules/coupon.model.js';
import { userModel } from '../../../db/modules/user.model.js';
import nodemailer from 'nodemailer';

const allowedStatuses = ['new', 'processing', 'shipped', 'completed', 'cancelled'];
const allowedPaymentMethods = ['cash_on_delivery', 'vodafone_cash', 'bank_transfer'];
const allowedPaymentStatuses = ['unpaid', 'paid', 'refunded'];
const statusLabels = { new: 'Order received', processing: 'Preparing your order', shipped: 'Your order is on the way', completed: 'Your order was delivered', cancelled: 'Your order was cancelled' };
const orderAlertText = (order) => `New order #${String(order._id).slice(-6).toUpperCase()}\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nItems: ${order.items.map((item) => `${item.title} × ${item.quantity}`).join(', ')}\nTotal: $${Number(order.total).toFixed(2)}`;
const notifyMerchantOfNewOrder = async (order) => {
  const message = orderAlertText(order);
  const jobs = [];
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, tls: { rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false' } });
    jobs.push(transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: process.env.ADMIN_ORDER_EMAIL || process.env.SMTP_USER, subject: `New order #${String(order._id).slice(-6).toUpperCase()}`, text: message }));
  }
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.ADMIN_WHATSAPP_NUMBER) {
    jobs.push(fetch(`https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messaging_product: 'whatsapp', to: String(process.env.ADMIN_WHATSAPP_NUMBER).replace(/\D/g, ''), type: 'text', text: { body: message } }) }).then(async (response) => { if (!response.ok) throw new Error(`WhatsApp API: ${await response.text()}`); }));
  }
  const results = await Promise.allSettled(jobs);
  results.filter((result) => result.status === 'rejected').forEach((result) => console.error('Order notification failed:', result.reason?.message || result.reason));
};

export const createOrder = async (req, res, next) => {
  try {
    const { name, email, phone, address, note = '', couponCode = '', paymentMethod = 'cash_on_delivery', shippingZone = '' } = req.body;
    if (!name?.trim() || !email?.trim() || !/^\S+@\S+\.\S+$/.test(email) || !phone?.trim() || !address?.trim()) return res.status(400).json({ message: 'Name, valid email, phone, and address are required' });
    if (!allowedPaymentMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Invalid payment method' });
    const cart = await cartModel.findOne({ userId: req.decoded._id }).populate({ path: 'items.productId', select: 'id title price discountPercent image quantity' });
    const items = (cart?.items || []).filter((item) => item.productId).map((item) => {
      const base = Number(item.productId.price); const discount = Number(item.productId.discountPercent || 0);
      return { productId: item.productId.id, title: item.productId.title, price: Number((base * (1 - discount / 100)).toFixed(2)), quantity: item.quantity, image: item.productId.image };
    });
    if (!items.length) return res.status(400).json({ message: 'Your cart is empty' });
    const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
    const coupon = couponCode ? await couponModel.findOne({ code: String(couponCode).trim().toUpperCase(), active: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }) : null;
    if (couponCode && !coupon) return res.status(400).json({ message: 'Coupon is invalid or expired' });
    const discount = coupon ? Number((subtotal * coupon.percent / 100).toFixed(2)) : 0;
    const storeOwner = await userModel.findOne().sort({ createdAt: 1 }); const selectedZone = (storeOwner?.shippingZones || []).find((zone) => zone.name === String(shippingZone)); const shippingCost = Number(selectedZone?.cost ?? storeOwner?.shippingCost ?? 0); const order = await orderModel.create({ customerId: req.decoded._id, customer: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), address: address.trim(), note: note.trim() }, items, total: Number((subtotal - discount + shippingCost).toFixed(2)), shipping: { zone: selectedZone?.name || '', cost: shippingCost }, coupon: coupon ? { code: coupon.code, percent: coupon.percent, discount } : undefined, paymentMethod });
    const pointsEarned = Math.max(1, Math.floor(order.total));
    await userModel.findByIdAndUpdate(req.decoded._id, { $inc: { loyaltyPoints: pointsEarned } });
    notifyMerchantOfNewOrder(order).catch((error) => console.error('Order notification failed:', error.message));
    res.status(201).json({ message: 'Order created successfully', order, pointsEarned });
  } catch (error) { next(error); }
};

const emailTemplate = ({ order, merchant }) => `<div style="background:#090909;padding:32px;font-family:Arial,sans-serif;color:#fff"><div style="max-width:620px;margin:auto;background:#171717;border:1px solid #3b3b3b;border-radius:16px;overflow:hidden"><div style="padding:28px;background:#d1ff4d;color:#111"><h1 style="margin:0;font-size:25px">${merchant.storeName || 'SIM MARKET'}</h1><p style="margin:7px 0 0">Order update from ${merchant.username}</p></div><div style="padding:28px"><p style="color:#d1ff4d;font-weight:bold;letter-spacing:1px">ORDER #${String(order._id).slice(-6).toUpperCase()}</p><h2 style="margin:0 0 12px">${statusLabels[order.status]}</h2><p style="color:#c5c5c5;line-height:1.6">Hello ${order.customer.name}, your order status has been updated.</p><div style="padding:16px;background:#202020;border-radius:10px;margin:22px 0"><b>Shipping details</b><p style="color:#c5c5c5;margin:8px 0 0">${order.customer.address}</p><p style="color:#c5c5c5;margin:8px 0 0">Phone: ${order.customer.phone}</p>${order.tracking?.number ? `<p style="color:#d1ff4d;margin:8px 0 0">Tracking: ${order.tracking.company || 'Shipment'} — ${order.tracking.number}</p>` : ''}</div><p style="color:#d1ff4d;font-size:20px;font-weight:bold">Total: $${Number(order.total).toFixed(2)}</p><p style="color:#8e8e8e;font-size:12px">Merchant: ${merchant.username} · Sent by ${merchant.storeName || 'SIM MARKET'}</p></div></div></div>`;
export const emailOrderUpdate = async (req, res, next) => { try { const order = await orderModel.findById(req.params.id); if (!order) return res.status(404).json({ message: 'Order not found' }); if (!order.customer?.email) return res.status(400).json({ message: 'This order has no customer email address.' }); if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return res.status(400).json({ message: 'Email is not configured. Add SMTP settings to the backend .env file.' }); const merchant = await userModel.findById(req.decoded._id); const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, tls: { rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false' } }); await transporter.sendMail({ from: process.env.SMTP_FROM || `${merchant.storeName || 'SIM MARKET'} <${process.env.SMTP_USER}>`, to: order.customer.email, subject: `${merchant.storeName || 'SIM MARKET'} · ${statusLabels[order.status]}`, html: emailTemplate({ order, merchant }) }); res.json({ message: 'Email sent to customer' }); } catch (error) { next(error); } };
export const getOrders = async (_req, res, next) => { try { res.json({ orders: await orderModel.find().sort({ createdAt: -1 }) }); } catch (error) { next(error); } };
export const getMyOrders = async (req, res, next) => { try { res.json({ orders: await orderModel.find({ customerId: req.decoded._id }).sort({ createdAt: -1 }) }); } catch (error) { next(error); } };
export const trackOrder = async (req, res, next) => { try { const code = String(req.body.orderCode || '').trim().toLowerCase(); const phone = String(req.body.phone || '').replace(/\D/g, ''); if (code.length < 4 || phone.length < 8) return res.status(400).json({ message: 'Enter a valid order number and phone number' }); const order = await orderModel.findOne({ 'customer.phone': { $regex: `${phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$` } }).sort({ createdAt: -1 }); if (!order || !String(order._id).toLowerCase().endsWith(code)) return res.status(404).json({ message: 'Order not found. Check the order number and phone.' }); res.json({ order: { _id: order._id, status: order.status, createdAt: order.createdAt, total: order.total, items: order.items.map((item) => ({ title: item.title, quantity: item.quantity })), tracking: order.tracking || {} } }); } catch (error) { next(error); } };
export const updateOrderStatus = async (req, res, next) => { try { if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' }); const order = await orderModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); if (!order) return res.status(404).json({ message: 'Order not found' }); res.json({ message: 'Order status updated', order }); } catch (error) { next(error); } };
export const updateOrderFulfillment = async (req, res, next) => { try { const paymentStatus = req.body.paymentStatus; const company = String(req.body.tracking?.company || '').trim(); const number = String(req.body.tracking?.number || '').trim(); if (!allowedPaymentStatuses.includes(paymentStatus)) return res.status(400).json({ message: 'Invalid payment status' }); const order = await orderModel.findByIdAndUpdate(req.params.id, { paymentStatus, tracking: { company, number } }, { new: true, runValidators: true }); if (!order) return res.status(404).json({ message: 'Order not found' }); res.json({ message: 'Payment and shipment details updated', order }); } catch (error) { next(error); } };
