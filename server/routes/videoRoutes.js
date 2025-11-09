










// // video privacy setting
// import express from "express";
// import fs from "fs";
// import path from "path";
// import {
//   upload,
//   uploadVideo,
//   getVideos,
//   getMyVideos,
//   updateVideo,
//   deleteVideo,
//   incrementView,
//   reactVideo,
//   commentVideo,
//   searchVideos,
//   getVideosByType,
//   getVideoById,
//   getNetworkVideos,
// } from "../controllers/videoController.js";

// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // ---------------- Protected Routes ----------------

// // Upload video (with privacy option: public/private)
// router.post("/upload", protect, upload.single("video"), uploadVideo);

// // Get all videos uploaded by the logged-in user
// router.get("/myvideos", protect, getMyVideos);

// // Update video details (including privacy)
// router.put("/:id", protect, updateVideo);

// // Delete a video
// router.delete("/:id", protect, deleteVideo);

// // Increment view count
// router.post("/:id/view", protect, incrementView);

// // Like/Dislike reaction
// router.post("/:id/react", protect, reactVideo);

// // Comment on video
// router.post("/:id/comment", protect, commentVideo);

// // ---------------- Public Routes ----------------

// // Search videos (public only)
// router.get("/search", searchVideos);

// // Get videos by type/category
// router.get("/type/:type", getVideosByType);

// // Get all *public* videos for homepage
// router.get("/public", getVideos);

// // Get network videos (based on user subscriptions/followers)
// router.get("/network", protect, getNetworkVideos);

// // Get all videos (optional, can be restricted to admin)
// router.get("/", protect, getVideos);

// // Get a single video by ID (check privacy before returning)
// router.get("/:id", protect, getVideoById);

// // ---------------- Video Streaming Route ----------------
// router.get("/stream/:filename", (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join("uploads", filename); // Adjust if needed

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send("Video not found");
//   }

//   const stat = fs.statSync(filePath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   if (range) {
//     const parts = range.replace(/bytes=/, "").split("-");
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//     const chunkSize = end - start + 1;

//     const file = fs.createReadStream(filePath, { start, end });
//     const head = {
//       "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": chunkSize,
//       "Content-Type": "video/mp4",
//     };

//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       "Content-Length": fileSize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(filePath).pipe(res);
//   }
// });

// export default router;




















// code for reels

import express from "express";
import fs from "fs";
import path from "path";
import {
  upload,
  uploadVideo,
  getVideos,
  getMyVideos,
  updateVideo,
  deleteVideo,
  incrementView,
  reactVideo,
  commentVideo,
  searchVideos,
  getVideosByType,
  getVideoById,
  getNetworkVideos,
  getReels, // ✅ Fetch Reels (short videos)
} from "../controllers/videoController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- Protected Routes ----------------

// Upload video (with privacy option: public/private)
router.post("/upload", protect, upload.single("video"), uploadVideo);

// Get all videos uploaded by the logged-in user
router.get("/myvideos", protect, getMyVideos);

// Update video details (including privacy)
router.put("/:id", protect, updateVideo);

// Delete a video
router.delete("/:id", protect, deleteVideo);

// Increment view count
router.post("/:id/view", protect, incrementView);

// Like/Dislike reaction
router.post("/:id/react", protect, reactVideo);

// Comment on video
router.post("/:id/comment", protect, commentVideo);

// ---------------- Public Routes ----------------

// Search videos
router.get("/search", searchVideos);

// Get videos by type/category
router.get("/type/:type", getVideosByType);

// ✅ Get all short videos (Reels) — duration <= 60 seconds
router.get("/reels", getReels);

// ✅ Get all *public* videos for homepage
router.get("/public", getVideos);

// ✅ Get network videos (based on user subscriptions/followers)
router.get("/network", protect, getNetworkVideos);

// ✅ Get all videos (optional, for admin or debugging)
router.get("/", protect, getVideos);

// ✅ Get a single video by ID
router.get("/:id", protect, getVideoById);

// ---------------- Video Streaming Route ----------------
// ⚡ Important: Place this route *at the end* to avoid conflicts with /:id
router.get("/stream/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("uploads", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

export default router;
