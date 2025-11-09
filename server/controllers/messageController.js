


// controllers/messageController.js
import { ChatGroup, ChatMessage, User } from "../models/associations.js";

// ------------------------
// Get all messages for a user's channel
export const getChannelMessages = async (req, res) => {
  try {
    const { userId } = req.params; // channel owner ID

    // Find the channel for this user
    let group = await ChatGroup.findOne({
      where: { name: `Channel:${userId}`, isGroup: true },
      include: [
        { model: User, as: "participants", attributes: ["id", "name"], through: { attributes: [] } },
      ],
    });

    if (!group) return res.status(404).json({ message: "Channel not found" });

    const messages = await ChatMessage.findAll({
      where: { groupId: group.id },
      include: [{ model: User, as: "sender", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching channel messages:", err);
    res.status(500).json({ message: "Failed to fetch channel messages" });
  }
};

// ------------------------
// Post a message to a user's channel
export const postChannelMessage = async (req, res) => {
  try {
    const { userId } = req.params; // channel owner ID
    const senderId = req.user.id;
    const { content } = req.body;

    if (!content || content.trim() === "")
      return res.status(400).json({ message: "Message cannot be empty" });

    // Find or create the channel
    let group = await ChatGroup.findOne({ where: { name: `Channel:${userId}`, isGroup: true } });
    if (!group) {
      group = await ChatGroup.create({ name: `Channel:${userId}`, isGroup: true });
      await group.addParticipants([parseInt(userId)]); // owner
    }

    // Add sender if not already a participant
    const memberIds = group.participants?.map((m) => m.id) || [];
    if (!memberIds.includes(senderId)) await group.addParticipants([senderId]);

    // Create message
    const message = await ChatMessage.create({
      message: content,
      senderId,
      groupId: group.id,
    });

    const messageWithSender = await ChatMessage.findByPk(message.id, {
      include: [{ model: User, as: "sender", attributes: ["id", "name"] }],
    });

    res.status(201).json(messageWithSender);
  } catch (err) {
    console.error("Error posting channel message:", err);
    res.status(500).json({ message: "Failed to post channel message" });
  }
};
