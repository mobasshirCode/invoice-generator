import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();
console.log("route pahucha");
router.post("/register", register);
router.post("/login", login);

export default router;
