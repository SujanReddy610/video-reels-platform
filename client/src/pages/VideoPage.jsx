















// subscription user
// // src/components/VideoPage.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import API from "../api"; // Axios instance with JWT auth

// // ---------------------
// // Safe JWT Decode
// // ---------------------
// const jwt_decode = (token) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     return {};
//   }
// };

// export default function VideoPage({ token }) {
//   const { id: videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [commentText, setCommentText] = useState("");
//   const [hasViewed, setHasViewed] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   const getUserId = useCallback(() => {
//     if (!token) return null;
//     const decoded = jwt_decode(token);
//     return decoded.userId || decoded.id;
//   }, [token]);

//   const userId = getUserId();

//   // ----------------------------
//   // Fetch video and related data
//   // ----------------------------
//   const fetchVideo = useCallback(async () => {
//     if (!videoId) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await API.get(`/videos/${videoId}`);
//       setVideo(res.data);

//       // Increment view count once per visit
//       if (!hasViewed) {
//         API.post(`/videos/${videoId}/view`)
//           .then(() => setHasViewed(true))
//           .catch((err) => console.error("Failed to increment view:", err));
//       }

//       // Fetch subscription info
//       if (res.data?.User?.id) {
//         fetchSubscriptionStatus(res.data.User.id);
//         fetchSubscriberCount(res.data.User.id);
//       }
//     } catch (err) {
//       console.error("Failed to fetch video:", err);
//       setError(
//         err.response?.status === 404
//           ? "Video not found or removed."
//           : "Failed to load video."
//       );
//       setVideo(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [videoId, hasViewed]);

//   const fetchSubscriptionStatus = async (creatorId) => {
//     try {
//       const res = await API.get(`/subscriptions/check/${creatorId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setIsSubscribed(res.data.subscribed);
//     } catch (err) {
//       console.error("Failed to fetch subscription status:", err);
//     }
//   };

//   const fetchSubscriberCount = async (creatorId) => {
//     try {
//       const res = await API.get(`/subscriptions/count/${creatorId}`);
//       setSubscriberCount(res.data.count || 0);
//     } catch (err) {
//       console.error("Failed to fetch subscriber count:", err);
//     }
//   };

//   useEffect(() => {
//     fetchVideo();
//   }, [videoId, token, fetchVideo]);

//   // ----------------------------
//   // Subscribe / Unsubscribe Logic
//   // ----------------------------
//   const handleSubscribe = async () => {
//     if (!video || !video.User) return;
//     const creatorId = video.User.id;

//     console.log("Attempting subscription toggle for creatorId:", creatorId);

//     try {
//       const res = await API.post(
//         "/subscriptions/toggle",
//         { subscribedToId: creatorId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("Subscription response:", res.data);

//       setIsSubscribed(res.data.subscribed);
//       setSubscriberCount((prev) =>
//         res.data.subscribed ? prev + 1 : prev - 1
//       );
//     } catch (err) {
//       console.error("Subscription toggle failed:", err.response?.data || err);
//     }
//   };

//   // ----------------------------
//   // Reaction (Like/Dislike)
//   // ----------------------------
//   const handleReaction = async (type) => {
//     if (!video) return;
//     try {
//       const res = await API.post(`/videos/${videoId}/react`, { type });
//       const updatedReaction = res.data;

//       setVideo((prev) => {
//         if (!prev) return null;

//         const prevReaction = prev.VideoReactions?.find(
//           (r) => r.userId === updatedReaction.userId
//         );
//         let likes = prev.likes || 0;
//         let dislikes = prev.dislikes || 0;

//         if (prevReaction) {
//           if (prevReaction.type === "like") likes -= 1;
//           if (prevReaction.type === "dislike") dislikes -= 1;
//         }

//         if (updatedReaction.type) {
//           if (updatedReaction.type === "like") likes += 1;
//           if (updatedReaction.type === "dislike") dislikes += 1;
//         }

//         const newReactions =
//           prev.VideoReactions?.filter(
//             (r) => r.userId !== updatedReaction.userId
//           ) || [];
//         if (updatedReaction.type) newReactions.push(updatedReaction);

//         return { ...prev, likes, dislikes, VideoReactions: newReactions };
//       });
//     } catch (err) {
//       console.error("Reaction failed:", err);
//     }
//   };

//   // ----------------------------
//   // Comment Handling
//   // ----------------------------
//   const handleComment = async (e) => {
//     e.preventDefault();
//     const text = commentText.trim();
//     if (!text || !video) return;

//     try {
//       const res = await API.post(`/videos/${videoId}/comment`, { text });
//       setCommentText("");

