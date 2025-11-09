














// // backend/routes/groupRoutes.js
// import express from "express";
// import { Op } from "sequelize";
// import { User, ChatGroup, ChatMessage } from "../models/associations.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // ======================================================
// // 1️⃣ Get all users (contacts list, exclude current user)
// // ======================================================
// router.get("/users", protect, async (req, res) => {
//   try {
//     const currentUserId = req.user.id;

//     const users = await User.findAll({
//       where: { id: { [Op.ne]: currentUserId } },
//       attributes: ["id", "name", "email"],
//       order: [["name", "ASC"]],
//     });

//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

// // ======================================================
// // 2️⃣ Fetch or create a channel between current user and another user
// // ======================================================
// router.post("/channel/:userId", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const senderId = req.user.id;

//     if (senderId === parseInt(userId)) {
//       return res.status(400).json({ message: "Cannot create a channel with yourself" });
//     }

//     // Check if recipient exists
//     const recipient = await User.findByPk(userId);
//     if (!recipient) return res.status(404).json({ message: "User not found" });

//     // Use a consistent channel name (direct chat)
//     const channelName = `Channel:${[senderId, userId].sort().join("_")}`;

//     // Find or create the ChatGroup
//     let channel = await ChatGroup.findOne({
//       where: { name: channelName },
//       include: [{ model: User, as: "participants" }],
//     });

//     if (!channel) {
//       channel = await ChatGroup.create({ name: channelName, type: "direct", owner_id: senderId });
//       await channel.addParticipants([senderId, parseInt(userId)]);
//     }

//     res.json({ channel: { id: channel.id, name: channel.name } });
//   } catch (err) {
//     console.error("Error fetching/creating channel:", err);
//     res.status(500).json({ message: "Failed to get or create channel" });
//   }
// });

// // ======================================================
// // 3️⃣ Send a message to a channel (direct chat)
// // ======================================================
// router.post("/channel/:userId/message", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { content } = req.body;
//     const senderId = req.user.id;

//     if (!content) return res.status(400).json({ message: "Message content required" });

//     // Ensure channel exists
//     const channelName = `Channel:${[senderId, userId].sort().join("_")}`;
//     let channel = await ChatGroup.findOne({ where: { name: channelName } });
//     if (!channel) {
//       channel = await ChatGroup.create({ name: channelName, type: "direct", owner_id: senderId });
//       await channel.addParticipants([senderId, parseInt(userId)]);
//     }

//     // Create the message
//     const message = await ChatMessage.create({
//       content,
//       senderId,
//       groupId: channel.id,
//       recipientId: parseInt(userId),
//     });

//     // Include sender info
//     const messageWithSender = await ChatMessage.findByPk(message.id, {
//       include: [{ model: User, as: "senderUser", attributes: ["id", "name"] }],
//     });

//     res.status(201).json(messageWithSender);
//   } catch (err) {
//     console.error("Error sending message:", err);
//     res.status(500).json({ message: "Failed to send message" });
//   }
// });

// // ======================================================
// // 4️⃣ Get all messages between current user and another user
// // ======================================================
// router.get("/channel/:userId/messages", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const currentUserId = req.user.id;

//     const messages = await ChatMessage.findAll({
//       where: {
//         [Op.or]: [
//           { senderId: currentUserId, recipientId: userId },
//           { senderId: userId, recipientId: currentUserId },
//         ],
//       },
//       include: [{ model: User, as: "senderUser", attributes: ["id", "name"] }],
//       order: [["createdAt", "ASC"]],
//     });

//     res.json(messages);
//   } catch (err) {
//     console.error("Failed to fetch messages:", err);
//     res.status(500).json({ message: "Failed to fetch messages" });
//   }
// });

// export default router;






















































// // routes/groupRoutes.js
// import express from "express";
// import { Op } from "sequelize";
// import { User } from "../models/associations.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import { getChannelMessages, postChannelMessage } from "../controllers/messageController.js";

// const router = express.Router();

// // -------------------------
// // 1️⃣ Get all users (contacts list, exclude current user)
// // -------------------------
// router.get("/users", protect, async (req, res) => {
//   try {
//     const currentUserId = req.user.id;

//     const users = await User.findAll({
//       where: { id: { [Op.ne]: currentUserId } },
//       attributes: ["id", "name", "email"],
//       order: [["name", "ASC"]],
//     });

//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

// // -------------------------
// // 2️⃣ Get all messages for a user's channel
// // -------------------------
// router.get("/channels/:userId/messages", protect, getChannelMessages);

// // -------------------------
// // 3️⃣ Send a message to a user's channel
// // -------------------------
// router.post("/channels/:userId/messages", protect, postChannelMessage);

// export default router;

// routes/groupRoutes.js
import express from "express";
import { Op } from "sequelize";
import { User } from "../models/associations.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getChannelMessages, postChannelMessage } from "../controllers/messageController.js";

const router = express.Router();

// -------------------------
// 1️⃣ Get all users (contacts list, exclude current user)
// -------------------------
router.get("/users", protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.findAll({
      where: { id: { [Op.ne]: currentUserId } },
      attributes: ["id", "name", "email"],
      order: [["name", "ASC"]],
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// -------------------------
// 2️⃣ Get all messages for a user's channel
// -------------------------
router.get("/channels/:userId/messages", protect, getChannelMessages);

// -------------------------
// 3️⃣ Send a message to a user's channel
// -------------------------
router.post("/channels/:userId/messages", protect, postChannelMessage);

export default router;
