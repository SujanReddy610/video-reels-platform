










// // code for privacy setting
// // server.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// // ------------------ ROUTES ------------------
// import videoRoutes from "./routes/videoRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import subscriptionRoutes from "./routes/subscriptionRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";
// import questionRoutes from "./routes/questionRoutes.js";
// import answerRoutes from "./routes/answerRoutes.js";
// import badgeRoutes from "./routes/badgeRoutes.js"; 
// import privacyRoutes from "./routes/privacyRoutes.js"; 
// import userRoutes from "./routes/userRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js"; // <-- added chat routes
// import groupRoutes from "./routes/groupRoutes.js";



// // ------------------ MODELS ------------------
// import "./models/User.js";
// import "./models/Video.js";
// import "./models/VideoReaction.js";
// import "./models/VideoComment.js";
// import "./models/VideoView.js";
// import "./models/Subscription.js";
// import "./models/Notification.js";
// import "./models/Question.js";
// import "./models/Answer.js";
// import "./models/Badge.js"; 
// import "./models/privacyModel.js"; 

// // ------------------ ASSOCIATIONS ------------------
// import "./models/associations.js";

// // ------------------ DATABASE ------------------
// import sequelize from "./config/db.js";

// // ------------------ CONFIG ------------------
// dotenv.config();
// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ------------------ MIDDLEWARE ------------------
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ------------------ ROUTES ------------------
// app.use("/api/videos", videoRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/subscriptions", subscriptionRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/questions", questionRoutes);
// app.use("/api/answers", answerRoutes);
// app.use("/api/badges", badgeRoutes); 
// app.use("/api/privacy", privacyRoutes); 
// app.use("/api/users", userRoutes);

// // <-- CHAT / MESSAGES ROUTES -->
// app.use("/api/messages", messageRoutes);
// app.use("/api/groups", groupRoutes);

// // ------------------ ROOT TEST ROUTE ------------------
// app.get("/", (req, res) => {
//   res.send("🎬 Video Platform API is running successfully!");
// });

// // ------------------ ERROR HANDLING ------------------
// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Global Error:", err);
//   res.status(500).json({
//     message: "Internal Server Error",
//     error: err.message,
//   });
// });

// // ------------------ START SERVER ------------------
// const PORT = process.env.PORT || 5000;

// sequelize
//   .sync({ alter: true }) // Auto-update tables
//   .then(() => {
//     console.log("✅ Database synced successfully");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at: http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database sync failed:", err);
//   });




// render
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// // ------------------ ROUTES ------------------
// import videoRoutes from "./routes/videoRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import subscriptionRoutes from "./routes/subscriptionRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";
// import questionRoutes from "./routes/questionRoutes.js";
// import answerRoutes from "./routes/answerRoutes.js";
// import badgeRoutes from "./routes/badgeRoutes.js"; 
// import privacyRoutes from "./routes/privacyRoutes.js"; 
// import userRoutes from "./routes/userRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js"; 
// import groupRoutes from "./routes/groupRoutes.js";

// // ------------------ MODELS ------------------
// import "./models/User.js";
// import "./models/Video.js";
// import "./models/VideoReaction.js";
// import "./models/VideoComment.js";
// import "./models/VideoView.js";
// import "./models/Subscription.js";
// import "./models/Notification.js";
// import "./models/Question.js";
// import "./models/Answer.js";
// import "./models/Badge.js"; 
// import "./models/privacyModel.js"; 

// // ------------------ ASSOCIATIONS ------------------
// import "./models/associations.js";

// // ------------------ DATABASE ------------------
// import sequelize from "./config/db.js";

// // ------------------ CONFIG ------------------
// dotenv.config();
// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ------------------ MIDDLEWARE ------------------
// // app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ------------------ MIDDLEWARE ------------------
// const allowedOrigins = [
//   "http://localhost:5173", // Local frontend
//   "https://video-reels-platform.vercel.app", // Deployed frontend (update if different)
// ];

// // ✅ Correct CORS configuration
// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin like mobile apps or curl
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));

// app.use(express.urlencoded({ extended: true }));

// // Optional: Handle preflight requests globally
// app.options(/.*/, cors());





// // Serve uploaded files (for videos/images temporarily stored)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ------------------ API ROUTES ------------------
// app.use("/api/videos", videoRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/subscriptions", subscriptionRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/questions", questionRoutes);
// app.use("/api/answers", answerRoutes);
// app.use("/api/badges", badgeRoutes); 
// app.use("/api/privacy", privacyRoutes); 
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/groups", groupRoutes);

// // ------------------ ROOT TEST ROUTE ------------------
// app.get("/", (req, res) => {
//   res.send("🎬 Video Platform API is running successfully!");
// });

// // ------------------ ERROR HANDLING ------------------
// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Global Error:", err);
//   res.status(500).json({
//     message: "Internal Server Error",
//     error: err.message,
//   });
// });

// // ------------------ START SERVER ------------------
// const PORT = process.env.PORT || 5000;

// // Connect to PostgreSQL and start server
// sequelize
//   .sync({ alter: true }) // Automatically update tables
//   .then(() => {
//     console.log("✅ Database synced successfully");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at: http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database sync failed:", err);
//   });

// render mobile
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ------------------ ROUTES ------------------
import videoRoutes from "./routes/videoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import privacyRoutes from "./routes/privacyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

// ------------------ MODELS ------------------
import "./models/User.js";
import "./models/Video.js";
import "./models/VideoReaction.js";
import "./models/VideoComment.js";
import "./models/VideoView.js";
import "./models/Subscription.js";
import "./models/Notification.js";
import "./models/Question.js";
import "./models/Answer.js";
import "./models/Badge.js";
import "./models/privacyModel.js";

// ------------------ ASSOCIATIONS ------------------
import "./models/associations.js";

// ------------------ DATABASE ------------------
import sequelize from "./config/db.js";

// ------------------ CONFIG ------------------
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------ CORS CONFIG ------------------
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://video-reels-platform.vercel.app", // old Vercel frontend
  "https://video-reels-platform-1.onrender.com", // frontend on Render
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server and curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// ------------------ MIDDLEWARE ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ API ROUTES ------------------
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/privacy", privacyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

// ------------------ ROOT TEST ROUTE ------------------
app.get("/", (req, res) => {
  res.send("🎬 Video Platform API is running successfully!");
});

// ------------------ ERROR HANDLING ------------------

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err);
  });
