import { productModel } from '../../../db/modules/product.model.js';
import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../uploads');
const productNamePattern = /^[\p{L}\p{M}][\p{L}\p{M}\s'-]*$/u;
const productValues = (body, image) => {
  const values = { ...body };
  if (values.image) values.image = path.basename(String(values.image));
  if (values.price !== undefined) values.price = Number(values.price);
  if (values.cost !== undefined) values.cost = Number(values.cost);
  if (values.discountPercent !== undefined) values.discountPercent = Number(values.discountPercent);
  if (values.saleEndsAt !== undefined) values.saleEndsAt = values.saleEndsAt ? new Date(values.saleEndsAt) : null;
  if (values.isVisible !== undefined) values.isVisible = String(values.isVisible) === 'true';
  if (values.quantity !== undefined) values.quantity = Number(values.quantity);
  if (values.category) values.category = String(values.category).trim().toLowerCase();
  if (values.price !== undefined && (!Number.isFinite(values.price) || values.price < 0)) throw Object.assign(new Error('Price must be a positive number'), { statusCode: 400 });
  if (values.cost !== undefined && (!Number.isFinite(values.cost) || values.cost < 0)) throw Object.assign(new Error('Cost must be a non-negative number'), { statusCode: 400 });
  if (values.discountPercent !== undefined && (!Number.isFinite(values.discountPercent) || values.discountPercent < 0 || values.discountPercent > 100)) throw Object.assign(new Error('Discount must be between 0 and 100'), { statusCode: 400 });
  if (values.saleEndsAt && Number.isNaN(values.saleEndsAt.getTime())) throw Object.assign(new Error('Enter a valid sale end date'), { statusCode: 400 });
  if (values.quantity !== undefined && (!Number.isInteger(values.quantity) || values.quantity < 0)) throw Object.assign(new Error('Quantity must be a non-negative integer'), { statusCode: 400 });
  if (values.quantity !== undefined) values.isAvailable = values.quantity > 0;
  if (image) values.image = image;
  return values;
};

const publicProduct = (product) => { const item = product.toObject ? product.toObject() : product; const saleActive = item.saleEndsAt ? new Date(item.saleEndsAt) > new Date() : true; const discountPercent = saleActive ? Number(item.discountPercent || 0) : 0; return { ...item, originalPrice: item.price, price: Number((Number(item.price) * (1 - discountPercent / 100)).toFixed(2)), discountPercent, saleActive }; };
export const getProducts = async (req, res, next) => { try { const query = req.decoded.accountType === 'merchant' || req.decoded.role === 'admin' ? { ownerId: req.decoded._id, isVisible: { $ne: false } } : { isVisible: { $ne: false } }; res.json({ products: (await productModel.find(query).sort({ createdAt: -1 })).map(publicProduct) }); } catch (error) { next(error); } };
export const getMyProducts = async (req, res, next) => { try { res.json({ products: await productModel.find({ ownerId: req.decoded._id }).sort({ createdAt: -1 }) }); } catch (error) { next(error); } };
export const getUploadImages = async (_req, res, next) => {
  try {
    const images = (await readdir(uploadsDir)).filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file)).sort().reverse();
    res.json({ images });
  } catch (error) { next(error); }
};
export const addProduct = async (req, res, next) => { try { const values = productValues(req.body, req.file?.filename); if (!values.title?.trim() || !values.description?.trim() || !values.category || values.price === undefined || values.quantity === undefined) return res.status(400).json({ message: 'ID, title, description, price, quantity, and category are required' }); if (!productNamePattern.test(values.title.trim())) return res.status(400).json({ message: 'Product name must contain letters and spaces only' }); const id = values.id?.trim() || randomUUID(); if (await productModel.exists({ id })) return res.status(409).json({ message: 'A product already exists with this ID' }); const product = await productModel.create({ ...values, ownerId: req.decoded._id, id, title: values.title.trim(), description: values.description.trim() }); res.status(201).json({ message: 'Product added successfully', product }); } catch (error) { next(error); } };
export const updateProduct = async (req, res, next) => { try { const values = productValues(req.body, req.file?.filename); delete values.id; if (values.title && !productNamePattern.test(values.title.trim())) return res.status(400).json({ message: 'Product name must contain letters and spaces only' }); const product = await productModel.findOneAndUpdate({ id: req.params.id, ownerId: req.decoded._id }, values, { new: true, runValidators: true }); if (!product) return res.status(404).json({ message: 'Product not found' }); res.json({ message: 'Product updated successfully', product }); } catch (error) { next(error); } };
export const deleteProduct = async (req, res, next) => { try { const product = await productModel.findOneAndDelete({ id: req.params.id, ownerId: req.decoded._id }); if (!product) return res.status(404).json({ message: 'Product not found' }); res.json({ message: 'Product deleted successfully' }); } catch (error) { next(error); } };
