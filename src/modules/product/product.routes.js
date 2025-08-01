import express from 'express'
import { addProduct, deleteProduct, getProducts, updateProduct } from './product.controller.js'
import { upload } from '../../utilities/middleware/upload.js'
import { verifyAdmin } from '../../utilities/middleware/verifyAdmin.js'
import { verifyToken } from '../../utilities/middleware/verfiyToken.js'







export const productRouters=express.Router()

productRouters.use(express.json())

productRouters.get('/product', getProducts)

productRouters.post("/addProduct", verifyToken,verifyAdmin,upload.single("image"), addProduct);
productRouters.put("/products/:id", verifyToken, verifyAdmin, updateProduct);
productRouters.delete("/products/:id", verifyToken, verifyAdmin, deleteProduct);