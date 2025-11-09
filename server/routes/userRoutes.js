// working code
// import express from 'express';
// import { getAllUsers } from '../controllers/userController.js';

// const router = express.Router();

// // GET /api/users
// router.get('/', getAllUsers);

// export default router;


// // routes/userRoutes.js
// import express from 'express';
// import { getAllUsers, getSubscribedUsers } from '../controllers/userController.js';

// const router = express.Router();

// // Fetch all users (optional)
// router.get('/', getAllUsers);

// // Fetch subscribed users for a given user
// router.get('/subscribed/:userId', getSubscribedUsers);

// export default router;


















// temporary code for message fetch

// routes/userRoutes.js
import express from "express";
import { Op } from "sequelize";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Video from "../models/Video.js";

const router = express.Router();

// -------------------------
// GET all users
// -------------------------
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// -------------------------
// GET users subscribed by a given user
// -------------------------
router.get("/subscribed/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.findAll({
      where: { subscriberId: userId },
      include: [
        {
          model: User,
          as: "subscribedTo",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const subscribedUsers = subscriptions.map((sub) => sub.subscribedTo);
    res.json(subscribedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subscribed users", error: err.message });
  }
});

// -------------------------
// GET chat connections for a user (videos + subscriptions)
// -------------------------
// /api/users/connections/:userId/:targetUserId
// router.get("/connections/:userId/:targetUserId", async (req, res) => {
//   try {
//     const { userId, targetUserId } = req.params;

//     // Check if target user has uploaded at least one video
//     const videos = await Video.findAll({
//       where: { userId: targetUserId },
//       attributes: ["id", "title", "thumbnailUrl"],
//     });

//     if (!videos.length) {
//       return res.status(404).json({ message: "Target user has no videos" });
//     }

//     // Check subscription status
//     const subscription = await Subscription.findOne({
//       where: {
//         subscriberId: userId,
//         subscribedToId: targetUserId,
//       },
//     });

//     res.json({
//       targetUserId,
//       subscribed: !!subscription,
//       videos,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch connected users", error: err.message });
//   }
// });

router.get("/connections/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch users that current user subscribed to
    const subscriptions = await Subscription.findAll({
      where: { subscriberId: userId },
      include: [
        { model: User, as: "subscribedTo", attributes: ["id", "name", "email"] },
      ],
    });
    const subscribedUsers = subscriptions.map(sub => sub.subscribedTo);

    // Fetch users subscribed to current user
    const subscribers = await Subscription.findAll({
      where: { subscribedToId: userId },
      include: [
        { model: User, as: "subscriber", attributes: ["id", "name", "email"] },
      ],
    });
    const subscribedToMe = subscribers.map(sub => sub.subscriber);

    // Merge & deduplicate users
    const allConnections = [...subscribedUsers, ...subscribedToMe];
    const uniqueConnections = Object.values(
      allConnections.reduce((acc, user) => {
        if (user && !acc[user.id]) acc[user.id] = user;
        return acc;
      }, {})
    );

    res.json(uniqueConnections);
  } catch (err) {
    console.error("Error fetching connections:", err);
    res.status(500).json({ message: "Failed to fetch connections", error: err.message });
  }
});


export default router;