//       setVideo((prev) =>
//         prev
//           ? {
//               ...prev,
//               VideoComments: [
//                 ...(prev.VideoComments || []),
//                 res.data.comment || res.data,
//               ],
//             }
//           : null
//       );
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//     }
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds || seconds < 0) return "0:00";
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = Math.floor(seconds % 60);
//     const parts = [];
//     if (h > 0) parts.push(h);
//     parts.push(m.toString().padStart(h > 0 ? 2 : 1, "0"));
//     parts.push(s.toString().padStart(2, "0"));
//     return parts.join(":");
//   };

//   if (loading) return <p className="text-xl text-blue-600">Loading video...</p>;
//   if (error) return <p className="text-xl text-red-600">{error}</p>;
//   if (!video) return <p className="text-xl text-gray-600">Video not found.</p>;

//   const userReaction = video.VideoReactions?.find((r) => r.userId === userId)
//     ?.type;
//   const formattedDuration = formatDuration(video.duration);
//   const videoSrc = video.videoUrl
//     ? `http://localhost:5000${video.videoUrl}`
//     : `http://localhost:5000/uploads/${video.filename}`;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
//       {/* Video Player */}
//       <div className="aspect-video bg-black rounded-lg overflow-hidden">
//         <video
//           src={videoSrc}
//           controls
//           autoPlay
//           className="w-full h-full"
//           onError={(e) => console.error("Video load error:", e)}
//         />
//       </div>

//       {/* Video Title */}
//       <h1 className="text-3xl font-bold mt-4">{video.title}</h1>

//       {/* Uploader + Subscribe Section */}
//       <div className="flex flex-wrap justify-between items-center text-gray-600 border-b pb-3 mb-4">
//         <div>
//           <p>
//             Uploaded by:{" "}
//             <span className="font-semibold">{video.User?.name || "Unknown"}</span>
//           </p>
//           <p className="text-sm text-gray-500">Subscribers: {subscriberCount}</p>
//         </div>

//         {/* Subscribe Button */}
//         {userId !== video.User?.id && (
//           <button
//             onClick={handleSubscribe}
//             className={`px-4 py-2 rounded-md text-white font-medium transition ${
//               isSubscribed ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
//             }`}
//           >
//             {isSubscribed ? "Subscribed" : "Subscribe"}
//           </button>
//         )}
//       </div>

//       {/* Stats */}
//       <p className="text-gray-700 mb-2">
//         {formattedDuration} • {video.views || 0} views •{" "}
//         {new Date(video.createdAt).toLocaleDateString()}
//       </p>

//       {/* Reaction Buttons */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => handleReaction("like")}
//           className={`flex items-center gap-1 px-3 py-1 rounded transition ${
//             userReaction === "like" ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 hover:bg-green-100"
//           }`}
//         >
//           👍 {video.likes || 0}
//         </button>
//         <button
//           onClick={() => handleReaction("dislike")}
//           className={`flex items-center gap-1 px-3 py-1 rounded transition ${
//             userReaction === "dislike" ? "bg-red-500 text-white shadow-lg" : "bg-gray-200 hover:bg-red-100"
//           }`}
//         >
//           👎 {video.dislikes || 0}
//         </button>
//       </div>

//       {/* Description */}
//       <p className="mb-6 whitespace-pre-wrap">{video.description}</p>

//       {/* Comments Section */}
//       <div className="border-t pt-4">
//         <h2 className="text-2xl font-semibold mb-4">
//           {video.VideoComments?.length || 0} Comments
//         </h2>

//         <form onSubmit={handleComment} className="flex gap-2 mb-6">
//           <input
//             type="text"
//             placeholder="Add a public comment..."
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             Comment
//           </button>
//         </form>

//         {(video.VideoComments || []).map((comment) => (
//           <div key={comment.id || comment._id} className="mb-3 p-3 bg-gray-50 rounded">
//             <p className="font-semibold text-sm">
//               {comment.user?.name || "Anonymous"}
//               <span className="text-xs text-gray-400 ml-2">
//                 {new Date(comment.createdAt).toLocaleDateString()}
//               </span>
//             </p>
//             <p className="text-gray-800">{comment.content}</p>
//           </div>
//         ))}

//         {video.VideoComments?.length === 0 && (
//           <p className="text-gray-500">No comments yet. Be the first!</p>
//         )}
//       </div>
//     </div>
//   );
// }










// comments not removed working not message
// working code for laptop
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useParams } from "react-router-dom";
// import API from "../api";
// import { askQuestion, getQuestions } from "../questionService";
// import { answerQuestion } from "../answerService";
// import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";

// // ---------------------
// // Safe JWT Decode
// // ---------------------
// const jwt_decode = (token) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     return {};
//   }
// };

