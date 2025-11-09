// // controllers/notificationController.js
// import Notification from "../models/Notification.js";
// import Subscription from "../models/Subscription.js";
// import Video from "../models/Video.js";
// import User from "../models/User.js";

// /**
//  * Fetch all notifications for the logged-in user
//  * GET /api/notifications
//  */
// export const getNotifications = async (req, res) => {
//   try {
//     // Ensure the user is authenticated
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized: User not found" });
//     }

//     const userId = req.user.id;

//     // Fetch notifications with associated video and creator info
//     const notifications = await Notification.findAll({
//       where: { userId },
//       order: [["createdAt", "DESC"]],
//       include: [
//         {
//           model: Video,
//           as: "video", // alias must match Notification.belongsTo(Video)
//           attributes: ["id", "title"],
//         },
//         {
//           model: User,
//           as: "creator", // alias must match Notification.belongsTo(User) if you want creator info
//           attributes: ["id", "name"],
//         },
//       ],
//     });

//     res.status(200).json(notifications);
//   } catch (err) {
//     console.error("Fetch Notifications Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// /**
//  * Mark a single notification as read
//  * POST /api/notifications/read/:id
//  */
// export const markAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) return res.status(400).json({ message: "Notification ID is required" });

//     const notification = await Notification.findByPk(id);
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }

//     notification.isRead = true;
//     await notification.save();

//     res.status(200).json({ success: true, notification });
//   } catch (err) {
//     console.error("Mark Notification As Read Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// /**
//  * Create notifications for all subscribers when a new video is uploaded
//  * @param {Object} video - Uploaded video object
//  * @param {Object} creator - User object of the video creator
//  */
// export const notifySubscribers = async (video, creator) => {
//   try {
//     if (!video || !creator) return;

//     // Fetch all subscribers of this creator
//     const subscribers = await Subscription.findAll({
//       where: { subscribedToId: creator.id },
//     });

//     if (!subscribers.length) return;

//     // Prepare notifications
//     const messages = subscribers.map((sub) => ({
//       userId: sub.subscriberId,
//       videoId: video.id,
//       message: `${creator.name} uploaded a new video: ${video.title}`,
//       isRead: false,
//     }));

//     await Notification.bulkCreate(messages);
//   } catch (err) {
//     console.error("Notify Subscribers Error:", err);
//   }
// };
// controllers/notificationController.js
import Notification from "../models/Notification.js";
import Subscription from "../models/Subscription.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

/**
 * Create notifications for all subscribers when a new video is uploaded
 * Call this function after a video is successfully uploaded
 * @param {Object} video - Newly uploaded video object
 * @param {Object} creator - Creator/User object who uploaded the video
 */
export const notifySubscribers = async (video, creator) => {
  try {
    if (!video || !creator) return;

    // Find all subscribers of the creator
    const subscribers = await Subscription.findAll({
      where: { subscribedToId: creator.id }, // Assuming your Subscription model has subscriberId and subscribedToId
    });

    if (!subscribers.length) return;

    // Prepare notification records
    const notifications = subscribers.map((sub) => ({
      userId: sub.subscriberId,  // Recipient
      videoId: video.id,         // Related video
      message: `${creator.name} uploaded a new video: ${video.title}`,
      isRead: false,
    }));

    // Save notifications in bulk
    await Notification.bulkCreate(notifications);
    console.log(`[Notification] Created ${notifications.length} notifications for subscribers.`);
  } catch (err) {
    console.error("Error notifying subscribers:", err);
  }
};

/**
 * Fetch notifications for logged-in user
 * GET /api/notifications
 */
export const getNotifications = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const userId = req.user.id;

  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Video,
          as: "video",
          attributes: ["id", "title"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name"], // optional: sender info if needed
        },
      ],
    });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error while fetching notifications.", error: err.message });
  }
};

/**
 * Mark notifications as read
 * POST /api/notifications/read
 * Body: { notificationId } (optional, if absent marks all as read)
 */
export const markAsRead = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const userId = req.user.id;
  const { notificationId } = req.body;

  try {
    if (notificationId) {
      const [updatedRows] = await Notification.update(
        { isRead: true },
        { where: { id: notificationId, userId } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Notification not found or not owned by user." });
      }

      return res.status(200).json({ message: `Notification ${notificationId} marked as read.` });
    } else {
      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      );
      return res.status(200).json({ message: "All unread notifications marked as read." });
    }
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ message: "Failed to mark notifications as read.", error: err.message });
  }
};
