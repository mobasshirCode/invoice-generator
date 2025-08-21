import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addProduct, getProducts, deleteProduct } from "../controllers/productController";

const router = express.Router();

// Add product
router.post("/", authMiddleware, addProduct);

// Get all products
router.get("/", authMiddleware, getProducts);

// Delete product
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
