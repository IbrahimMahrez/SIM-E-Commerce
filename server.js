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

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'token',
      'Authorization'
    ]
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SIM Store API is running'
  });
});

app.use(userRouters);
app.use(productRouters);
app.use(cartRouters);
app.use(orderRouters);
app.use(wishlistRouters);
app.use(couponRouters);
app.use(aiRouters);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

// افتح الـ PORT الأول
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`SIM Store API running on port ${port}`);

  // بعد فتح الـ PORT اتصل بـ MongoDB
  dbConnection()
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('MongoDB connection failed:');
      console.error(error.message);
    });
});

// لو السيرفر نفسه حصل فيه error
server.on('error', (error) => {
  console.error('Server error:', error);
});