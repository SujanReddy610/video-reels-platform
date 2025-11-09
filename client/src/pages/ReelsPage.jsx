











// working code for laptop


// import React, { useEffect, useState, useRef } from "react";
// import { Heart, MessageCircle, Volume2, VolumeX, X } from "lucide-react";
// import API from "../api";
// import { useNavigate } from "react-router-dom";

// export default function ReelsPage() {
//   const [reels, setReels] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [muted, setMuted] = useState(true);
//   const [activeComments, setActiveComments] = useState(null);
//   const [commentText, setCommentText] = useState("");
//   const [showAllComments, setShowAllComments] = useState(false);
//   const videoRefs = useRef([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   // ✅ Decode JWT manually (no external library)
//   const jwt_decode = (token) => {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch {
//       return {};
//     }
//   };

//   const decoded = token ? jwt_decode(token) : {};
//   const userId = decoded?.id || decoded?.userId || null;
//   const userName = decoded?.name || "You";

//   // 🎥 Fetch all public short videos (10s–120s)
//   useEffect(() => {
//     const fetchReels = async () => {
//       try {
//         const res = await API.get("/videos/public", {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         const filtered = res.data
//           .filter(
//             (video) =>
//               video.duration && video.duration >= 10 && video.duration <= 120
//           )
//           .map((r) => ({
//             ...r,
//             likes: r.likes ?? 0,
//             dislikes: r.dislikes ?? 0,
//             VideoReactions: r.VideoReactions ?? [],
//             VideoComments: r.VideoComments ?? [],
//             isSubscribed: false,
//             subscriberCount: 0,
//           }));

//         setReels(filtered);

//         // Fetch subscription info and count for each creator
//         for (const reel of filtered) {
//           if (reel.User?.id) {
//             checkSubscriptionStatus(reel.User.id);
//             fetchSubscriberCount(reel.User.id);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch reels:", err);
//       }
//     };

//     fetchReels();
//   }, [token]);

//   // ✅ Check if user is subscribed to a creator
//   const checkSubscriptionStatus = async (creatorId) => {
//     if (!token || !creatorId) return;
//     try {
//       const res = await API.get(`/subscriptions/check/${creatorId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const isSubscribed = res.data.isSubscribed;

//       setReels((prev) =>
//         prev.map((r) =>
//           r.User?.id === creatorId ? { ...r, isSubscribed } : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to check subscription:", err);
//     }
//   };

//   // ✅ Get total subscribers of creator
//   const fetchSubscriberCount = async (creatorId) => {
//     try {
//       const res = await API.get(`/subscriptions/count/${creatorId}`);
//       const count = res.data.count || 0;

//       setReels((prev) =>
//         prev.map((r) =>
//           r.User?.id === creatorId ? { ...r, subscriberCount: count } : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to fetch subscriber count:", err);
//     }
//   };

//   // ✅ Like / Dislike logic
//   const handleReaction = async (videoId, type) => {
//     if (!token) {
//       alert("Please login to react");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await API.post(
//         `/videos/${videoId}/react`,
//         { type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedReaction = res.data;

//       setReels((prev) =>
//         prev.map((reel) => {
//           if (reel.id !== videoId) return reel;

//           const prevReaction = reel.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );
//           let likes = reel.likes || 0;
//           let dislikes = reel.dislikes || 0;

//           if (prevReaction) {
//             if (prevReaction.type === "like") likes -= 1;
//             if (prevReaction.type === "dislike") dislikes -= 1;
//           }

//           if (updatedReaction.type) {
//             if (updatedReaction.type === "like") likes += 1;
//             if (updatedReaction.type === "dislike") dislikes += 1;
//           }

//           const newReactions =
//             reel.VideoReactions?.filter(
//               (r) => r.userId !== updatedReaction.userId
//             ) || [];
//           if (updatedReaction.type) newReactions.push(updatedReaction);

//           return { ...reel, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error("Reaction failed:", err);
//     }
//   };

//   // ✅ Subscribe / Unsubscribe toggle (VideoPage logic)
//   const handleSubscribe = async (creatorId) => {
//     if (!creatorId) return;
//     if (!token) {
//       alert("Please login to subscribe");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await API.post(
//         "/subscriptions/toggle",
//         { subscribedToId: creatorId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { subscribed } = res.data;

