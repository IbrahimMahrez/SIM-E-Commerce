import { cartModel } from "../../../db/modules/cart.model.js";
import { productModel } from "../../../db/modules/product.model.js";






const getUserCart = async (req, res, next) => {
  try {
    const userId = req.decoded._id;

    const cart = await cartModel.findOne({ userId })
      .populate({  path: "items.productId",  select: "id title price"  });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartDetails = cart.items.map(item => ({
      productId: item.productId.id, 
      title: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity
    }));
    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: cartDetails
    });
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.decoded._id;
    const { id, quantity } = req.body; 
    const product = await productModel.findOne({ id }); 
    if (!product) return res.status(404).json({ message: "Product not found" });
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({
        userId,
        items: [{ productId: product._id, quantity: quantity || 1 }]
      });
    } else {
      const existingItem = cart.items.find(item => item.productId.equals(product._id));
      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ productId: product._id, quantity: quantity || 1 });
      }
    }
    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.decoded._id;
    const { id, quantity } = req.body; 
    if (!req.decoded || !userId) {
      return res.status(401).json({ message: " Please log in first" });
    }
    if (!id || !quantity) {
      return res.status(400).json({ message: "Please provide product id and quantity" });
    }
    const product = await productModel.findOne({ id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find(item => item.productId.equals(product._id));
    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (err) {
    next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.decoded._id;
    const { id } = req.body; 
    if (!req.decoded || !userId) {
      return res.status(401).json({ message: "Please log in first" });
    }
    const product = await productModel.findOne({ id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const updatedItems = cart.items.filter(item => !item.productId.equals(product._id));
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Product not in cart" });
    }
    cart.items = updatedItems;
    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (err) {
    next(err);
  }
};


export { 
   getUserCart,
   addToCart ,
    updateCartItem , 
    removeCartItem  
}