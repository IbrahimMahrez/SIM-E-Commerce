import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../../../db/modules/user.model.js';
import { jwtSecret } from '../../utilities/middleware/verfiyToken.js';

const customerCategories = ['electronics', 'clothes', 'shoes', 'games', 'sports', 'beauty', 'home'];
const cleanUser = (user) => ({ _id: user._id, username: user.username, email: user.email, age: user.age, role: user.role, accountType: user.accountType || 'merchant', loyaltyPoints: user.loyaltyPoints || 0, isConfirmed: user.isConfirmed, storeCategories: (user.accountType === 'customer' && !(user.storeCategories || []).length) ? customerCategories : (user.storeCategories || []), storePhone: user.storePhone || '', storeName: user.storeName || 'SIM MARKET', storeDescription: user.storeDescription || '', vodafoneCashNumber: user.vodafoneCashNumber || '', bankTransferDetails: user.bankTransferDetails || '', shippingCost: user.shippingCost || 0, shippingZones: user.shippingZones || [], freeShippingAt: user.freeShippingAt ?? 100 });
const normaliseEmail = (email = '') => email.trim().toLowerCase();
const tokenFor = (user) => jwt.sign({ _id: user._id, role: user.role, accountType: user.accountType || 'merchant' }, jwtSecret(), { expiresIn: '7d' });

export const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const email = normaliseEmail(req.body.email);
    const age = Number(req.body.age);
    if (!username?.trim() || !email || !password || !Number.isInteger(age) || age < 18) return res.status(400).json({ message: 'Username, valid email, password, and age (18+) are required' });
    if (await userModel.exists({ email })) return res.status(409).json({ message: 'An account already exists with this email' });
    const accountType = req.body.accountType === 'merchant' ? 'merchant' : 'customer';
    const storeCategories = Array.isArray(req.body.storeCategories) ? [...new Set(req.body.storeCategories.map((item) => String(item).trim().toLowerCase()).filter(Boolean))] : [];
    if (accountType === 'merchant' && !storeCategories.length) return res.status(400).json({ message: 'Merchants must choose at least one store category' });
    const user = await userModel.create({ username: username.trim(), email, age, password: await bcrypt.hash(password, 12), role: 'user', accountType, isConfirmed: true, storeCategories });
    res.status(201).json({ message: 'Account created successfully. You can now sign in.', user: cleanUser(user) });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: normaliseEmail(req.body.email) });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ message: `Welcome ${user.username}`, token: tokenFor(user), user: cleanUser(user) });
  } catch (error) { next(error); }
};

export const adminLogin = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: normaliseEmail(req.body.email), role: 'admin' });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ message: `Welcome ${user.username}`, token: tokenFor(user), user: cleanUser(user) });
  } catch (error) { next(error); }
};

export const getAllUsers = async (_req, res, next) => { try { res.json({ users: (await userModel.find().sort({ createdAt: -1 })).map(cleanUser) }); } catch (error) { next(error); } };
export const getStoreConfig = async (_req, res, next) => { try { const owner = await userModel.findOne().sort({ createdAt: 1 }); res.json({ storeCategories: owner?.storeCategories || [], storePhone: owner?.storePhone || '', storeName: owner?.storeName || 'SIM MARKET', storeDescription: owner?.storeDescription || '', vodafoneCashNumber: owner?.vodafoneCashNumber || '', bankTransferDetails: owner?.bankTransferDetails || '', shippingCost: owner?.shippingCost || 0, shippingZones: owner?.shippingZones || [], freeShippingAt: owner?.freeShippingAt ?? 100 }); } catch (error) { next(error); } };
export const getUserProfile = async (req, res, next) => { try { const user = await userModel.findById(req.decoded._id); if (!user) return res.status(404).json({ message: 'User not found' }); res.json({ user: cleanUser(user) }); } catch (error) { next(error); } };