//       setReels((prev) =>
//         prev.map((r) =>
//           r.User?.id === creatorId
//             ? {
//                 ...r,
//                 isSubscribed: subscribed,
//                 subscriberCount: Math.max(
//                   0,
//                   (r.subscriberCount || 0) + (subscribed ? 1 : -1)
//                 ),
//               }
//             : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to toggle subscription:", err);
//     }
//   };

//   // ✅ Comment submission
//   const handleComment = async (videoId, e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Please login to comment");
//       navigate("/login");
//       return;
//     }

//     if (!commentText.trim()) return;

//     try {
//       const res = await API.post(
//         `/videos/${videoId}/comment`,
//         { text: commentText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newComment =
//         res?.data?.comment || {
//           id: Date.now(),
//           content: commentText,
//           user: { name: userName },
//         };

//       setReels((prev) =>
//         prev.map((r) =>
//           r.id === videoId
//             ? { ...r, VideoComments: [newComment, ...(r.VideoComments || [])] }
//             : r
//         )
//       );

//       setCommentText("");
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//     }
//   };

//   // ✅ Scroll behavior (for vertical video navigation)
//   const handleScroll = (e) => {
//     const container = e.target;
//     const newIndex = Math.round(container.scrollTop / window.innerHeight);
//     if (newIndex !== currentIndex) setCurrentIndex(newIndex);
//   };

//   // ✅ Autoplay handling
//   useEffect(() => {
//     if (reels.length === 0) return;
//     videoRefs.current.forEach((video, i) => {
//       if (!video) return;
//       if (i === currentIndex) video.play().catch(() => {});
//       else {
//         video.pause();
//         video.currentTime = 0;
//       }
//     });
//   }, [currentIndex, reels]);

//   return (
//     <div
//       className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black scrollbar-hide"
//       onScroll={handleScroll}
//     >
//       {reels.length === 0 ? (
//         <div className="flex justify-center items-center h-screen text-white text-xl">
//           No short videos (10s–120s) available 😔
//         </div>
//       ) : (
//         reels.map((reel, i) => {
//           const userReaction = reel.VideoReactions?.find(
//             (r) => r.userId === userId
//           )?.type;
//           const videoSrc = reel.filename
//             ? `http://localhost:5000/api/videos/stream/${reel.filename}`
//             : reel.videoUrl;

//           return (
//             <div
//               key={reel.id}
//               className="relative h-screen w-full flex justify-center items-center snap-start bg-black"
//             >
//               {/* 🎥 Video */}
//               <video
//                 ref={(el) => (videoRefs.current[i] = el)}
//                 src={videoSrc}
//                 muted={muted}
//                 loop
//                 playsInline
//                 className="h-[90vh] w-auto max-w-[500px] object-cover rounded-2xl shadow-2xl bg-black"
//               />

//               {/* 📄 Info */}
//               <div className="absolute bottom-10 left-6 text-white max-w-[65%]">
//                 <h2 className="text-xl font-bold mb-1">{reel.title}</h2>
//                 <p className="text-sm opacity-80 line-clamp-2">
//                   {reel.description}
//                 </p>
//                 <p className="text-xs opacity-60 mt-1">
//                   Duration: {Math.round(reel.duration)} sec
//                 </p>

//                 {userId !== reel.User?.id && (
//                   <button
//                     onClick={() => handleSubscribe(reel.User?.id)}
//                     className={`mt-3 px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
//                       reel.isSubscribed
//                         ? "bg-gray-400 text-white cursor-default"
//                         : "bg-red-600 text-white hover:bg-red-700"
//                     }`}
//                   >
//                     {reel.isSubscribed
//                       ? `Subscribed (${reel.subscriberCount || 0})`
//                       : `Subscribe (${reel.subscriberCount || 0})`}
//                   </button>
//                 )}
//               </div>

//               {/* ❤️ Actions */}
//               <div className="absolute right-6 bottom-24 flex flex-col items-center space-y-5 text-white">
//                 <button
//                   onClick={() => handleReaction(reel.id, "like")}
//                   className={`p-3 rounded-full transition ${
//                     userReaction === "like"
//                       ? "bg-red-600 scale-110"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                 >
//                   <Heart />
//                 </button>
//                 <p className="text-sm">{reel.likes || 0}</p>

