import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true, // allow cookies/headers from ffrontend
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products/invoice", invoiceRoutes);
app.use("/api/products", productRoutes);

mongoose.connect(process.env.MONGO_URI as string)  // .env me yaad se daalna h
  .then(() => console.log("MongoDB Atlas Connected Hogya"))
  .catch(err => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
