// // import Answer from "../models/Answer.js";
// // import Question from "../models/Question.js";
// // import User from "../models/User.js";

// // // POST an answer to a question
// // export const postAnswer = async (req, res) => {
// //   try {
// //     const { id: questionId } = req.params; // Question ID from URL
// //     const { text } = req.body;
// //     const userId = req.user.id; // from auth middleware

// //     if (!text) return res.status(400).json({ message: "Answer text is required" });

// //     // Check if question exists
// //     const question = await Question.findByPk(questionId);
// //     if (!question) return res.status(404).json({ message: "Question not found" });

// //     // Create answer
// //     const answer = await Answer.create({ questionId, userId, text });

// //     // Fetch answer with user info
// //     const result = await Answer.findByPk(answer.id, {
// //       include: [{ model: User, as: "User", attributes: ["id", "name"] }],
// //     });

// //     res.status(201).json({
// //       id: result.id,
// //       text: result.text,
// //       user: result.User,
// //       createdAt: result.createdAt,
// //       updatedAt: result.updatedAt,
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// // controllers/answerController.js
// import Answer from "../models/Answer.js";
// import Question from "../models/Question.js";
// import User from "../models/User.js";

// /**
//  * POST /api/questions/:id/answer
//  * Any logged-in user can post an answer to a question
//  */
// export const postAnswer = async (req, res) => {
//   try {
//     const { id: questionId } = req.params; // Question ID from URL
//     const { text } = req.body;
//     const userId = req.user.id; // Retrieved from auth middleware

//     if (!text || text.trim() === "") {
//       return res.status(400).json({ message: "Answer text is required" });
//     }

//     // Check if question exists
//     const question = await Question.findByPk(questionId);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     // Create the answer
//     const answer = await Answer.create({ questionId, userId, text });

//     // Fetch the answer with associated user info
//     const result = await Answer.findByPk(answer.id, {
//       include: [{ model: User, as: "User", attributes: ["id", "name"] }],
//     });

//     res.status(201).json({
//       id: result.id,
//       text: result.text,
//       user: result.User, // { id, name }
//       createdAt: result.createdAt,
//       updatedAt: result.updatedAt,
//     });
//   } catch (err) {
//     console.error("❌ Error posting answer:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET answers for a specific question
//  * This is useful if you want to fetch answers separately
//  */
// export const getAnswersByQuestion = async (req, res) => {
//   try {
//     const { id: questionId } = req.params;

//     // Ensure question exists
//     const question = await Question.findByPk(questionId);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     const answers = await Answer.findAll({
//       where: { questionId },
//       include: [{ model: User, as: "User", attributes: ["id", "name"] }],
//       order: [["createdAt", "ASC"]], // oldest first
//     });

//     const formatted = answers.map((a) => ({
//       id: a.id,
//       text: a.text,
//       user: a.User,
//       createdAt: a.createdAt,
//       updatedAt: a.updatedAt,
//     }));

//     res.status(200).json(formatted);
//   } catch (err) {
//     console.error("❌ Error fetching answers:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

/**
 * POST /api/questions/:id/answer
 * Any logged-in user can post an answer to a question
 */
export const postAnswer = async (req, res) => {
  try {
    const { id: questionId } = req.params; // Question ID from URL
    const { text } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Answer text is required" });
    }

    // Check if question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Create the answer
    const answer = await Answer.create({ questionId, userId, text });

    // Fetch answer with user info
    const result = await Answer.findByPk(answer.id, {
      include: [{ model: User, as: "User", attributes: ["id", "name"] }],
    });

    res.status(201).json({
      id: result.id,
      text: result.text,
      user: result.User, // { id, name }
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  } catch (err) {
    console.error("❌ Error posting answer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/questions/:id/answers
 * Fetch all answers for a specific question
 */
export const getAnswersByQuestion = async (req, res) => {
  try {
    const { id: questionId } = req.params;

    // Ensure question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Fetch answers with user info
    const answers = await Answer.findAll({
      where: { questionId },
      include: [{ model: User, as: "User", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]], // oldest first
    });

    // Format data for frontend
    const formatted = answers.map((a) => ({
      id: a.id,
      text: a.text,
      user: a.User || { name: "Anonymous" },
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    res.status(500).json({ message: "Server error" });
  }
};
