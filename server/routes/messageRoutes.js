// // ----------------- routes/messageRoutes.js -----------------
// import express from "express";
// import ChatMessage from "../models/ChatMessage.js";
// import ChatGroup from "../models/ChatGroup.js";
// import User from "../models/User.js";
// import { protect } from "../middlewares/authMiddleware.js"; // JWT auth middleware

// const router = express.Router();

// // ---------------- GET MESSAGES FOR A GROUP ----------------
// router.get("/:groupId", protect, async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     // Check if group exists
//     const group = await ChatGroup.findByPk(groupId);
//     if (!group) return res.status(404).json({ message: "Chat group not found" });

//     // Fetch messages
//     const messages = await ChatMessage.findAll({
//       where: { groupId },
//       order: [["createdAt", "ASC"]],
//     });

//     res.json(messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch messages" });
//   }
// });

// // ---------------- SEND A NEW MESSAGE ----------------
// router.post("/:groupId", protect, async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { text } = req.body;
//     const senderId = req.user.id; // from protect middleware

//     if (!text || text.trim() === "")
//       return res.status(400).json({ message: "Message text cannot be empty" });

//     const group = await ChatGroup.findByPk(groupId);
//     if (!group) return res.status(404).json({ message: "Chat group not found" });

//     const message = await ChatMessage.create({
//       message: text,
//       senderId,
//       groupId,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send message" });
//   }
// });

// // ---------------- GET OR CREATE DIRECT CHAT ----------------
// router.post("/direct", protect, async (req, res) => {
//   try {
//     const { userId2 } = req.body; // other user
//     const userId1 = req.user.id;

//     if (!userId2) return res.status(400).json({ message: "User ID required" });
//     if (userId1 === userId2) return res.status(400).json({ message: "Cannot chat with yourself" });

//     // Find existing direct chat between the two users
//     let group = await ChatGroup.findOne({
//       where: { isDirect: true }, // optional flag for direct chats
//       include: [
//         {
//           model: User,
//           as: "members",
//           where: { id: [userId1, userId2] },
//           through: { attributes: [] },
//         },
//       ],
//     });

//     // If not exists, create a new group
//     if (!group) {
//       group = await ChatGroup.create({ name: `Direct: ${userId1}-${userId2}`, isDirect: true });
//       await group.addMembers([userId1, userId2]);
//     }

//     res.json({ id: group.id, name: group.name });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get or create direct chat" });
//   }
// });

// export default router;







// // ----------------- routes/messageRoutes.js -----------------
// import express from "express";
// import ChatMessage from "../models/ChatMessage.js";
// import ChatGroup from "../models/ChatGroup.js";
// import User from "../models/User.js";
// import { protect } from "../middlewares/authMiddleware.js"; // JWT auth middleware

// const router = express.Router();

// // ---------------- GET OR CREATE DIRECT CHAT ----------------
// // MUST be before /:groupId routes
// router.post("/direct", protect, async (req, res) => {
//   try {
//     const { userId2 } = req.body; // other user
//     const userId1 = req.user.id;

//     if (!userId2) return res.status(400).json({ message: "User ID required" });
//     if (userId1 === userId2) return res.status(400).json({ message: "Cannot chat with yourself" });

//     // Check for existing direct chat
//     let group = await ChatGroup.findOne({
//       where: { isDirect: true },
//       include: [
//         {
//           model: User,
//           as: "members",
//           where: { id: [userId1, userId2] },
//           through: { attributes: [] },
//         },
//       ],
//     });

//     // If not exists, create a new direct group
//     if (!group) {
//       group = await ChatGroup.create({ name: `Direct: ${userId1}-${userId2}`, isDirect: true });
//       await group.addMembers([userId1, userId2]);
//     }

//     res.json({ id: group.id, name: group.name });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get or create direct chat" });
//   }
// });

