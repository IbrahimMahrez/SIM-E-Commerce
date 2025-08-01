import { productModel } from "../../../db/modules/product.model.js";
import { v4 as uuidv4 } from 'uuid'; 




let getProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ message: "All products", products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};



const addProduct = async (req, res, next) => {
  try {
    const { id, title, description, price, quantity } = req.body;
    const image = req.file?.filename;

    const newProduct = await productModel.create({
      id: id || uuidv4(), 
      title,
      description,
      price,
      image,
      quantity,
      isAvailable: quantity > 0
    });

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const image = req.file?.filename;

    if (image) updates.image = image;
    if (updates.quantity != null) {
      updates.isAvailable = updates.quantity > 0;
    }
    const updatedProduct = await productModel.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

 const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productModel.findOneAndDelete({ id });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", product: deletedProduct });
  } catch (error) {
    next(error);
  }
};



export {
  getProducts,
  addProduct,
    updateProduct,
  deleteProduct
}