//                 <button
//                   onClick={() => handleReaction(reel.id, "dislike")}
//                   className={`p-3 rounded-full transition ${
//                     userReaction === "dislike"
//                       ? "bg-blue-600 scale-110"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                 >
//                   <X />
//                 </button>
//                 <p className="text-sm">{reel.dislikes || 0}</p>

//                 <button
//                   onClick={() =>
//                     setActiveComments(
//                       activeComments === reel.id ? null : reel.id
//                     )
//                   }
//                   className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
//                 >
//                   <MessageCircle />
//                 </button>

//                 <button
//                   onClick={() => setMuted(!muted)}
//                   className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
//                 >
//                   {muted ? <VolumeX /> : <Volume2 />}
//                 </button>
//               </div>

//               {/* 💬 Comments */}
//               {activeComments === reel.id && (
//                 <div className="absolute inset-0 bg-black/80 flex flex-col justify-end">
//                   <div className="bg-white p-4 max-h-[60vh] overflow-y-auto rounded-t-2xl">
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="text-lg font-semibold">
//                         Comments ({reel.VideoComments?.length || 0})
//                       </h3>
//                       <button
//                         onClick={() => setActiveComments(null)}
//                         className="text-gray-600 hover:text-black"
//                       >
//                         <X />
//                       </button>
//                     </div>

//                     {(showAllComments
//                       ? [...(reel.VideoComments || [])]
//                       : [...(reel.VideoComments || [])].slice(0, 2)
//                     ).map((c, idx) => (
//                       <div key={idx} className="mb-2 border-b pb-1">
//                         <p className="text-sm font-semibold">
//                           {c?.user?.name || "Anonymous"}
//                         </p>
//                         <p className="text-gray-700 text-sm">
//                           {c?.content || c?.text}
//                         </p>
//                       </div>
//                     ))}

//                     {reel.VideoComments?.length > 2 && (
//                       <button
//                         onClick={() => setShowAllComments(!showAllComments)}
//                         className="text-blue-600 text-sm mt-2"
//                       >
//                         {showAllComments ? "View less" : "View more"}
//                       </button>
//                     )}

//                     <form
//                       onSubmit={(e) => handleComment(reel.id, e)}
//                       className="flex gap-2 mt-3"
//                     >
//                       <input
//                         type="text"
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         placeholder="Add a comment..."
//                         className="flex-grow border p-2 rounded"
//                       />
//                       <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-4 py-2 rounded"
//                       >
//                         Post
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }






















































// working code fofr all devices

// import React, { useEffect, useState, useRef } from "react";
// import { Heart, MessageCircle, Volume2, VolumeX, X } from "lucide-react";
// import API from "../api";
// import { useNavigate } from "react-router-dom";

// export default function ReelsPage() {
//   const [reels, setReels] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [muted, setMuted] = useState(true);
//   const [activeComments, setActiveComments] = useState(null);
//   const [commentText, setCommentText] = useState("");
//   const [showAllComments, setShowAllComments] = useState(false);
//   const videoRefs = useRef([]);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   // ✅ Decode JWT manually
//   const jwt_decode = (token) => {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch {
//       return {};
//     }
//   };

//   const decoded = token ? jwt_decode(token) : {};
//   const userId = decoded?.id || decoded?.userId || null;
//   const userName = decoded?.name || "You";

//   // 🎥 Fetch all public short videos (10–120 sec)
//   useEffect(() => {
//     const fetchReels = async () => {
//       try {
//         const res = await API.get("/videos/public", {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         const filtered = res.data
//           .filter(
//             (video) =>
//               video.duration && video.duration >= 10 && video.duration <= 120
//           )
//           .map((r) => ({
//             ...r,
//             likes: r.likes ?? 0,
//             dislikes: r.dislikes ?? 0,
//             VideoReactions: r.VideoReactions ?? [],
//             VideoComments: r.VideoComments ?? [],
//             isSubscribed: false,
//             subscriberCount: 0,
//           }));

//         setReels(filtered);

//         for (const reel of filtered) {
//           if (reel.User?.id) {
//             checkSubscriptionStatus(reel.User.id);
//             fetchSubscriberCount(reel.User.id);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch reels:", err);
//       }
//     };

//     fetchReels();
//   }, [token]);