// // ---------------- GET MESSAGES FOR A GROUP ----------------
// router.get("/:groupId", protect, async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     // Check if group exists
//     const group = await ChatGroup.findByPk(groupId);
//     if (!group) return res.status(404).json({ message: "Chat group not found" });

//     // Fetch messages
//     const messages = await ChatMessage.findAll({
//       where: { groupId },
//       order: [["createdAt", "ASC"]],
//     });

//     res.json(messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch messages" });
//   }
// });

// // ---------------- SEND A NEW MESSAGE ----------------
// router.post("/:groupId", protect, async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { text } = req.body;
//     const senderId = req.user.id;

//     if (!text || text.trim() === "")
//       return res.status(400).json({ message: "Message text cannot be empty" });

//     const group = await ChatGroup.findByPk(groupId);
//     if (!group) return res.status(404).json({ message: "Chat group not found" });

//     const message = await ChatMessage.create({
//       message: text,
//       senderId,
//       groupId,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send message" });
//   }
// });

// export default router;






// display messages of chart
// ----------------- routes/messageRoutes.js -----------------
import express from "express";
import { Op } from "sequelize";
import ChatMessage from "../models/ChatMessage.js";
import ChatGroup from "../models/ChatGroup.js";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleware.js"; // JWT auth middleware

const router = express.Router();

