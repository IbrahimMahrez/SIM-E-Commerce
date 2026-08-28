import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { dbConnection } from './db/dbConnection.js';

import { userRouters } from './src/modules/user/user.routes.js';
import { productRouters } from './src/modules/product/product.routes.js';
import { cartRouters } from './src/modules/cart/cart.routes.js';
import { orderRouters } from './src/modules/order/order.routes.js';
import { wishlistRouters } from './src/modules/wishlist/wishlist.routes.js';
import { couponRouters } from './src/modules/coupon/coupon.routes.js';
import { aiRouters } from './src/modules/ai/ai.routes.js';

import { errorHandler } from './src/utilities/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = Number(process.env.PORT) || 3000;

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ||
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'token',
      'Authorization',
    ],
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));

// Static uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SIM Store API is running',
  });
});

// Routes
app.use(userRouters);
app.use(productRouters);
app.use(cartRouters);
app.use(orderRouters);
app.use(wishlistRouters);
app.use(couponRouters);
app.use(aiRouters);

// 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    console.log('Starting SIM Store API...');
    console.log(`PORT: ${port}`);

    // Connect to MongoDB first
    await dbConnection();

    console.log('MongoDB connected successfully');

    // Listen on Render/Railway/etc. assigned port
    app.listen(port, '0.0.0.0', () => {
      console.log(`SIM Store API is running on port ${port}`);
    });
  } catch (error) {
    console.error('API failed to start.');
    console.error(error);

    process.exit(1);
  }
}

startServer();