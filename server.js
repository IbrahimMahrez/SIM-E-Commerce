import express from 'express'
import cors from 'cors';
import { dbConnection } from './db/dbConnection.js'
import { userRouters } from './src/modules/user/user.routes.js';
import { productRouters } from './src/modules/product/product.routes.js';
import { cartRouters } from './src/modules/cart/cart.routes.js';
import { errorHandler } from './src/utilities/middleware/errorHandler.js';



const app = express();
app.use(express.json());
app.use(cors())
// Connect to DB
dbConnection();



app.use(userRouters)
app.use(productRouters);
app.use(cartRouters)
app.use('/uploads', express.static('uploads'));

app.use(errorHandler);


app.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});