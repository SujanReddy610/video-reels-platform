










// code to display reels

// privacy video setting
import Video from "../models/Video.js";
import User from "../models/User.js";
import VideoReaction from "../models/VideoReaction.js";
import VideoComment from "../models/VideoComment.js";
import VideoView from "../models/VideoView.js";
import Subscription from "../models/Subscription.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { Op } from "sequelize";
import { notifySubscribers } from "./notificationController.js";
import { getVideoDurationInSeconds } from "get-video-duration";

import cloudinary from "cloudinary";


// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });

// ---------------- Helper: Video Type ----------------
function getVideoType(video) {
  const duration = video.duration || 0;
  if (duration <= 60) return "reel"; // ✅ NEW type for reels (short videos)
  if (duration < 240) return "shorts";
  if (duration > 1200) return "long";
  return "trending";
}

// ---------------- Helper: Map Video ----------------
async function mapVideo(video) {
  const totalUniqueViews = await VideoView.count({ where: { videoId: video.id } });

  const likes = video.VideoReactions?.filter((r) => r.type === "like").length || 0;
  const dislikes = video.VideoReactions?.filter((r) => r.type === "dislike").length || 0;

  const comments =
    video.VideoComments?.map((c) => ({
      id: c.id,
      content: c.content,
      user: c.User ? { id: c.User.id, name: c.User.name } : null,
      createdAt: c.createdAt,
    })) || [];

  const subscriberCount = video.User
    ? await Subscription.count({ where: { subscribedToId: video.User.id } })
    : 0;

  return {
    id: video.id,
    title: video.title,
    description: video.description,
    filename: video.filename,
    videoUrl: video.videoUrl,
    views: totalUniqueViews,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
    privacy: video.privacy,
    User: video.User
      ? {
          id: video.User.id,
          name: video.User.name || video.User.email,
          subscribers: subscriberCount,
        }
      : null,
    category: video.category,
    tags: video.tags,
    duration: video.duration,
    type: getVideoType(video),
    likes,
    dislikes,
    VideoReactions: video.VideoReactions || [],
    VideoComments: comments,
  };
}

// ---------------- Helper: Check Video Access ----------------
const checkVideoAccess = async (video, currentUserId) => {
  if (!video) return false;

  if (video.userId === currentUserId) return true;
  if (video.privacy === "public") return true;
  if (video.privacy === "onlyme") return false;

  if (video.privacy === "subscribers") {
    const subscription = await Subscription.findOne({
      where: { subscriberId: currentUserId, subscribedToId: video.userId },
    });
    return !!subscription;
  }

  return false;
};


// ---------------- Cloudinary Config ----------------
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- Upload Video ----------------
export const uploadVideo = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "You must be logged in" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, description, category, tags, privacy } = req.body;
    const userId = Number(req.user.id);

    // Upload video to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
    });

    // Get duration from Cloudinary metadata or fallback
    const durationFormatted = result.duration
      ? Math.round(result.duration)
      : Math.round(await getVideoDurationInSeconds(req.file.path));

    // Save in DB
    const video = await Video.create({
      title,
      description,
      filename: result.public_id, // Cloudinary ID
      videoUrl: result.secure_url,
      userId,
      views: 0,
      category: category || null,
      tags: tags || null,
      duration: durationFormatted,
      privacy: ["private", "subscribers", "onlyme"].includes(privacy) ? privacy : "public",
    });

    const creator = await User.findByPk(userId);
    await notifySubscribers(video, creator);

    // Remove local file
    await fs.unlink(req.file.path);

    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ message: "Video upload failed", error: err.message });
  }
};

// ---------------- Delete Video ----------------
export const deleteVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = Number(req.user.id);

    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.userId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    const filename = video.filename;

    // Delete reactions, comments, views
    await Promise.all([
      VideoReaction.destroy({ where: { videoId } }),
      VideoComment.destroy({ where: { videoId } }),
      VideoView.destroy({ where: { videoId } }),
    ]);

    // Delete video from Cloudinary
    try {
      await cloudinary.v2.uploader.destroy(filename, { resource_type: "video" });
    } catch (err) {
      console.warn(`Cloudinary deletion failed: ${err.message}`);
    }

    // Delete DB record
    await video.destroy();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("deleteVideo error:", err);
    res.status(500).json({ message: "Failed to delete video", error: err.message });
  }
};

