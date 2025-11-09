// // import express from "express";
// // import {
// //   subscribe,
// //   unsubscribe,
// //   getMySubscriptions,
// //   getSubscribers,
// // } from "../controllers/subscriptionController.js";
// // import { protect } from "../middlewares/authMiddleware.js";

// // const router = express.Router();

// // // Subscribe to a user
// // router.post("/:userId", protect, subscribe);

// // // Unsubscribe
// // router.delete("/:userId", protect, unsubscribe);

// // // Get my subscriptions
// // router.get("/me", protect, getMySubscriptions);

// // // Get subscribers of a user
// // router.get("/:userId/subscribers", protect, getSubscribers);

// // export default router;


// import express from "express";
// import {
//   subscribe,
//   unsubscribe,
//   getMySubscriptions,
//   getSubscribers,
// } from "../controllers/subscriptionController.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // Subscribe to a user
// router.post("/:userId", protect, subscribe);

// // Unsubscribe from a user
// router.delete("/:userId", protect, unsubscribe);

// // Get all subscriptions of the logged-in user
// router.get("/me", protect, getMySubscriptions);

// // Get all subscribers of a given user
// router.get("/:userId/subscribers", protect, getSubscribers);

// export default router;




// routes/subscriptionRoutes.js
// server/routes/subscriptionRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  toggleSubscription,
  getSubscriptionCount,
  isSubscribed,
} from "../controllers/subscriptionController.js";

const router = express.Router();

// ----------------------------
// Routes for Subscription System
// ----------------------------

// Toggle subscription (subscribe/unsubscribe)
// Expects body: { subscribedToId: number }
router.post("/toggle", protect, toggleSubscription);

// Get subscriber count for a user
// GET /api/subscriptions/count/:userId
router.get("/count/:userId", getSubscriptionCount);

// Check if logged-in user is subscribed to a specific user
// GET /api/subscriptions/check/:userId
router.get("/check/:userId", protect, isSubscribed);

export default router;
