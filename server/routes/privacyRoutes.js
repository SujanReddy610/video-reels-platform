// privacyRoutes.js
import express from "express";
import { getPrivacySettings, updatePrivacySettings } from "../controllers/privacyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get current user privacy
router.get("/me", authMiddleware, getPrivacySettings);

// Update privacy settings
router.put("/update", authMiddleware, updatePrivacySettings);

export default router;
