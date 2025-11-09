







import Badge from "../models/Badge.js";
import Video from "../models/Video.js";
import Subscription from "../models/Subscription.js";
import Question from "../models/Question.js"; // ✅ ADD THIS
import { Op } from "sequelize";

export const calculateBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    // ------------------------
    // Fetch User Data
    // ------------------------
    const videos = await Video.findAll({ where: { userId } });
    const uploadCount = videos.length;
    const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
    const subscriberCount = await Subscription.count({ where: { channelId: userId } });

    // ------------------------
    // Fetch Questions Asked by User
    // ------------------------
    const userQuestions = await Question.findAll({ where: { userId } });
    const questionCount = userQuestions.length;

    // ------------------------
    // Fetch All Videos for Matching
    // ------------------------
    const allVideos = await Video.findAll({ attributes: ["id", "title", "description"] });

    // ------------------------
    // Calculate Badges
    // ------------------------
    const badges = [];

    // 🎥 Uploaded 5+ videos
    if (uploadCount >= 5) badges.push("Content Creator 🎥");

    // 👍 50+ total likes
    if (totalLikes >= 50) badges.push("Audience Favorite 👍");

    // 🌟 10+ subscribers
    if (subscriberCount >= 10) badges.push("Rising Star 🌟");

    // 💡 Asked 5+ questions
    if (questionCount >= 5) badges.push("Curious Mind 💡");

    // 📝 Asked a question related to a video description
    const hasDescriptionMatch = userQuestions.some((q) => {
      const questionText = q.text?.toLowerCase() || "";
      return allVideos.some((v) => {
        const desc = v.description?.toLowerCase() || "";
        if (!desc) return false;
        const descriptionWords = desc.match(/\b\w{3,}\b/g) || [];
        return descriptionWords.some((word) => questionText.includes(word));
      });
    });

    if (hasDescriptionMatch) badges.push("Description Matcher 📝");

    // Default badge
    if (badges.length === 0) badges.push("Newcomer 🐣");

    // ------------------------
    // Save / Update Badge Record
    // ------------------------
    const [badgeRecord, created] = await Badge.findOrCreate({
      where: { userId },
      defaults: { badges },
    });

    if (!created) {
      badgeRecord.badges = badges;
      badgeRecord.updatedAt = new Date();
      await badgeRecord.save();
    }

    // ------------------------
    // Response
    // ------------------------
    res.json({
      success: true,
      message: "Badges updated successfully",
      badges: badgeRecord.badges,
    });
  } catch (error) {
    console.error("Error calculating badges:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------------
// Fetch badges for user profile
// ------------------------
export const getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;
    const badge = await Badge.findOne({ where: { userId } });
    res.json({ badges: badge ? badge.badges : ["Newcomer 🐣"] });
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
