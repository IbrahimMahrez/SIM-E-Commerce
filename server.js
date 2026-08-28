
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

// Fly.io provides PORT through environment variables
const port = Number(process.env.PORT) || 3000;

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
| Open temporarily for production testing.
| After everything works, we can restrict it to the Cloudflare domain.
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
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
    ],
    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: '1mb' }));

/*
|--------------------------------------------------------------------------
| Uploads
|--------------------------------------------------------------------------
*/

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SIM Store API is running'
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(userRouters);
app.use(productRouters);
app.use(cartRouters);
app.use(orderRouters);
app.use(wishlistRouters);
app.use(couponRouters);
app.use(aiRouters);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
|
| IMPORTANT:
| We start listening BEFORE connecting to MongoDB.
| This allows Fly.io to detect the application port immediately.
|
*/

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`SIM Store API running on port ${port}`);

  /*
  |--------------------------------------------------------------------------
  | MongoDB Connection
  |--------------------------------------------------------------------------
  */

  dbConnection()
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('MongoDB connection failed:');
      console.error(error.message);
    });
});

/*
|--------------------------------------------------------------------------
| Server Error
|--------------------------------------------------------------------------
*/

server.on('error', (error) => {
  console.error('Server error:', error);
});