// export default function VideoPage() {
//   const { id: videoId } = useParams();
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [commentText, setCommentText] = useState("");
//   const [hasViewed, setHasViewed] = useState(false);

//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [subscriberCount, setSubscriberCount] = useState(0);

//   const [questions, setQuestions] = useState([]);
//   const [newQuestion, setNewQuestion] = useState("");
//   const [answerText, setAnswerText] = useState("");
//   const [selectedQuestion, setSelectedQuestion] = useState(null);

//   const navigate = useNavigate();

//   const videoRef = useRef(null);
//   const token = localStorage.getItem("token") || "";

//   const getUserId = useCallback(() => {
//     if (!token) return null;
//     const decoded = jwt_decode(token);
//     return decoded.userId || decoded.id;
//   }, [token]);

//   const userId = getUserId();

//   // ----------------------------
//   // Fetch Video + Subscription + Q&A
//   // ----------------------------
//   const fetchVideo = useCallback(async () => {
//     if (!videoId) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await API.get(`/videos/${videoId}`);
//       setVideo(res.data);

//       if (!hasViewed) {
//         API.post(`/videos/${videoId}/view`).then(() => setHasViewed(true));
//       }

//       if (res.data?.User?.id) {
//         fetchSubscriptionStatus(res.data.User.id);
//         fetchSubscriberCount(res.data.User.id);
//       }

//       fetchQuestions();
//     } catch (err) {
//       console.error("Failed to fetch video:", err);
//       setError(
//         err.response?.status === 404
//           ? "Video not found or removed."
//           : "Failed to load video."
//       );
//       setVideo(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [videoId, hasViewed]);

//   // ----------------------------
//   // Subscription Handlers
//   // ----------------------------
//   const fetchSubscriptionStatus = async (creatorId) => {
//     try {
//       const res = await API.get(`/subscriptions/check/${creatorId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setIsSubscribed(res.data.subscribed);
//     } catch (err) {
//       console.error("Failed to fetch subscription status:", err);
//     }
//   };

//   const fetchSubscriberCount = async (creatorId) => {
//     try {
//       const res = await API.get(`/subscriptions/count/${creatorId}`);
//       setSubscriberCount(res.data.count || 0);
//     } catch (err) {
//       console.error("Failed to fetch subscriber count:", err);
//     }
//   };

//   const handleSubscribe = async () => {
//     if (!video || !video.User) return;
//     const creatorId = video.User.id;

//     try {
//       const res = await API.post(
//         "/subscriptions/toggle",
//         { subscribedToId: creatorId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setIsSubscribed(res.data.subscribed);
//       setSubscriberCount((prev) =>
//         res.data.subscribed ? prev + 1 : prev - 1
//       );
//     } catch (err) {
//       console.error("Subscription toggle failed:", err.response?.data || err);
//     }
//   };
  







//   // ----------------------------
//   // Fetch Q&A
//   // ----------------------------
//   const fetchQuestions = async () => {
//     if (!videoId) return;
//     try {
//       const data = await getQuestions(videoId, token);

//       const withUserAndAnswers = data.map((q) => ({
//         ...q,
//         user: q.User || { name: "Anonymous" },
//         answers: q.answers?.map((a) => ({
//           ...a,
//           user: a.User || { name: "Anonymous" },
//         })) || [],
//       }));

//       setQuestions(withUserAndAnswers);
//     } catch (err) {
//       console.error("Failed to fetch Q&A:", err);
//     }
//   };

//   useEffect(() => {
//     fetchVideo();
//   }, [videoId]);

//   // ----------------------------
//   // Reaction (Like / Dislike)
//   // ----------------------------
//   const handleReaction = async (type) => {
//     if (!video) return;
//     try {
//       const res = await API.post(`/videos/${videoId}/react`, { type });
//       const updatedReaction = res.data;

//       setVideo((prev) => {
//         if (!prev) return null;
//         const prevReaction = prev.VideoReactions?.find(
//           (r) => r.userId === updatedReaction.userId
//         );
//         let likes = prev.likes || 0;
//         let dislikes = prev.dislikes || 0;

//         if (prevReaction) {
//           if (prevReaction.type === "like") likes -= 1;
//           if (prevReaction.type === "dislike") dislikes -= 1;
//         }

//         if (updatedReaction.type) {
//           if (updatedReaction.type === "like") likes += 1;
//           if (updatedReaction.type === "dislike") dislikes += 1;
//         }

//         const newReactions =
//           prev.VideoReactions?.filter(
//             (r) => r.userId !== updatedReaction.userId
//           ) || [];
//         if (updatedReaction.type) newReactions.push(updatedReaction);

