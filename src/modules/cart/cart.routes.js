import express from 'express'
import { addToCart, getUserCart, removeCartItem, updateCartItem } from './cart.controller.js'
import { verifyToken } from '../../utilities/middleware/verfiyToken.js'
import { productModel } from "../../../db/modules/product.model.js";


export const cartRouters=express.Router()

cartRouters.use(express.json())


cartRouters.get('/cart', verifyToken,getUserCart)

cartRouters.post("/cartadd", verifyToken, addToCart);

cartRouters.put("/updatecart", verifyToken, updateCartItem);  

cartRouters.delete("/removecart", verifyToken, removeCartItem); 