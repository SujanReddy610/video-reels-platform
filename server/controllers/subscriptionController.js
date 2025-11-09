// // import Subscription from "../models/Subscription.js";
// // import User from "../models/User.js";

// // // Subscribe to a user
// // export const subscribe = async (req, res) => {
// //   try {
// //     const subscriberId = req.user.id;
// //     const { userId } = req.params;

// //     if (subscriberId === parseInt(userId)) {
// //       return res.status(400).json({ message: "You cannot subscribe to yourself" });
// //     }

// //     const [subscription, created] = await Subscription.findOrCreate({
// //       where: { subscriberId, subscribedToId: userId },
// //     });

// //     if (!created) {
// //       return res.status(400).json({ message: "Already subscribed" });
// //     }

// //     res.status(201).json({ message: "Subscribed successfully", subscription });
// //   } catch (err) {
// //     res.status(500).json({ message: "Failed to subscribe", error: err.message });
// //   }
// // };

// // // Unsubscribe
// // export const unsubscribe = async (req, res) => {
// //   try {
// //     const subscriberId = req.user.id;
// //     const { userId } = req.params;

// //     const deleted = await Subscription.destroy({
// //       where: { subscriberId, subscribedToId: userId },
// //     });

// //     if (!deleted) {
// //       return res.status(404).json({ message: "Subscription not found" });
// //     }

// //     res.status(200).json({ message: "Unsubscribed successfully" });
// //   } catch (err) {
// //     res.status(500).json({ message: "Failed to unsubscribe", error: err.message });
// //   }
// // };

// // // Get my subscriptions
// // export const getMySubscriptions = async (req, res) => {
// //   try {
// //     const subscriberId = req.user.id;
// //     const subscriptions = await Subscription.findAll({
// //       where: { subscriberId },
// //       include: [{ model: User, as: "subscribedTo", attributes: ["id", "name", "email"] }],
// //     });

// //     res.status(200).json(subscriptions);
// //   } catch (err) {
// //     res.status(500).json({ message: "Failed to fetch subscriptions", error: err.message });
// //   }
// // };

// // // Get subscribers of a user
// // export const getSubscribers = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const subscribers = await Subscription.findAll({
// //       where: { subscribedToId: userId },
// //       include: [{ model: User, as: "subscriber", attributes: ["id", "name", "email"] }],
// //     });

// //     res.status(200).json(subscribers);
// //   } catch (err) {
// //     res.status(500).json({ message: "Failed to fetch subscribers", error: err.message });
// //   }
// // };

// import Subscription from "../models/Subscription.js";
// import User from "../models/User.js";

// // Subscribe to a user
// export const subscribe = async (req, res) => {
//   try {
//     const subscriberId = req.user.id;
//     const { userId } = req.params;

//     if (subscriberId === parseInt(userId)) {
//       return res.status(400).json({ message: "You cannot subscribe to yourself" });
//     }

//     const [subscription, created] = await Subscription.findOrCreate({
//       where: { subscriberId, subscribedToId: userId },
//     });

//     if (!created) {
//       return res.status(400).json({ message: "Already subscribed" });
//     }

//     res.status(201).json({ message: "Subscribed successfully", subscription });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to subscribe", error: err.message });
//   }
// };

// // Unsubscribe
// export const unsubscribe = async (req, res) => {
//   try {
//     const subscriberId = req.user.id;
//     const { userId } = req.params;

//     const deleted = await Subscription.destroy({
//       where: { subscriberId, subscribedToId: userId },
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: "Subscription not found" });
//     }

//     res.status(200).json({ message: "Unsubscribed successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to unsubscribe", error: err.message });
//   }
// };

// // Get my subscriptions
// export const getMySubscriptions = async (req, res) => {
//   try {
//     const subscriberId = req.user.id;
//     const subscriptions = await Subscription.findAll({
//       where: { subscriberId },
//       include: [{ model: User, as: "subscribedTo", attributes: ["id", "name", "email"] }],
//     });

//     res.status(200).json(subscriptions);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch subscriptions", error: err.message });
//   }
// };

// // Get subscribers of a user
// export const getSubscribers = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const subscribers = await Subscription.findAll({
//       where: { subscribedToId: userId },
//       include: [{ model: User, as: "subscriber", attributes: ["id", "name", "email"] }],
//     });

//     res.status(200).json(subscribers);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch subscribers", error: err.message });
//   }
// };









// controllers/subscriptionController.js
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

// -------------------------------
// Toggle Subscription (Subscribe/Unsubscribe)
// -------------------------------
export const toggleSubscription = async (req, res) => {
  try {
    const { subscribedToId } = req.body;
    const subscriberId = req.user.id;

    if (!subscribedToId || !subscriberId) {
      return res.status(400).json({ message: "Invalid subscription request" });
    }

    if (subscriberId === subscribedToId) {
      return res
        .status(400)
        .json({ message: "You cannot subscribe to yourself" });
    }

    // Check if already subscribed
    const existing = await Subscription.findOne({
      where: { subscriberId, subscribedToId },
    });

    if (existing) {
      await existing.destroy(); // Unsubscribe
      return res.json({ subscribed: false, message: "Unsubscribed successfully" });
    }

    // Create new subscription
    await Subscription.create({ subscriberId, subscribedToId });
    return res.json({ subscribed: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscription Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------------------
// Get subscription count for a user
// -------------------------------
export const getSubscriptionCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Subscription.count({
      where: { subscribedToId: userId },
    });

    return res.json({ count });
  } catch (err) {
    console.error("Get Subscription Count Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------------------
// Check if the current user is subscribed to a user
// -------------------------------
export const isSubscribed = async (req, res) => {
  try {
    const subscriberId = req.user.id;
    const { userId } = req.params;

    const existing = await Subscription.findOne({
      where: { subscriberId, subscribedToId: userId },
    });

    return res.json({ subscribed: !!existing });
  } catch (err) {
    console.error("Check Subscription Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