//         return { ...prev, likes, dislikes, VideoReactions: newReactions };
//       });
//     } catch (err) {
//       console.error("Reaction failed:", err);
//     }
//   };

//   // ----------------------------
//   // Comments
//   // ----------------------------
//   const handleComment = async (e) => {
//     e.preventDefault();
//     const text = commentText.trim();
//     if (!text || !video) return;

//     try {
//       const res = await API.post(
//         `/videos/${videoId}/comment`,
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCommentText("");
//       setVideo((prev) =>
//         prev
//           ? {
//               ...prev,
//               VideoComments: [
//                 ...(prev.VideoComments || []),
//                 res.data.comment || res.data,
//               ],
//             }
//           : null
//       );
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//     }
//   };

//   // ----------------------------
//   // Q&A Handlers
//   // ----------------------------
//   const handleAskQuestion = async (e) => {
//     e.preventDefault();
//     if (!token) return alert("You must be logged in");
//     if (!newQuestion.trim()) return alert("Please enter a question");

//     try {
//       const timestamp = Math.floor(videoRef.current?.currentTime || 0);
//       const data = await askQuestion(videoId, newQuestion, timestamp, token);
//       setQuestions((prev) => [
//         ...prev,
//         { ...data, user: data.User || { name: "Anonymous" } },
//       ]);
//       setNewQuestion("");
//     } catch (err) {
//       console.error("Failed to ask question:", err);
//       alert("Failed to post question");
//     }
//   };

//   const handleAnswer = async (questionId) => {
//     if (!answerText.trim() || !token) return;
//     try {
//       const data = await answerQuestion(questionId, answerText, token);
//       setQuestions((prev) =>
//         prev.map((q) =>
//           q.id === questionId
//             ? {
//                 ...q,
//                 answers: [
//                   ...(q.answers || []),
//                   { ...data, user: data.User || { name: "Anonymous" } },
//                 ],
//               }
//             : q
//         )
//       );
//       setAnswerText("");
//       setSelectedQuestion(null);
//     } catch (err) {
//       console.error("Failed to answer question:", err);
//     }
//   };

//   // ----------------------------
//   // Helpers
//   // ----------------------------
//   const formatTime = (s) => {
//     const m = Math.floor(s / 60);
//     const sec = s % 60;
//     return `${m}:${sec.toString().padStart(2, "0")}`;
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds || seconds < 0) return "0:00";
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = Math.floor(seconds % 60);
//     const parts = [];
//     if (h > 0) parts.push(h);
//     parts.push(m.toString().padStart(h > 0 ? 2 : 1, "0"));
//     parts.push(s.toString().padStart(2, "0"));
//     return parts.join(":");
//   };

//   if (loading) return <p className="text-xl text-blue-600">Loading video...</p>;
//   if (error) return <p className="text-xl text-red-600">{error}</p>;
//   if (!video) return <p className="text-xl text-gray-600">Video not found.</p>;

//   const userReaction = video.VideoReactions?.find(
//     (r) => r.userId === userId
//   )?.type;
//   const formattedDuration = formatDuration(video.duration);
//   const videoSrc = video.filename
//     ? `http://localhost:5000/api/videos/stream/${video.filename}`
//     : video.videoUrl;
//   const uploader = video?.User;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
//       {/* Video Player */}
//       <div className="aspect-video bg-black rounded-lg overflow-hidden">
//         <video
//           ref={videoRef}
//           src={videoSrc}
//           controls
//           autoPlay
//           className="w-full h-full"
//         />
//       </div>

//       <h1 className="text-3xl font-bold mt-4">{video.title}</h1>

//       {/* Uploader info */}
//       {/* <div className="flex justify-between items-center text-gray-600 border-b pb-3 mb-4">
//         <div>
//           <p>
//             Uploaded by:{" "}
//             <span className="font-semibold">
//               {video.User?.name || "Unknown"}
//             </span>
//           </p>
//           <p className="text-sm text-gray-500">
//             Subscribers: {subscriberCount}
//           </p>
//           <p className="text-gray-700 text-sm mb-2">
//             {formattedDuration} • {video.views || 0} views •{" "}
//             {new Date(video.createdAt).toLocaleDateString()}
//           </p>
//         </div>

//         {userId !== video.User?.id && (
//           <button
//             onClick={handleSubscribe}
//             className={`px-4 py-2 rounded-md text-white font-medium transition ${
//               isSubscribed
//                 ? "bg-gray-500 hover:bg-gray-600"
//                 : "bg-red-600 hover:bg-red-700"
//             }`}
//           >
//             {isSubscribed ? "Subscribed" : "Subscribe"}
//           </button>
//         )}
//       </div>
//       {/* Uploader info */}
//       <div className="flex justify-between items-center text-gray-600 border-b pb-3 mb-4">
//         <div>
//           <p>
//             Uploaded by:{" "}
//             <span className="font-semibold">
//               {video.User?.name || "Unknown"}
//             </span>
//           </p>
//           <p className="text-sm text-gray-500">
//             Subscribers: {subscriberCount}
//           </p>
//           <p className="text-gray-700 text-sm mb-2">
//             {formattedDuration} • {video.views || 0} views •{" "}
//             {new Date(video.createdAt).toLocaleDateString()}
//           </p>
//         </div>

