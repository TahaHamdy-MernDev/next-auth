import express from "express";
const router = express.Router();
import authRoutes from "./authRoutes";
router.use("/auth", authRoutes);
export default router;
