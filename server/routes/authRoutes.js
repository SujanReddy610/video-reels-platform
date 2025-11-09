// // routes/authRoutes.js
// import express from 'express';
// import { signup, login } from '../controllers/authController.js'; // match your controller functions

// const router = express.Router();

// // POST /api/auth/register - create a new user
// router.post('/register', signup);

// // POST /api/auth/login - login an existing user
// router.post('/login', login);

// export default router;
















// import express from 'express';
// import { registerUser, loginUser, getMe } from '../controllers/authController.js';
// import { protect } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // Register new user
// router.post('/register', registerUser);

// // Login existing user
// router.post('/login', loginUser);

// // Get current user info (protected route)
// router.get('/me', protect, getMe);

// export default router;
// authRoutes.js
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- Auth Routes ----------------

// Register a new user
// POST /api/auth/register
router.post("/register", registerUser);

// Login user
// POST /api/auth/login
router.post("/login", loginUser);

// Get current logged-in user
// GET /api/auth/me
router.get("/me", protect, getMe);

export default router;
