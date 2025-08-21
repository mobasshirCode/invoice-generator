import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment variables");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Example route
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from Vercel Backend!" });
});


export default app;
