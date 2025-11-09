// import express from "express";
// import { protect } from "../middlewares/authMiddleware.js";
// import {
//   askQuestion,
//   getAllQuestionsForAdmin,
//   getQuestionsByVideo,
//   answerQuestion,
// } from "../controllers/questionController.js";

// const router = express.Router();

// // ------------------- User Routes -------------------
// // Ask a question (any logged-in user)
// router.post("/ask", protect, askQuestion);

// // Get all questions for a specific video (any logged-in user)
// router.get("/video/:videoId", protect, getQuestionsByVideo);

// // ------------------- Admin Routes -------------------
// // Get all questions (admin only)
// router.get("/admin/all", protect, getAllQuestionsForAdmin);

// // Answer a question (admin only)
// router.put("/admin/answer/:id", protect, answerQuestion);

// export default router;






// import express from "express";
// import { protect } from "../middlewares/authMiddleware.js";
// import {
//   askQuestion,
//   getAllQuestionsForAdmin,
//   getQuestionsByVideo,
//   answerQuestion,
// } from "../controllers/questionController.js";

// const router = express.Router();

// // ------------------- User Routes -------------------

// // Ask a question (any logged-in user)
// router.post("/ask", protect, askQuestion);

// // Get all questions for a specific video (any logged-in user)
// router.get("/video/:videoId", protect, getQuestionsByVideo);

// // ------------------- Admin Routes -------------------

// // Get all questions (admin only)
// router.get("/admin/all", protect, getAllQuestionsForAdmin);

// // Answer a question (admin only)
// router.put("/admin/answer/:id", protect, answerQuestion);

// export default router;













import express from "express";
// At the top of questionController.js
import Video from "../models/Video.js";

import { protect } from "../middlewares/authMiddleware.js";

import {
  askQuestion,
  getAllQuestionsForAdmin,
  getQuestionsByVideo,
  answerQuestion,
  getAllQuestionsGlobal, // ✅ import the new controller
} from "../controllers/questionController.js";

const router = express.Router();

// ------------------- User Routes -------------------

// Ask a question (any logged-in user)
router.post("/ask", protect, askQuestion);

// Get all questions for a specific video (any logged-in user)
router.get("/video/:videoId", protect, getQuestionsByVideo);

// Get all questions globally (any logged-in user)
router.get("/", protect, getAllQuestionsGlobal);

// ------------------- Admin Routes -------------------

// Get all questions (admin only)
router.get("/admin/all", protect, getAllQuestionsForAdmin);

// Answer a question (admin only)
router.put("/admin/answer/:id", protect, answerQuestion);

export default router;
