// import express from "express";
// import { calculateBadges, getUserBadges } from "../controllers/badgeController.js";

// const router = express.Router();

// // Calculate / update user badges
// router.get("/calculate/:userId", calculateBadges);

// // Get badges for a profile
// router.get("/:userId", getUserBadges);

// export default router;
import express from "express";
import { calculateBadges, getUserBadges } from "../controllers/badgeController.js";

const router = express.Router();

// ✅ Use POST for calculation (since it modifies data)
router.post("/calculate/:userId", calculateBadges);

// ✅ Use GET for fetching badges (read-only)
router.get("/:userId", getUserBadges);

export default router;