//         <div className="flex gap-2">
//           {userId !== video.User?.id && (
//             <>
//               <button
//                 onClick={handleSubscribe}
//                 className={`px-4 py-2 rounded-md text-white font-medium transition ${
//                   isSubscribed
//                     ? "bg-gray-500 hover:bg-gray-600"
//                     : "bg-red-600 hover:bg-red-700"
//                 }`}
//               >
//                 {isSubscribed ? "Subscribed" : "Subscribe"}
//               </button>

//               {video.User && userId !== video.User.id && (
//                 <button
//                   onClick={() => {
//                     if (!video.User.id) return alert("Uploader info not available");
//                     navigate(`/messages/${video.User.id}`);
//                   }}
//                   className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
//                 >
//                   Message
//                 </button>
//               )}


//             </>
//           )}
//         </div>
//       </div>


//       {/* Reactions */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => handleReaction("like")}
//           className={`flex items-center gap-1 px-3 py-1 rounded ${
//             userReaction === "like"
//               ? "bg-green-500 text-white"
//               : "bg-gray-200 hover:bg-green-100"
//           }`}
//         >
//           👍 {video.likes || 0}
//         </button>
//         <button
//           onClick={() => handleReaction("dislike")}
//           className={`flex items-center gap-1 px-3 py-1 rounded ${
//             userReaction === "dislike"
//               ? "bg-red-500 text-white"
//               : "bg-gray-200 hover:bg-red-100"
//           }`}
//         >
//           👎 {video.dislikes || 0}
//         </button>
//       </div> 

//       {/* Description */}
//       <p className="mb-6 whitespace-pre-wrap">{video.description}</p>

//       {/* Comments */}
//       <div className="border-t pt-4">
//         <h2 className="text-2xl font-semibold mb-4">
//           {video.VideoComments?.length || 0} Comments
//         </h2>

//         <form onSubmit={handleComment} className="flex gap-2 mb-6">
//           <input
//             type="text"
//             placeholder="Add a public comment..."
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             className="flex-grow p-2 border rounded-md"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-md"
//           >
//             Comment
//           </button>
//         </form>

//         {/* Scrollable container for 5 comments */}
//         <div className="max-h-64 overflow-y-auto">
//           {(video.VideoComments || []).map((comment) => (
//             <div
//               key={comment.id || comment._id}
//               className="mb-3 p-3 bg-gray-50 rounded"
//             >
//               <p className="font-semibold text-sm">
//                 {comment.user?.name || "Anonymous"}
//                 <span className="text-xs text-gray-400 ml-2">
//                   {new Date(comment.createdAt).toLocaleDateString()}
//                 </span>
//               </p>
//               <p className="text-gray-800">{comment.content}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Q&A */}
//       {/* <div className="border-t pt-6 mt-8">
//         <h2 className="text-2xl font-semibold mb-4">Q&A / Notes</h2>

//         <form onSubmit={handleAskQuestion} className="flex gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Ask a question about this video..."
//             value={newQuestion}
//             onChange={(e) => setNewQuestion(e.target.value)}
//             className="flex-grow p-2 border rounded-md"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-purple-600 text-white px-4 py-2 rounded-md"
//           >
//             Ask
//           </button>
//         </form>

//         {questions.length === 0 ? (
//           <p className="text-gray-500">No questions yet. Be the first!</p>
//         ) : (
//           questions.map((q) => (
//             <div key={q.id} className="mb-3 p-3 bg-gray-50 rounded-md">
//               <p className="text-gray-800">
//                 <span className="font-semibold">{q.user?.name || "Anonymous"}:</span>{" "}
//                 {q.text}
//               </p>
//               <p className="text-xs text-gray-500">
//                 at {formatTime(q.timestamp)}s
//               </p>

//               {q.answers?.length > 0 && (
//                 <div className="ml-4 mt-2">
//                   {q.answers.map((ans, i) => (
//                     <p key={i} className="text-sm text-green-700">
//                       💬 {ans.user?.name || "Anonymous"}: {ans.text}
//                     </p>
//                   ))}
//                 </div>
//               )}