// ---------------- Get Single Video ----------------
export const getVideoById = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user?.id;

    const video = await Video.findByPk(videoId, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
    });

    if (!video) return res.status(404).json({ message: "Video not found" });

    const canAccess = await checkVideoAccess(video, userId || 0);
    if (!canAccess)
      return res.status(403).json({ message: "You are not allowed to view this video" });

    const mappedVideo = await mapVideo(video);
    res.status(200).json(mappedVideo);
  } catch (err) {
    console.error("getVideoById error:", err);
    res.status(500).json({ message: "Failed to fetch video", error: err.message });
  }
};

// ---------------- Get Public Videos (Home Feed) ----------------
export const getPublicVideos = async (req, res) => {
  try {
    const userId = req.user?.id || 0;

    const videos = await Video.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const filteredVideos = [];
    for (let video of videos) {
      if (await checkVideoAccess(video, userId)) filteredVideos.push(video);
    }

    const mappedVideos = await Promise.all(filteredVideos.map(mapVideo));
    res.status(200).json(mappedVideos);
  } catch (err) {
    console.error("getPublicVideos error:", err);
    res.status(500).json({ message: "Failed to fetch public videos", error: err.message });
  }
};

// ---------------- ✅ Get Reels (short public videos) ----------------
export const getReels = async (req, res) => {
  try {
    const reels = await Video.findAll({
      where: {
        duration: { [Op.lte]: 60 }, // only <= 60 seconds
        privacy: "public",
      },
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const mappedReels = await Promise.all(reels.map(mapVideo));
    res.status(200).json(mappedReels);
  } catch (err) {
    console.error("getReels error:", err);
    res.status(500).json({ message: "Failed to fetch reels", error: err.message });
  }
};

// ---------------- Get Network Videos ----------------
export const getNetworkVideos = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const subscriptions = await Subscription.findAll({
      where: { subscriberId: userId },
      attributes: ["subscribedToId"],
    });

    const subscribedIds = subscriptions.map((s) => s.subscribedToId);
    if (subscribedIds.length === 0)
      return res.status(200).json({ message: "No subscriptions yet", videos: [] });

    const videos = await Video.findAll({
      where: { userId: subscribedIds },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const filteredVideos = [];
    for (let video of videos) {
      if (await checkVideoAccess(video, userId)) filteredVideos.push(video);
    }

    const mappedVideos = await Promise.all(filteredVideos.map(mapVideo));
    res.status(200).json(mappedVideos);
  } catch (err) {
    console.error("getNetworkVideos error:", err);
    res.status(500).json({ message: "Failed to fetch network videos", error: err.message });
  }
};

// ---------------- Get My Videos ----------------
export const getMyVideos = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const videos = await Video.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const mappedVideos = await Promise.all(videos.map(mapVideo));
    res.status(200).json(mappedVideos);
  } catch (err) {
    console.error("getMyVideos error:", err);
    res.status(500).json({ message: "Failed to fetch my videos", error: err.message });
  }
};

// ---------------- Search Videos ----------------
export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.status(400).json({ message: "Query required" });

    const query = q.trim();
    const videos = await Video.findAll({
      where: { title: { [Op.like]: `%${query}%` } },
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const filteredVideos = [];
    const userId = req.user?.id || 0;
    for (let video of videos) {
      if (await checkVideoAccess(video, userId)) filteredVideos.push(video);
    }

    const mappedVideos = await Promise.all(filteredVideos.map(mapVideo));
    res.status(200).json(mappedVideos);
  } catch (err) {
    console.error("searchVideos error:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

// ---------------- Get Videos by Type ----------------
export const getVideosByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!["shorts", "trending", "long", "reel"].includes(type))
      return res.status(400).json({ message: "Invalid type" });

    const videos = await Video.findAll({
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: VideoReaction, attributes: ["type", "userId"] },
        { model: VideoComment, include: [{ model: User, attributes: ["id", "name"] }] },
      ],
    });

    const filteredVideos = [];
    const userId = req.user?.id || 0;
    for (let video of videos) {
      if (await checkVideoAccess(video, userId) && getVideoType(video) === type) {
        filteredVideos.push(video);
      }
    }

    const mappedVideos = await Promise.all(filteredVideos.map(mapVideo));
    res.status(200).json(mappedVideos);
  } catch (err) {
    console.error("getVideosByType error:", err);
    res.status(500).json({ message: "Failed to fetch videos by type", error: err.message });
  }
};

