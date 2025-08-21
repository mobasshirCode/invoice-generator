import { Request, Response } from "express";
import Product from "../models/Product";

// Add product
export const addProduct = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      price,
      quantity,
      user: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err });
  }
};

// Get products
export const getProducts = async (req: Request & { user?: any }, res: Response) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

//Delete
export const deleteProduct = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", product });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};