//   // ✅ Check subscription
//   const checkSubscriptionStatus = async (creatorId) => {
//     if (!token || !creatorId) return;
//     try {
//       const res = await API.get(`/subscriptions/check/${creatorId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const isSubscribed = res.data.isSubscribed;
//       setReels((prev) =>
//         prev.map((r) =>
//           r.User?.id === creatorId ? { ...r, isSubscribed } : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to check subscription:", err);
//     }
//   };

//   // ✅ Get total subscribers
//   const fetchSubscriberCount = async (creatorId) => {
//     try {
//       const res = await API.get(`/subscriptions/count/${creatorId}`);
//       const count = res.data.count || 0;
//       setReels((prev) =>
//         prev.map((r) =>
//           r.User?.id === creatorId ? { ...r, subscriberCount: count } : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to fetch subscriber count:", err);
//     }
//   };

//   // ✅ Like / Dislike
//   const handleReaction = async (videoId, type) => {
//     if (!token) {
//       alert("Please login to react");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await API.post(
//         `/videos/${videoId}/react`,
//         { type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedReaction = res.data;

//       setReels((prev) =>
//         prev.map((reel) => {
//           if (reel.id !== videoId) return reel;

//           const prevReaction = reel.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );
//           let likes = reel.likes || 0;
//           let dislikes = reel.dislikes || 0;

//           if (prevReaction) {
//             if (prevReaction.type === "like") likes -= 1;
//             if (prevReaction.type === "dislike") dislikes -= 1;
//           }

//           if (updatedReaction.type) {
//             if (updatedReaction.type === "like") likes += 1;
//             if (updatedReaction.type === "dislike") dislikes += 1;
//           }

//           const newReactions =
//             reel.VideoReactions?.filter(
//               (r) => r.userId !== updatedReaction.userId
//             ) || [];
//           if (updatedReaction.type) newReactions.push(updatedReaction);

//           return { ...reel, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error("Reaction failed:", err);
//     }
//   };