// ======================================================
// 1️⃣ GET ALL USERS FOR CHAT LIST
// ======================================================
router.get("/users", protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.findAll({
      where: { id: { [Op.ne]: currentUserId } },
      attributes: ["id", "name"],
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ======================================================
// 2️⃣ GET OR CREATE DIRECT CHAT
// ======================================================
router.post("/direct", protect, async (req, res) => {
  try {
    const { userId2 } = req.body; // other user
    const userId1 = req.user.id;

    if (!userId2) return res.status(400).json({ message: "User ID required" });
    if (userId1 === userId2) return res.status(400).json({ message: "Cannot chat with yourself" });

    // Check for existing direct chat
    let group = await ChatGroup.findOne({
      where: { isDirect: true },
      include: [
        {
          model: User,
          as: "members",
          where: { id: { [Op.in]: [userId1, userId2] } },
          through: { attributes: [] },
        },
      ],
    });

    // If not exists, create a new direct group
    if (!group) {
      group = await ChatGroup.create({ name: `Direct: ${userId1}-${userId2}`, isDirect: true });
      await group.addMembers([userId1, userId2]);
    }

    res.json({ id: group.id, name: group.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get or create direct chat" });
  }
});

// ======================================================
// 3️⃣ CREATE OR FETCH CHANNEL FOR A SPECIFIC USER
// ======================================================
router.post("/channel/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user.id;

    if (parseInt(senderId) === parseInt(userId)) {
      return res.status(400).json({ message: "Cannot create channel with yourself" });
    }

    const channelName = `Channel:${userId}`;

    // Find or create the channel
    let channel = await ChatGroup.findOne({
      where: { name: channelName },
      include: [{ model: User, as: "members", through: { attributes: [] } }],
    });

    if (!channel) {
      channel = await ChatGroup.create({ name: channelName, isDirect: false });
      await channel.addMembers([userId]); // owner
    }

    // Add sender to the channel if not already
    const memberIds = channel.members.map((m) => m.id);
    if (!memberIds.includes(senderId)) {
      await channel.addMembers([senderId]);
    }

    // Fetch all messages sent to this user
    const messages = await ChatMessage.findAll({
      where: { recipientId: userId },
      include: [{ model: User, as: "senderUser", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json({ channel: { id: channel.id, name: channel.name }, messages });
  } catch (err) {
    console.error("Error fetching/creating channel:", err);
    res.status(500).json({ message: "Failed to get or create channel" });
  }
});

// ======================================================
// 4️⃣ SEND MESSAGE TO CHANNEL OR DIRECT CHAT
// ======================================================
router.post("/channel/:userId/message", protect, async (req, res) => {
  try {
    const { userId } = req.params; // recipient
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content || content.trim() === "")
      return res.status(400).json({ message: "Message content cannot be empty" });

    const channelName = `Channel:${userId}`;

    // Find or create channel
    let group = await ChatGroup.findOne({ where: { name: channelName } });
    if (!group) {
      group = await ChatGroup.create({ name: channelName, isDirect: false });
      await group.addMembers([userId, senderId]);
    }

    // Create message
    const message = await ChatMessage.create({
      message: content,
      senderId,
      recipientId: userId,
      groupId: group.id,
    });

    const messageWithSender = await ChatMessage.findByPk(message.id, {
      include: [{ model: User, as: "senderUser", attributes: ["id", "name"] }],
    });

    res.status(201).json(messageWithSender);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ======================================================
// 5️⃣ GET ALL MESSAGES FOR A CHANNEL
// ======================================================
// router.get("/channel/:userId/messages", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const messages = await ChatMessage.findAll({
//       where: { recipientId: userId },
//       include: [{ model: User, as: "senderUser", attributes: ["id", "name"] }],
//       order: [["createdAt", "ASC"]],
//     });

//     res.json(messages);
//   } catch (err) {
//     console.error("Error fetching channel messages:", err);
//     res.status(500).json({ message: "Failed to fetch channel messages" });
//   }
// });

router.get("/channel/:userId/messages", protect, async (req, res) => {
  try {
    const { userId } = req.params; // the other user
    const currentUserId = req.user.id;

    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, recipientId: userId },
          { senderId: userId, recipientId: currentUserId },
        ],
      },
      include: [{ model: User, as: "senderUser", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching channel messages:", err);
    res.status(500).json({ message: "Failed to fetch channel messages" });
  }
});

// ======================================================
// 6️⃣ GET MESSAGES FOR A GROUP (existing logic)
// ======================================================
router.get("/:groupId", protect, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await ChatGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Chat group not found" });

    const messages = await ChatMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ======================================================
// 7️⃣ SEND MESSAGE TO GROUP (existing logic)
// ======================================================
router.post("/:groupId", protect, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text } = req.body;
    const senderId = req.user.id;

    if (!text || text.trim() === "")
      return res.status(400).json({ message: "Message text cannot be empty" });

    const group = await ChatGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Chat group not found" });

    const message = await ChatMessage.create({
      message: text,
      senderId,
      groupId,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
























































// // delete code not working
// // backend/routes/messageRoutes.js
// import express from "express";
// import { Op } from "sequelize";
// import ChatMessage from "../models/ChatMessage.js";
// import ChatGroup from "../models/ChatGroup.js";
// import User from "../models/User.js";
// import { protect } from "../middlewares/authMiddleware.js"; // JWT auth middleware

// const router = express.Router();

// // ======================================================
// // 1️⃣ GET ALL USERS FOR CHAT LIST (exclude current user)
// // ======================================================
// router.get("/users", protect, async (req, res) => {
//   try {
//     const currentUserId = req.user.id;

//     const users = await User.findAll({
//       where: { id: { [Op.ne]: currentUserId } },
//       attributes: ["id", "username", "email"],
//       order: [["username", "ASC"]],
//     });

//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

// // ======================================================
// // 2️⃣ GET OR CREATE DIRECT CHAT BETWEEN TWO USERS
// // ======================================================
// router.post("/direct", protect, async (req, res) => {
//   try {
//     const { userId2 } = req.body; // recipient
//     const userId1 = req.user.id;

//     if (!userId2) return res.status(400).json({ message: "User ID required" });
//     if (userId1 === parseInt(userId2))
//       return res.status(400).json({ message: "Cannot chat with yourself" });

//     // Find existing direct chat
//     let group = await ChatGroup.findOne({
//       where: { isDirect: true },
//       include: [
//         {
//           model: User,
//           as: "participants",
//           where: { id: { [Op.in]: [userId1, userId2] } },
//           through: { attributes: [] },
//         },
//       ],
//     });

//     // If not found, create a new direct chat
//     if (!group) {
//       group = await ChatGroup.create({
//         name: `Direct:${[userId1, userId2].sort().join("_")}`,
//         isDirect: true,
//       });
//       await group.addParticipants([userId1, parseInt(userId2)]);
//     }

//     res.json({ id: group.id, name: group.name });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get or create direct chat" });
//   }
// });

// // ======================================================
// // 3️⃣ CREATE OR FETCH CHANNEL FOR SPECIFIC USER
// // ======================================================
// router.post("/channel/:userId", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const senderId = req.user.id;

//     if (parseInt(senderId) === parseInt(userId))
//       return res.status(400).json({ message: "Cannot create channel with yourself" });

//     const recipient = await User.findByPk(userId);
//     if (!recipient) return res.status(404).json({ message: "User not found" });

//     const channelName = `Channel:${[senderId, userId].sort().join("_")}`;

//     // Find or create the channel
//     let channel = await ChatGroup.findOne({
//       where: { name: channelName },
//       include: [{ model: User, as: "", through: { attributes: [] } }],
//     });

//     if (!channel) {
//       channel = await ChatGroup.create({ name: channelName, isDirect: false });
//       await channel.addParticipants([parseInt(userId), senderId]);
//     }

//     res.json({ channel: { id: channel.id, name: channel.name } });
//   } catch (err) {
//     console.error("Error fetching/creating channel:", err);
//     res.status(500).json({ message: "Failed to get or create channel" });
//   }
// });

// // ======================================================
// // 4️⃣ SEND MESSAGE TO CHANNEL OR DIRECT CHAT
// // ======================================================
// router.post("/channel/:userId/message", protect, async (req, res) => {
//   try {
//     const { userId } = req.params; // recipient
//     const { content } = req.body;
//     const senderId = req.user.id;

//     if (!content || content.trim() === "")
//       return res.status(400).json({ message: "Message content cannot be empty" });

//     const channelName = `Channel:${[senderId, userId].sort().join("_")}`;

//     let group = await ChatGroup.findOne({ where: { name: channelName } });
//     if (!group) {
//       group = await ChatGroup.create({ name: channelName, isDirect: false });
//       await group.addParticipants([senderId, parseInt(userId)]);
//     }

//     const message = await ChatMessage.create({
//       message: content,
//       senderId,
//       recipientId: parseInt(userId),
//       groupId: group.id,
//     });

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
// // 5️⃣ GET ALL MESSAGES BETWEEN TWO USERS
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
//       include: [{ model: User, as: "senderUser", attributes: ["id", "username"] }],
//       order: [["createdAt", "ASC"]],
//     });

//     res.json(messages);
//   } catch (err) {
//     console.error("Error fetching channel messages:", err);
//     res.status(500).json({ message: "Failed to fetch channel messages" });
//   }
// });

// // ======================================================
// // 6️⃣ GET ALL MESSAGES FOR A GROUP
// // ======================================================
// router.get("/:groupId", protect, async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     const group = await ChatGroup.findByPk(groupId);
//     if (!group) return res.status(404).json({ message: "Chat group not found" });

//     const messages = await ChatMessage.findAll({
//       where: { groupId },
//       include: [{ model: User, as: "senderUser", attributes: ["id", "username"] }],
//       order: [["createdAt", "ASC"]],
//     });

//     res.json(messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch messages" });
//   }
// });

// // ======================================================
// // 7️⃣ SEND MESSAGE TO GROUP
// // ======================================================
// router.post("/:groupId", protect, async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { text } = req.body;
//     const senderId = req.user.id;

//     if (!text || text.trim() === "")
//       return res.status(400).json({ message: "Message text cannot be empty" });

//     const group = await ChatGroup.findByPk(groupId);
//     if (!group) return res.status(404).json({ message: "Chat group not found" });

//     const message = await ChatMessage.create({
//       message: text,
//       senderId,
//       groupId,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send message" });
//   }
// });

// export default router;