//               {userId === video.User?.id && (
//                 <div className="mt-2">
//                   {selectedQuestion === q.id ? (
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={answerText}
//                         onChange={(e) => setAnswerText(e.target.value)}
//                         placeholder="Write an answer..."
//                         className="flex-grow p-1 border rounded-md"
//                       />
//                       <button
//                         onClick={() => handleAnswer(q.id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded-md"
//                       >
//                         Send
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setSelectedQuestion(q.id)}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       Reply
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div> */}
//       {/* Q&A Section */}
//       <div className="border-t pt-6 mt-8">
//         <h2 className="text-2xl font-semibold mb-4">Q&A / Notes</h2>

//         <form onSubmit={handleAskQuestion} className="flex gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Ask a question about this video..."
//             value={newQuestion}
//             onChange={(e) => setNewQuestion(e.target.value)}
//             className="flex-grow p-2 border rounded-md"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-purple-600 text-white px-4 py-2 rounded-md"
//           >
//             Ask
//           </button>
//         </form>

//         {questions.length === 0 ? (
//           <p className="text-gray-500">No questions yet. Be the first!</p>
//         ) : (
//           <ul className="space-y-2 max-h-72 overflow-y-auto">
//             {questions 
//               .slice() // make a copy so we don't mutate state
//               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//               .map((q) => (
//               <li key={q.id} className="border p-3 rounded bg-gray-50 shadow-sm">
//                 <p className="text-gray-800">
//                   <strong>{q.asker?.name || "Anonymous"}:</strong> {q.text}

//                   <br />
//                   <em>
//                     At {formatTime(q.timestamp)} •{" "}
//                     <span className="text-xs text-gray-400">
//                       {dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")}
//                     </span>
//                   </em>
//                 </p>

//                 {/* Answers */}
//                 {q.answers?.length > 0 && (
//                   <div className="ml-4 mt-2">
//                     {q.answers.map((ans, i) => (
//                       <p key={i} className="text-sm text-green-700">
//                         💬 {ans.User?.name || "Anonymous"}: {ans.text}
//                       </p>
//                     ))}
//                   </div>
//                 )}

//                 {/* Reply input for video owner */}
//                 {userId === video.User?.id && (
//                   <div className="mt-2">
//                     {selectedQuestion === q.id ? (
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           value={answerText}
//                           onChange={(e) => setAnswerText(e.target.value)}
//                           placeholder="Write an answer..."
//                           className="flex-grow p-1 border rounded-md"
//                         />
//                         <button
//                           onClick={() => handleAnswer(q.id)}
//                           className="bg-blue-600 text-white px-3 py-1 rounded-md"
//                         >
//                           Send
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => setSelectedQuestion(q.id)}
//                         className="text-sm text-blue-600 hover:underline"
//                       >
//                         Reply
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//     </div>
//   );
// }











// working code for all devices
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { askQuestion, getQuestions } from "../questionService";
import { answerQuestion } from "../answerService";
import dayjs from "dayjs";

// ---------------------
// Safe JWT Decode
// ---------------------
const jwt_decode = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
};