//   // ✅ Subscribe / Unsubscribe
//   const handleSubscribe = async (creatorId) => {
//     if (!creatorId) return;
//     if (!token) {
//       alert("Please login to subscribe");
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await API.post(
//         "/subscriptions/toggle",
//         { subscribedToId: creatorId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { subscribed } = res.data;

//       setReels((prev) =>
//         prev.map((r) =>
//           r.User?.id === creatorId
//             ? {
//                 ...r,
//                 isSubscribed: subscribed,
//                 subscriberCount: Math.max(
//                   0,
//                   (r.subscriberCount || 0) + (subscribed ? 1 : -1)
//                 ),
//               }
//             : r
//         )
//       );
//     } catch (err) {
//       console.error("Failed to toggle subscription:", err);
//     }
//   };

//   // ✅ Comment submit
//   const handleComment = async (videoId, e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Please login to comment");
//       navigate("/login");
//       return;
//     }

//     if (!commentText.trim()) return;

//     try {
//       const res = await API.post(
//         `/videos/${videoId}/comment`,
//         { text: commentText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newComment =
//         res?.data?.comment || {
//           id: Date.now(),
//           content: commentText,
//           user: { name: userName },
//         };

//       setReels((prev) =>
//         prev.map((r) =>
//           r.id === videoId
//             ? { ...r, VideoComments: [newComment, ...(r.VideoComments || [])] }
//             : r
//         )
//       );

//       setCommentText("");
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//     }
//   };

//   // ✅ Scroll
//   const handleScroll = (e) => {
//     const container = e.target;
//     const newIndex = Math.round(container.scrollTop / window.innerHeight);
//     if (newIndex !== currentIndex) setCurrentIndex(newIndex);
//   };

//   // ✅ Autoplay
//   useEffect(() => {
//     if (reels.length === 0) return;
//     videoRefs.current.forEach((video, i) => {
//       if (!video) return;
//       if (i === currentIndex) video.play().catch(() => {});
//       else {
//         video.pause();
//         video.currentTime = 0;
//       }
//     });
//   }, [currentIndex, reels]);

//   return (
//     <div
//       className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black scrollbar-hide"
//       onScroll={handleScroll}
//     >
//       {reels.length === 0 ? (
//         <div className="flex justify-center items-center h-screen text-white text-lg sm:text-xl">
//           No short videos (10s–120s) available 😔
//         </div>
//       ) : (
//         reels.map((reel, i) => {
//           const userReaction = reel.VideoReactions?.find(
//             (r) => r.userId === userId
//           )?.type;
//           const videoSrc = reel.filename
//             ? `http://localhost:5000/api/videos/stream/${reel.filename}`
//             : reel.videoUrl;

//           return (
//             <div
//               key={reel.id}
//               className="relative h-screen w-full flex justify-center items-center snap-start bg-black"
//             >
//               {/* 🎥 Video */}
//               <video
//                 ref={(el) => (videoRefs.current[i] = el)}
//                 src={videoSrc}
//                 muted={muted}
//                 loop
//                 playsInline
//                 className="h-[90vh] w-auto max-w-[500px] object-cover rounded-2xl shadow-2xl bg-black sm:h-[85vh]"
//               />

//               {/* 📄 Info */}
//               <div className="absolute bottom-14 left-5 text-white max-w-[70%] sm:max-w-[60%]">
//                 <h2 className="text-lg sm:text-xl font-bold mb-1">
//                   {reel.title}
//                 </h2>
//                 <p className="text-xs sm:text-sm opacity-80 line-clamp-2">
//                   {reel.description}
//                 </p>
//                 <p className="text-[10px] sm:text-xs opacity-60 mt-1">
//                   Duration: {Math.round(reel.duration)} sec
//                 </p>

//                 {userId !== reel.User?.id && (
//                   <button
//                     onClick={() => handleSubscribe(reel.User?.id)}
//                     className={`mt-3 px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
//                       reel.isSubscribed
//                         ? "bg-gray-400 text-white cursor-default"
//                         : "bg-red-600 text-white hover:bg-red-700"
//                     }`}
//                   >
//                     {reel.isSubscribed
//                       ? `Subscribed (${reel.subscriberCount || 0})`
//                       : `Subscribe (${reel.subscriberCount || 0})`}
//                   </button>
//                 )}
//               </div>

//               {/* ❤️ Actions */}
//               <div className="absolute right-4 sm:right-6 bottom-24 flex flex-col items-center space-y-5 text-white">
//                 <button
//                   onClick={() => handleReaction(reel.id, "like")}
//                   className={`p-2 sm:p-3 rounded-full transition ${
//                     userReaction === "like"
//                       ? "bg-red-600 scale-110"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                 >
//                   <Heart />
//                 </button>
//                 <p className="text-xs sm:text-sm">{reel.likes || 0}</p>

//                 <button
//                   onClick={() => handleReaction(reel.id, "dislike")}
//                   className={`p-2 sm:p-3 rounded-full transition ${
//                     userReaction === "dislike"
//                       ? "bg-blue-600 scale-110"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                 >
//                   <X />
//                 </button>
//                 <p className="text-xs sm:text-sm">{reel.dislikes || 0}</p>

//                 <button
//                   onClick={() =>
//                     setActiveComments(
//                       activeComments === reel.id ? null : reel.id
//                     )
//                   }
//                   className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-gray-600"
//                 >
//                   <MessageCircle />
//                 </button>

//                 <button
//                   onClick={() => setMuted(!muted)}
//                   className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-gray-600"
//                 >
//                   {muted ? <VolumeX /> : <Volume2 />}
//                 </button>
//               </div>

//               {/* 💬 Comments */}
//               {activeComments === reel.id && (
//                 <div className="absolute inset-0 bg-black/80 flex flex-col justify-end">
//                   <div className="bg-white p-3 sm:p-4 max-h-[60vh] overflow-y-auto rounded-t-2xl">
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="text-base sm:text-lg font-semibold">
//                         Comments ({reel.VideoComments?.length || 0})
//                       </h3>
//                       <button
//                         onClick={() => setActiveComments(null)}
//                         className="text-gray-600 hover:text-black"
//                       >
//                         <X />
//                       </button>
//                     </div>

//                     {(showAllComments
//                       ? [...(reel.VideoComments || [])]
//                       : [...(reel.VideoComments || [])].slice(0, 2)
//                     ).map((c, idx) => (
//                       <div key={idx} className="mb-2 border-b pb-1">
//                         <p className="text-sm font-semibold">
//                           {c?.user?.name || "Anonymous"}
//                         </p>
//                         <p className="text-gray-700 text-sm">
//                           {c?.content || c?.text}
//                         </p>
//                       </div>
//                     ))}

//                     {reel.VideoComments?.length > 2 && (
//                       <button
//                         onClick={() => setShowAllComments(!showAllComments)}
//                         className="text-blue-600 text-sm mt-2"
//                       >
//                         {showAllComments ? "View less" : "View more"}
//                       </button>
//                     )}

//                     <form
//                       onSubmit={(e) => handleComment(reel.id, e)}
//                       className="flex gap-2 mt-3"
//                     >
//                       <input
//                         type="text"
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         placeholder="Add a comment..."
//                         className="flex-grow border p-2 rounded text-sm sm:text-base"
//                       />
//                       <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
//                       >
//                         Post
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState, useRef } from "react";
import { Heart, MessageCircle, Volume2, VolumeX, X } from "lucide-react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [activeComments, setActiveComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [subscribedCreators, setSubscribedCreators] = useState(new Set()); // ✅ Persistent subscriptions
  const videoRefs = useRef([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Decode JWT manually
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

  const decoded = token ? jwt_decode(token) : {};
  const userId = decoded?.id || decoded?.userId || null;
  const userName = decoded?.name || "You";

  // Load subscribed creators from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("subscribedCreators");
    if (stored) {
      setSubscribedCreators(new Set(JSON.parse(stored)));
    }
  }, []);

  // Save to localStorage whenever subscribedCreators changes
  useEffect(() => {
    localStorage.setItem("subscribedCreators", JSON.stringify([...subscribedCreators]));
  }, [subscribedCreators]);

  // Helper: get video src (Cloudinary or local)
  const getVideoSrc = (video) => {
    if (!video) return "";
    if (video.videoUrl && video.videoUrl.includes("res.cloudinary.com")) {
      let url = video.videoUrl;
      if (!url.includes("/video/upload/")) url = url.replace("/upload/", "/video/upload/");
      if (!url.includes("f_mp4")) {
        const parts = url.split("/upload/");
        url = `${parts[0]}/upload/f_mp4/${parts[1]}`;
      }
      return url;
    }
    if (video.filename) return `http://localhost:5000/api/videos/stream/${video.filename}`;
    return video.videoUrl || "";
  };

  // Middle click handler
  const handleMiddleClick = (e) => {
    if (e.button === 1) { // middle click
      e.preventDefault(); // prevent default scroll
      const currentVideo = videoRefs.current[currentIndex];
      if (!currentVideo) return;

      if (currentVideo.paused) {
        currentVideo.play().catch(() => {});
      } else {
        const nextIndex = (currentIndex + 1) % reels.length;
        setCurrentIndex(nextIndex);
      }
    }
  };

  // Fetch reels
  useEffect(() => {
    

    const fetchReels = async () => {
      try {
        const res = await API.get("/videos/public", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const filtered = res.data
          .filter((video) => video.duration >= 10 && video.duration <= 120)
          .map((r) => ({
            ...r,
            likes: r.likes ?? 0,
            dislikes: r.dislikes ?? 0,
            VideoReactions: r.VideoReactions ?? [],
            VideoComments: r.VideoComments ?? [],
            isSubscribed: false, // Will be set below
            subscriberCount: 0,
          }));

        // ✅ Fetch subscription data in parallel
        const updatedReels = await Promise.all(
          filtered.map(async (reel) => {
            let isSubscribed = subscribedCreators.has(reel.User?.id); // ✅ Use localStorage first
            let subscriberCount = 0;

            if (reel.User?.id) {
              try {
                const [subRes, countRes] = await Promise.all([
                  token ? API.get(`/subscriptions/check/${reel.User.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }) : Promise.resolve({ data: { isSubscribed: false } }),
                  API.get(`/subscriptions/count/${reel.User.id}`),
                ]);

                console.log(`Subscription check for ${reel.User.id}:`, subRes.data); // ✅ Debug log
                isSubscribed = subRes.data.isSubscribed ?? isSubscribed; // Fallback to localStorage
                subscriberCount = countRes.data.count || 0;

                // Update localStorage if API differs
                if (isSubscribed && !subscribedCreators.has(reel.User.id)) {
                  setSubscribedCreators(prev => new Set(prev).add(reel.User.id));
                } else if (!isSubscribed && subscribedCreators.has(reel.User.id)) {
                  setSubscribedCreators(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(reel.User.id);
                    return newSet;
                  });
                }
              } catch (err) {
                console.error(`Subscription fetch failed for ${reel.User?.id}:`, err);
                // Keep localStorage value
              }
            }

            return { ...reel, isSubscribed, subscriberCount };
          })
        );
        const syncedReels = updatedReels.map((r) => ({
          ...r,
          isSubscribed: subscribedCreators.has(r.User?.id),
        }));

        setReels(updatedReels);
      } catch (err) {
        console.error("Failed to fetch reels:", err);
      }
    };
    

    fetchReels();
  }, [token, subscribedCreators]); // ✅ Depend on subscribedCreators to re-fetch if needed

  // Like / Dislike
  const handleReaction = async (videoId, type) => {
    if (!token) {
      alert("Please login to react");
      navigate("/login");
      return;
    }

    try {
      const res = await API.post(
        `/videos/${videoId}/react`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedReaction = res.data;

      setReels((prev) =>
        prev.map((reel) => {
          if (reel.id !== videoId) return reel;

          const prevReaction = reel.VideoReactions?.find(
            (r) => r.userId === updatedReaction.userId
          );
          let likes = reel.likes || 0;
          let dislikes = reel.dislikes || 0;

          if (prevReaction) {
            if (prevReaction.type === "like") likes -= 1;
            if (prevReaction.type === "dislike") dislikes -= 1;
          }

          if (updatedReaction.type) {
            if (updatedReaction.type === "like") likes += 1;
            if (updatedReaction.type === "dislike") dislikes += 1;
          }

          const newReactions =
            reel.VideoReactions?.filter(
              (r) => r.userId !== updatedReaction.userId
            ) || [];
          if (updatedReaction.type) newReactions.push(updatedReaction);

          return { ...reel, likes, dislikes, VideoReactions: newReactions };
        })
      );
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // Subscribe / Unsubscribe
  const handleSubscribe = async (creatorId) => {
    if (!creatorId) return;
    if (!token) {
      alert("Please login to subscribe");
      navigate("/login");
      return;
    }

    try {
      const res = await API.post(
        "/subscriptions/toggle",
        { subscribedToId: creatorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { subscribed } = res.data;

      // ✅ Update localStorage immediately
      setSubscribedCreators(prev => {
        const newSet = new Set(prev);
        if (subscribed) {
          newSet.add(creatorId);
        } else {
          newSet.delete(creatorId);
        }
        return newSet;
      });

      setReels((prev) =>
        prev.map((r) =>
          r.User?.id === creatorId
            ? {
                ...r,
                isSubscribed: subscribed,
                subscriberCount: Math.max(
                  0,
                  (r.subscriberCount || 0) + (subscribed ? 1 : -1)
                ),
              }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to toggle subscription:", err);
    }
  };

  // Comment submit
  const handleComment = async (videoId, e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to comment");
      navigate("/login");
      return;
    }

    if (!commentText.trim()) return;

    try {
      const res = await API.post(
        `/videos/${videoId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment =
        res?.data?.comment || {
          id: Date.now(),
          content: commentText,
          user: { name: userName },
        };

      setReels((prev) =>
        prev.map((r) =>
          r.id === videoId
            ? { ...r, VideoComments: [newComment, ...(r.VideoComments || [])] }
            : r
        )
      );

      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // Scroll handler
  const handleScroll = (e) => {
    const container = e.target;
    const newIndex = Math.round(container.scrollTop / window.innerHeight);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  // Autoplay & mute
  useEffect(() => {
    if (reels.length === 0) return;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex) video.play().catch(() => {});
      else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, reels]);

  return (
    <div
      className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black scrollbar-hide"
      onScroll={handleScroll}
      onMouseDown={handleMiddleClick} // <-- Middle click attached here
    >
      {reels.length === 0 ? (
        <div className="flex justify-center items-center h-screen text-white text-lg sm:text-xl">
          No short videos (10s–120s) available 😔
        </div>
      ) : (
        reels.map((reel, i) => {
          const userReaction = reel.VideoReactions?.find(
            (r) => r.userId === userId
          )?.type;
          const videoSrc = getVideoSrc(reel);
          const isSubscribed = subscribedCreators.has(reel.User?.id); // ✅ Use localStorage

          return (
            <div
              key={reel.id}
              className="relative h-screen w-full flex justify-center items-center snap-start bg-black"
            >
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={videoSrc}
                muted={muted}
                loop
                playsInline
                poster={reel.thumbnailUrl || "/fallback.png"}
                className="h-[90vh] w-auto max-w-[500px] object-cover rounded-2xl shadow-2xl bg-black sm:h-[85vh]"
                onClick={() => {
                  const currentVideo = videoRefs.current[i];
                  if (!currentVideo) return;

                  if (currentVideo.paused) currentVideo.play().catch(() => {});
                  else currentVideo.pause();
                }}
                onMouseDown={(e) => {
                  // Middle click
                  if (e.button === 1) {
                    e.preventDefault(); // prevent scroll
                    const currentVideo = videoRefs.current[i];
                    if (!currentVideo) return;

                    if (currentVideo.paused) currentVideo.play().catch(() => {});
                    else currentVideo.pause();
                  }
                }}
              />

              {/* Info + Subscribe */}
              <div className="absolute bottom-16 left-5 text-white max-w-[70%] sm:max-w-[60%]">
                <h2 className="text-lg sm:text-xl font-bold mb-1">{reel.title}</h2>
                <p className="text-xs sm:text-sm opacity-80 line-clamp-2">{reel.description}</p>
                <p className="text-[10px] sm:text-xs opacity-60 mt-1">
                  Duration: {Math.round(reel.duration)} sec
                </p>

                {userId !== reel.User?.id && (
                  <button
                    onClick={() => handleSubscribe(reel.User?.id)}
                    className={`mt-3 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      subscribedCreators.has(reel.User?.id)
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {subscribedCreators.has(reel.User?.id)
                      ? `Subscribed (${reel.subscriberCount || 0})`
                      : `Subscribe (${reel.subscriberCount || 0})`}
                  </button>


                )}

                {reel.User && (
                  <p className="text-white text-sm mt-1 truncate">
                    Uploaded by: {reel.User?.name || "Unknown"}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute right-4 sm:right-6 bottom-24 flex flex-col items-center space-y-5 text-white">
                <button
                  onClick={() => handleReaction(reel.id, "like")}
                  className={`p-2 sm:p-3 rounded-full transition ${
                    userReaction === "like"
                      ? "bg-red-600 scale-110"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <Heart />
                </button>
                <p className="text-xs sm:text-sm">{reel.likes || 0}</p>

                <button
                  onClick={() => handleReaction(reel.id, "dislike")}
                  className={`p-2 sm:p-3 rounded-full transition ${
                    userReaction === "dislike"
                      ? "bg-blue-600 scale-110"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <X />
                </button>
                <p className="text-xs sm:text-sm">{reel.dislikes || 0}</p>

                <button
                  onClick={() =>
                    setActiveComments(activeComments === reel.id ? null : reel.id)
                  }
                  className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <MessageCircle />
                </button>

                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  {muted ? <VolumeX /> : <Volume2 />}
                </button>
              </div>

              {/* Comments */}
              {activeComments === reel.id && (
                <div className="absolute inset-0 bg-black/80 flex flex-col justify-end">
                  <div className="bg-white p-3 sm:p-4 max-h-[60vh] overflow-y-auto rounded-t-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-base sm:text-lg font-semibold">
                        Comments ({reel.VideoComments?.length || 0})
                      </h3>
                      <button
                        onClick={() => setActiveComments(null)}
                        className="text-gray-600 hover:text-black"
                      >
                        <X />
                      </button>
                    </div>

                    {(showAllComments
                      ? [...(reel.VideoComments || [])]
                      : [...(reel.VideoComments || [])].slice(0, 2)
                    ).map((c, idx) => (
                      <div key={idx} className="mb-2 border-b pb-1">
                        <p className="text-sm font-semibold">{c?.user?.name || "Anonymous"}</p>
                        <p className="text-gray-700 text-sm">{c?.content || c?.text}</p>
                      </div>
                    ))}

                    {reel.VideoComments?.length > 2 && (
                      <button
                        onClick={() => setShowAllComments(!showAllComments)}
                        className="text-blue-600 text-sm mt-2"
                      >
                        {showAllComments ? "View less" : "View more"}
                      </button>
                    )}

                    <form
                      onSubmit={(e) => handleComment(reel.id, e)}
                      className="flex gap-2 mt-3"
                    >
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow border p-2 rounded text-sm sm:text-base"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}


