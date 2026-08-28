import express from 'express'
import { addProduct, deleteProduct, getMyProducts, getProducts, getUploadImages, updateProduct } from './product.controller.js'
import { upload } from '../../utilities/middleware/upload.js'
import { verifyAdmin } from '../../utilities/middleware/verifyAdmin.js'
import { verifyToken } from '../../utilities/middleware/verfiyToken.js'
import { verifyMerchant } from '../../utilities/middleware/verifyMerchant.js'







export const productRouters=express.Router()

productRouters.use(express.json())

productRouters.get('/product', verifyToken, getProducts)
productRouters.get('/my/products', verifyToken, verifyMerchant, getMyProducts)
productRouters.get('/uploads', verifyToken, verifyMerchant, getUploadImages)

productRouters.post("/addProduct", verifyToken, verifyMerchant, upload.single("image"), addProduct);
productRouters.put("/products/:id", verifyToken, verifyMerchant, upload.single("image"), updateProduct);
productRouters.delete("/products/:id", verifyToken, verifyMerchant, deleteProduct);
