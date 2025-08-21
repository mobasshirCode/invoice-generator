import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { generateInvoice } from "../controllers/invoiceController";

const router = express.Router();

router.get("/", authMiddleware, generateInvoice);

export default router;