// ---------------- Update, Delete, IncrementView, React, Comment remain unchanged ----------------
// ---------------- Update, Delete, IncrementView, React, Comment functions remain the same ----------------


// ---------------- Update Video ----------------
export const updateVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const { title, description, privacy } = req.body;
    const userId = Number(req.user.id);

    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.userId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    video.title = title || video.title;
    video.description = description || video.description;
    video.privacy = privacy || video.privacy;

    await video.save();
    res.status(200).json({ message: "Video updated successfully", video });
  } catch (err) {
    console.error("updateVideo error:", err);
    res.status(500).json({ message: "Failed to update video", error: err.message });
  }
};

// // ---------------- Delete Video ----------------
// export const deleteVideo = async (req, res) => {
//   try {
//     const videoId = parseInt(req.params.id);
//     const userId = Number(req.user.id);

//     const video = await Video.findByPk(videoId);
//     if (!video) return res.status(404).json({ message: "Video not found" });
//     if (video.userId !== userId)
//       return res.status(403).json({ message: "Forbidden" });

//     const filename = video.filename;

//     await Promise.all([
//       VideoReaction.destroy({ where: { videoId } }),
//       VideoComment.destroy({ where: { videoId } }),
//       VideoView.destroy({ where: { videoId } }),
//     ]);
//     await video.destroy();

//     const filePath = path.join(process.cwd(), "uploads", filename);
//     try {
//       await fs.unlink(filePath);
//     } catch {
//       console.warn(`File not found: ${filename}`);
//     }

//     res.status(200).json({ message: "Video deleted successfully" });
//   } catch (err) {
//     console.error("deleteVideo error:", err);
//     res.status(500).json({ message: "Failed to delete video", error: err.message });
//   }
// };

// ---------------- Increment View ----------------
export const incrementView = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId))
      return res.status(400).json({ message: "Invalid video ID" });

    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const userId = Number(req.user.id);
    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const [view, created] = await VideoView.findOrCreate({
      where: { videoId, userId },
      defaults: { videoId, userId },
    });

    if (created) {
      video.views += 1;
      await video.save();
    }

    res.status(200).json({ views: video.views });
  } catch (err) {
    console.error("incrementView error:", err);
    res.status(500).json({ message: "Failed to increment view", error: err.message });
  }
};

// ---------------- React Video ----------------
export const reactVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!["like", "dislike"].includes(type))
      return res.status(400).json({ message: "Invalid reaction type" });

    const userId = Number(req.user.id);
    let reaction = await VideoReaction.findOne({ where: { videoId: id, userId } });

    if (reaction) {
      if (reaction.type === type) {
        await reaction.destroy();
        return res.status(200).json({ message: "Reaction removed", type: null });
      }
      reaction.type = type;
      await reaction.save();
      return res.status(200).json(reaction);
    }

    reaction = await VideoReaction.create({ videoId: id, userId, type });
    res.status(201).json(reaction);
  } catch (err) {
    console.error("reactVideo error:", err);
    res.status(500).json({ message: "Failed to react", error: err.message });
  }
};

// ---------------- Comment Video ----------------
export const commentVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text?.trim())
      return res.status(400).json({ message: "Comment cannot be empty" });

    const userId = Number(req.user.id);
    const comment = await VideoComment.create({
      videoId: id,
      userId,
      content: text.trim(),
    });

    const populatedComment = await comment.reload({
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    res.status(201).json({
      id: populatedComment.id,
      content: populatedComment.content,
      user: populatedComment.User,
      createdAt: populatedComment.createdAt,
    });
  } catch (err) {
    console.error("commentVideo error:", err);
    res.status(500).json({ message: "Failed to comment", error: err.message });
  }
};
export { getPublicVideos as getVideos };

