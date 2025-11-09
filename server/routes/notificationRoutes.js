// routes/notificationRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Fetch all notifications for the logged-in user
 * @access  Private
 */
router.get("/", protect, getNotifications);

/**
 * @route   POST /api/notifications/read/:id
 * @desc    Mark a specific notification as read
 * @access  Private
 */
router.post("/read/:id", protect, markAsRead);

export default router;
