import express from 'express';
import { getWishlist, toggleWishlist } from './wishlist.controller.js';
import { verifyToken } from '../../utilities/middleware/verfiyToken.js';

export const wishlistRouters = express.Router();
wishlistRouters.get('/wishlist', verifyToken, getWishlist);
wishlistRouters.post('/wishlist/toggle', verifyToken, toggleWishlist);
