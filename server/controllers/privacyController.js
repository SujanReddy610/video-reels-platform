// controllers/privacyController.js
import PrivacyModel from "../models/privacyModel.js"; // your model

// Get privacy settings for the current user
export const getPrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const privacy = await PrivacyModel.findOne({ userId });

    if (!privacy) {
      // return default settings if none exist
      return res.json({
        videoVisibility: "public",
        allowMessages: "everyone",
        showBadges: true,
      });
    }

    res.json(privacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch privacy settings" });
  }
};

// Update privacy settings
export const updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoVisibility, allowMessages, showBadges } = req.body;

    let privacy = await PrivacyModel.findOne({ userId });

    if (privacy) {
      privacy.videoVisibility = videoVisibility;
      privacy.allowMessages = allowMessages;
      privacy.showBadges = showBadges;
      await privacy.save();
    } else {
      privacy = await PrivacyModel.create({
        userId,
        videoVisibility,
        allowMessages,
        showBadges,
      });
    }

    res.json({ message: "Privacy settings updated", privacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update privacy settings" });
  }
};
