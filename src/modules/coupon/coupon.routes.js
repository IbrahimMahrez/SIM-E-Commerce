import express from 'express';
import { createCoupon, deleteCoupon, getCoupons, validateCoupon } from './coupon.controller.js';
import { verifyToken } from '../../utilities/middleware/verfiyToken.js';

export const couponRouters = express.Router();
couponRouters.get('/coupons', verifyToken, getCoupons);
couponRouters.post('/coupons', verifyToken, createCoupon);
couponRouters.delete('/coupons/:id', verifyToken, deleteCoupon);
couponRouters.post('/coupons/validate', verifyToken, validateCoupon);
