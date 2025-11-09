// import Question from "../models/Question.js";
// import User from "../models/User.js";
// import Video from "../models/Video.js";

// // -------------------------
// // POST: Ask a Question (any user)
// // -------------------------
// export const askQuestion = async (req, res) => {
//   try {
//     const { videoId, text, timestamp } = req.body;

//     if (!videoId || !text) {
//       return res.status(400).json({ message: "videoId and text are required" });
//     }

//     const question = await Question.create({
//       videoId,
//       userId: req.user.id,
//       text,
//       timestamp: timestamp || 0,
//     });

//     // Include user info
//     const questionWithUser = await Question.findByPk(question.id, {
//       include: [{ model: User, attributes: ["id", "name"] }],
//     });

//     res.status(201).json(questionWithUser);
//   } catch (err) {
//     console.error("❌ Error asking question:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // -------------------------
// // GET: All Questions (admin only)
// // -------------------------
// export const getAllQuestionsForAdmin = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const questions = await Question.findAll({
//       include: [
//         { model: User, attributes: ["id", "name", "email"] },
//         { model: Video, attributes: ["id", "title"] },
//       ],
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json(questions);
//   } catch (err) {
//     console.error("❌ Error fetching questions:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // -------------------------
// // GET: Questions for a specific video
// // -------------------------
// export const getQuestionsByVideo = async (req, res) => {
//   try {
//     const { videoId } = req.params;

//     const questions = await Question.findAll({
//       where: { videoId },
//       include: [{ model: User, attributes: ["id", "name"] }],
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json(questions);
//   } catch (err) {
//     console.error("❌ Error fetching questions for video:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // -------------------------
// // PUT: Admin Answers a Question
// // -------------------------
// export const answerQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { answer } = req.body;

//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const question = await Question.findByPk(id, {
//       include: [{ model: User, attributes: ["id", "name"] }],
//     });

//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     question.answer = answer;
//     await question.save();

//     res.status(200).json(question);
//   } catch (err) {
//     console.error("❌ Error answering question:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import { Question, Answer, User } from "../models/associations.js";
import Video from "../models/Video.js";
import { updateQnABadges } from "../utils/badgeUtils.js";

// ---------------------
// 1. Ask a Question (POST /api/questions/ask)
// ---------------------
export const askQuestion = async (req, res) => {
  const userId = req.user.id;
  const { videoId, text, timestamp } = req.body;

  if (!videoId || !text) {
    return res.status(400).json({ message: "Video ID and question text are required." });
  }

  try {
    // 1️⃣ Create the question
    const question = await Question.create({
      userId,
      videoId,
      text,
      timestamp: timestamp || 0,
      isAnswered: false,
    });

    // 2️⃣ Fetch updated question with asker info
    const newQuestion = await Question.findByPk(question.id, {
      include: [{ model: User, as: 'asker', attributes: ['id', 'name'] }]
    });

    // 3️⃣ Update badges for this user
    await updateQnABadges(userId);

    // 4️⃣ Send response
    res.status(201).json(newQuestion);

  } catch (err) {
    console.error("Error asking question:", err);
    res.status(500).json({ message: "Failed to submit question.", error: err.message });
  }
};

// ---------------------
// 2. Get Questions by Video (GET /api/questions/video/:videoId)
// ---------------------
export const getQuestionsByVideo = async (req, res) => {
  const { videoId } = req.params;

  try {
    const questions = await Question.findAll({
      where: { videoId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'asker', attributes: ['id', 'name'] },
        {
          model: Answer,
          as: 'responses',
          include: [{ model: User, as: 'answerer', attributes: ['id', 'name'] }],
          order: [['createdAt', 'ASC']]
        }
      ],
    });

    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching questions for video:", err);
    res.status(500).json({ message: "Failed to fetch questions.", error: err.message });
  }
};

// ---------------------
// 3. Get All Questions for Admin (GET /api/questions/admin/all)
// ---------------------
export const getAllQuestionsForAdmin = async (req, res) => {
  console.warn(`⚠️ Admin route accessed by user ID: ${req.user.id}. Add robust role check!`);

  try {
    const questions = await Question.findAll({
      order: [
        ['isAnswered', 'ASC'],
        ['createdAt', 'DESC']
      ],
      include: [
        { model: User, as: 'asker', attributes: ['id', 'name'] },
        {
          model: Answer,
          as: 'responses',
          include: [{ model: User, as: 'answerer', attributes: ['id', 'name'] }]
        }
      ],
    });

    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching all questions for admin:", err);
    res.status(500).json({ message: "Failed to fetch all questions.", error: err.message });
  }
};

// ---------------------
// 4. Admin Answer/Update Question (PUT /api/questions/admin/answer/:id)
// ---------------------
export const answerQuestion = async (req, res) => {
  const questionId = req.params.id;
  const userId = req.user.id;
  const { answerText } = req.body;

  try {
    const question = await Question.findByPk(questionId);
    if (!question) return res.status(404).json({ message: "Question not found." });

    await question.update({ isAnswered: true });

    let newAnswer = null;
    if (answerText) {
      newAnswer = await Answer.create({
        questionId: question.id,
        userId,
        text: answerText
      });
    }

    res.status(200).json({
      message: `Question ${questionId} updated and answered.`,
      questionId: question.id,
      answer: newAnswer
    });

  } catch (err) {
    console.error("Error answering question (admin):", err);
    res.status(500).json({ message: "Failed to update question status or post answer.", error: err.message });
  }
};

// ---------------------
// 5. Fetch All Questions Globally (GET /api/questions/)
// ---------------------
export const getAllQuestionsGlobal = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [
        { model: User, as: "asker", attributes: ["id", "name"] },
        { model: Video, as: "Video", attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching questions" });
  }
};
