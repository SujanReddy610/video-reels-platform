// import express from "express";
// import { postAnswer } from "../controllers/answerController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // POST /api/questions/:id/answer
// router.post("/:id/answer", authMiddleware, postAnswer);

// export default router;








// import express from "express";
// import { postAnswer, getAnswersByQuestion } from "../controllers/answerController.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // POST an answer to a question (any logged-in user)
// router.post("/:id/answer", protect, postAnswer);

// // GET all answers for a specific question
// router.get("/:id/answers", protect, getAnswersByQuestion);

// export default router;
// routes/answerRoutes.js
import express from "express";
import { postAnswer, getAnswersByQuestion } from "../controllers/answerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST an answer to a question (any logged-in user)
router.post("/:id/answer", protect, postAnswer);

// GET all answers for a specific question
router.get("/:id/answers", protect, getAnswersByQuestion);

export default router;