export default function VideoPage() {
  const { id: videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [hasViewed, setHasViewed] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const token = localStorage.getItem("token") || "";

  const getUserId = useCallback(() => {
    if (!token) return null;
    const decoded = jwt_decode(token);
    return decoded.userId || decoded.id;
  }, [token]);

  const userId = getUserId();

  // ----------------------------
  // Fetch Video + Subscription + Q&A
  // ----------------------------
  const fetchVideo = useCallback(async () => {
    if (!videoId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await API.get(`/videos/${videoId}`);
      setVideo(res.data);

      if (!hasViewed) {
        API.post(`/videos/${videoId}/view`).then(() => setHasViewed(true));
      }

      if (res.data?.User?.id) {
        fetchSubscriptionStatus(res.data.User.id);
        fetchSubscriberCount(res.data.User.id);
      }

      fetchQuestions();
    } catch (err) {
      console.error("Failed to fetch video:", err);
      setError(
        err.response?.status === 404
          ? "Video not found or removed."
          : "Failed to load video."
      );
      setVideo(null);
    } finally {
      setLoading(false);
    }
  }, [videoId, hasViewed]);

  // ----------------------------
  // Subscription
  // ----------------------------
  const fetchSubscriptionStatus = async (creatorId) => {
    try {
      const res = await API.get(`/subscriptions/check/${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsSubscribed(res.data.subscribed);
    } catch (err) {
      console.error("Failed to fetch subscription status:", err);
    }
  };

  const fetchSubscriberCount = async (creatorId) => {
    try {
      const res = await API.get(`/subscriptions/count/${creatorId}`);
      setSubscriberCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch subscriber count:", err);
    }
  };

  const handleSubscribe = async () => {
    if (!video || !video.User) return;
    const creatorId = video.User.id;
    try {
      const res = await API.post(
        "/subscriptions/toggle",
        { subscribedToId: creatorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSubscribed(res.data.subscribed);
      setSubscriberCount((prev) =>
        res.data.subscribed ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Subscription toggle failed:", err);
    }
  };

  // ----------------------------
  // Q&A
  // ----------------------------
  const fetchQuestions = async () => {
    if (!videoId) return;
    try {
      const data = await getQuestions(videoId, token);
      const withUserAndAnswers = data.map((q) => ({
        ...q,
        user: q.User || { name: "Anonymous" },
        answers:
          q.answers?.map((a) => ({
            ...a,
            user: a.User || { name: "Anonymous" },
          })) || [],
      }));
      setQuestions(withUserAndAnswers);
    } catch (err) {
      console.error("Failed to fetch Q&A:", err);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  // ----------------------------
  // Reactions (Like / Dislike)
  // ----------------------------
  const handleReaction = async (type) => {
    if (!video) return;
    try {
      const res = await API.post(`/videos/${videoId}/react`, { type });
      const updatedReaction = res.data;

      setVideo((prev) => {
        if (!prev) return null;
        const prevReaction = prev.VideoReactions?.find(
          (r) => r.userId === updatedReaction.userId
        );
        let likes = prev.likes || 0;
        let dislikes = prev.dislikes || 0;

        if (prevReaction) {
          if (prevReaction.type === "like") likes -= 1;
          if (prevReaction.type === "dislike") dislikes -= 1;
        }

        if (updatedReaction.type) {
          if (updatedReaction.type === "like") likes += 1;
          if (updatedReaction.type === "dislike") dislikes += 1;
        }

        const newReactions =
          prev.VideoReactions?.filter(
            (r) => r.userId !== updatedReaction.userId
          ) || [];
        if (updatedReaction.type) newReactions.push(updatedReaction);

        return { ...prev, likes, dislikes, VideoReactions: newReactions };
      });
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // ----------------------------
  // Comments
  // ----------------------------
  const handleComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || !video) return;

    try {
      const res = await API.post(
        `/videos/${videoId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              VideoComments: [
                ...(prev.VideoComments || []),
                res.data.comment || res.data,
              ],
            }
          : null
      );
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // ----------------------------
  // Q&A Handlers
  // ----------------------------
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in");
    if (!newQuestion.trim()) return alert("Please enter a question");

    try {
      const timestamp = Math.floor(videoRef.current?.currentTime || 0);
      const data = await askQuestion(videoId, newQuestion, timestamp, token);
      setQuestions((prev) => [
        ...prev,
        { ...data, user: data.User || { name: "Anonymous" } },
      ]);
      setNewQuestion("");
    } catch {
      alert("Failed to post question");
    }
  };

  const handleAnswer = async (questionId) => {
    if (!answerText.trim() || !token) return;
    try {
      const data = await answerQuestion(questionId, answerText, token);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answers: [
                  ...(q.answers || []),
                  { ...data, user: data.User || { name: "Anonymous" } },
                ],
              }
            : q
        )
      );
      setAnswerText("");
      setSelectedQuestion(null);
    } catch (err) {
      console.error("Failed to answer question:", err);
    }
  };

  // ----------------------------
  // Video Autoplay Fix
  // ----------------------------
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleLoadedMetadata = async () => {
      try {
        vid.muted = true; // allow autoplay
        await vid.play();
        vid.muted = false; // unmute after autoplay
      } catch (err) {
        console.warn("Autoplay failed:", err);
      }
    };

    vid.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      vid.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [video?.filename, video?.videoUrl]);

  // ----------------------------
  // Helpers
  // ----------------------------
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const formatDuration = (seconds) => {
    if (!seconds || seconds < 0) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (h > 0) parts.push(h);
    parts.push(m.toString().padStart(h > 0 ? 2 : 1, "0"));
    parts.push(s.toString().padStart(2, "0"));
    return parts.join(":");
  };

  if (loading) return <p className="text-center text-xl text-blue-600 mt-10">Loading video...</p>;
  if (error) return <p className="text-center text-xl text-red-600 mt-10">{error}</p>;
  if (!video) return <p className="text-center text-xl text-gray-600 mt-10">Video not found.</p>;

  const userReaction = video.VideoReactions?.find((r) => r.userId === userId)?.type;
  const formattedDuration = formatDuration(video.duration);
  // const isLocal = !!video.filename;
  // const videoSrc = isLocal
  //   ? `http://localhost:5000/api/videos/stream/${video.filename}`
  //   : video.videoUrl;
  const getVideoSrc = (video) => {
    if (!video) return null;

    // Local video
    if (video.filename) {
      return `http://localhost:5000/api/videos/stream/${video.filename}`;
    }

    // Cloudinary video
    if (video.videoUrl) {
      try {
        const url = new URL(video.videoUrl);

        // Add transformation: force mp4
        if (url.pathname.includes("/upload/")) {
          url.pathname = url.pathname.replace(
            "/upload/",
            "/upload/f_mp4/"
          );
        }

        // Ensure it ends with .mp4 for browser compatibility
        if (!url.pathname.endsWith(".mp4")) {
          url.pathname += ".mp4";
        }

        return url.toString();
      } catch {
        return video.videoUrl;
      }
    }

    return null;
  };




  // ----------------------------
  // Video click handler (play/pause)
  // ----------------------------
  // const handleVideoClick = () => {
  //   const vid = videoRef.current;
  //   if (!vid) return;
  //   if (vid.paused) vid.play();
  //   else vid.pause();
  // };
  const handleVideoClick = async () => {
    const vid = videoRef.current;
    if (!vid) return;

    try {
      if (vid.paused) await vid.play();
      else vid.pause();
    } catch (err) {
      console.warn("Video play failed:", err);
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg mt-4">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} controls className="w-full h-full object-contain">
          {video.videoUrl && (
            <>
              <source src={getVideoSrc(video)} type="video/mp4" />
              <source src={video.videoUrl} type="video/webm" />
            </>
          )}
          Your browser does not support the video tag.
        </video>


      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mt-4 break-words">{video.title}</h1>

      {/* Uploader Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center text-gray-600 border-b pb-3 mb-4 mt-2">
        <div className="text-sm sm:text-base">
          <p>
            Uploaded by: <span className="font-semibold">{video.User?.name || "Unknown"}</span>
          </p>
          <p className="text-gray-500">Subscribers: {subscriberCount}</p>
          <p className="text-gray-700 text-sm">
            {formattedDuration} • {video.views || 0} views •{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>

        {userId !== video.User?.id && (
          <div className="flex gap-2 mt-3 sm:mt-0">
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-md text-white font-medium transition text-sm sm:text-base ${
                isSubscribed
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
            {video.User && (
              <button
                onClick={() => navigate(`/messages/${video.User.id}`)}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base"
              >
                Message
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm sm:text-base ${
            userReaction === "like"
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-green-100"
          }`}
        >
          👍 {video.likes || 0}
        </button>
        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm sm:text-base ${
            userReaction === "dislike"
              ? "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-red-100"
          }`}
        >
          👎 {video.dislikes || 0}
        </button>
      </div>

      {/* Description */}
      <p className="mb-6 text-sm sm:text-base whitespace-pre-wrap">{video.description}</p>

      {/* Comments */}
      <div className="border-t pt-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">Comments</h2>

        <form onSubmit={handleComment} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a public comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-grow p-2 border rounded-md text-sm sm:text-base"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Comment
          </button>
        </form>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {(video.VideoComments || []).map((comment) => (
            <div key={comment.id || comment._id} className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm">
                {comment.user?.name || "Anonymous"}{" "}
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-800 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Q&A Section */}
      <div className="border-t pt-6 mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Q&A / Notes</h2>

        <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Ask a question about this video..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="flex-grow p-2 border rounded-md text-sm sm:text-base"
            required
          />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md">
            Ask
          </button>
        </form>

        {questions.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">No questions yet. Be the first!</p>
        ) : (
          <ul className="space-y-3 max-h-72 overflow-y-auto">
            {questions
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((q) => (
                <li key={q.id} className="border p-3 rounded bg-gray-50 shadow-sm">
                  <p className="text-gray-800 text-sm sm:text-base">
                    <strong>{q.asker?.name || "Anonymous"}:</strong> {q.text}
                    
                    <br />
                    <em>
                      At {formatTime(q.timestamp)} •{" "}
                      <span className="text-xs text-gray-400">
                        {dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")}
                      </span>
                    </em>
                  </p>

                  {q.answers?.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1">
                      {q.answers.map((ans, i) => (
                        <p key={i} className="text-sm text-green-700">
                          💬 {ans.user?.name || "Anonymous"}: {ans.text}
                        </p>
                      ))}
                    </div>
                  )}

                  {userId === video.User?.id && (
                    <div className="mt-2">
                      {selectedQuestion === q.id ? (
                        <div className="flex gap-2 flex-col sm:flex-row">
                          <input
                            type="text"
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="Write an answer..."
                            className="flex-grow p-1 border rounded-md text-sm sm:text-base"
                          />
                          <button
                            onClick={() => handleAnswer(q.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md"
                          >
                            Send
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedQuestion(q.id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
