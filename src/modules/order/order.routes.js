import express from 'express';
import { createOrder, emailOrderUpdate, getMyOrders, getOrders, trackOrder, updateOrderFulfillment, updateOrderStatus } from './order.controller.js';
import { verifyToken } from '../../utilities/middleware/verfiyToken.js';
import { verifyAdmin } from '../../utilities/middleware/verifyAdmin.js';

export const orderRouters = express.Router();
orderRouters.post('/orders', verifyToken, createOrder);
orderRouters.post('/track-order', trackOrder);
orderRouters.get('/my/orders', verifyToken, getMyOrders);
orderRouters.get('/orders', verifyToken, verifyAdmin, getOrders);
orderRouters.put('/orders/:id/status', verifyToken, verifyAdmin, updateOrderStatus);
orderRouters.put('/orders/:id/fulfillment', verifyToken, verifyAdmin, updateOrderFulfillment);
orderRouters.post('/orders/:id/email', verifyToken, verifyAdmin, emailOrderUpdate);