export const updateUser = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.username?.trim()) updates.username = req.body.username.trim();
    if (req.body.email) updates.email = normaliseEmail(req.body.email);
    if (req.body.age !== undefined) { const age = Number(req.body.age); if (!Number.isInteger(age) || age < 18) return res.status(400).json({ message: 'Age must be 18 or older' }); updates.age = age; }
    if (req.body.storePhone !== undefined) { const phone = String(req.body.storePhone).replace(/[^\d+]/g, ''); if (phone && !/^\+?\d{8,15}$/.test(phone)) return res.status(400).json({ message: 'Enter a valid WhatsApp number' }); updates.storePhone = phone; }
    if (req.body.storeName !== undefined) updates.storeName = String(req.body.storeName).trim().slice(0, 60) || 'SIM MARKET';
    if (req.body.storeDescription !== undefined) updates.storeDescription = String(req.body.storeDescription).trim().slice(0, 280);
    if (req.body.vodafoneCashNumber !== undefined) updates.vodafoneCashNumber = String(req.body.vodafoneCashNumber).replace(/[^\d+]/g, '').slice(0, 20);
    if (req.body.bankTransferDetails !== undefined) updates.bankTransferDetails = String(req.body.bankTransferDetails).trim().slice(0, 300);
    if (req.body.shippingZones !== undefined) { if (!Array.isArray(req.body.shippingZones)) return res.status(400).json({ message: 'Shipping zones must be a list' }); updates.shippingZones = req.body.shippingZones.map((zone) => ({ name: String(zone.name || '').trim().slice(0, 60), cost: Number(zone.cost) })).filter((zone) => zone.name && Number.isFinite(zone.cost) && zone.cost >= 0).slice(0, 20); }
    for (const key of ['shippingCost', 'freeShippingAt']) if (req.body[key] !== undefined) { const value = Number(req.body[key]); if (!Number.isFinite(value) || value < 0) return res.status(400).json({ message: `${key} must be a non-negative number` }); updates[key] = value; }
    const user = await userModel.findByIdAndUpdate(req.decoded._id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', user: cleanUser(user) });
  } catch (error) { next(error); }
};

export const updateStoreCategories = async (req, res, next) => {
  try {
    const categories = Array.isArray(req.body.categories) ? [...new Set(req.body.categories.map((item) => String(item).trim().toLowerCase()).filter(Boolean))] : null;
    if (!categories) return res.status(400).json({ message: 'Categories must be a list' });
    const user = await userModel.findByIdAndUpdate(req.decoded._id, { storeCategories: categories }, { new: true, runValidators: true });
    res.json({ message: 'Store categories updated successfully', user: cleanUser(user) });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => { try { await userModel.findByIdAndDelete(req.decoded._id); res.json({ message: 'Account deleted successfully' }); } catch (error) { next(error); } };
export const deleteUserByAdmin = async (req, res, next) => { try { const user = await userModel.findById(req.params.id); if (!user) return res.status(404).json({ message: 'User not found' }); if (user.role === 'admin') return res.status(403).json({ message: 'Admin accounts cannot be deleted' }); await user.deleteOne(); res.json({ message: 'User deleted successfully' }); } catch (error) { next(error); } };
export const adminUpdateUser = async (req, res, next) => { try { const updates = { username: req.body.username?.trim(), email: req.body.email && normaliseEmail(req.body.email), role: req.body.role }; if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 12); Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]); const user = await userModel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }); if (!user) return res.status(404).json({ message: 'User not found' }); res.json({ message: 'User updated successfully', user: cleanUser(user) }); } catch (error) { next(error); } };
export const addUserByAdmin = async (req, res, next) => { try { const { username, password, role = 'user' } = req.body; const email = normaliseEmail(req.body.email); const age = Number(req.body.age); if (!username?.trim() || !email || !password || !Number.isInteger(age) || age < 18) return res.status(400).json({ message: 'All valid user fields are required' }); if (await userModel.exists({ email })) return res.status(409).json({ message: 'An account already exists with this email' }); const user = await userModel.create({ username: username.trim(), email, age, role, password: await bcrypt.hash(password, 12), isConfirmed: true }); res.status(201).json({ message: 'User created successfully', user: cleanUser(user) }); } catch (error) { next(error); } };
