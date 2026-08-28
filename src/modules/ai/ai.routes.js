import express from 'express';
import { shopAssistant } from './ai.controller.js';
import { verifyToken } from '../../utilities/middleware/verfiyToken.js';

export const aiRouters = express.Router();

aiRouters.post(
  '/ai/shop-assistant',
  verifyToken,
  shopAssistant
);