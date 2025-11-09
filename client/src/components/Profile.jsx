




// gemini




// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Profile({ token }) {
//   const [user, setUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [commentText, setCommentText] = useState({});

//   // Fetch user and only their videos
//   const fetchProfileData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const userRes = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const currentUser = userRes.data.user;
//       setUser(currentUser);

//       // fetch only the logged-in user's videos
//       const videosRes = await axios.get(
//         "http://localhost:5000/api/videos/myvideos",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setVideos(videosRes.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profile data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchProfileData();
//   }, [token]);

//   // Upload new video
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Select a video file");
//     setUploading(true);

//     try {
//       const formData = new FormData();
//       formData.append("video", file);
//       formData.append("title", title);
//       formData.append("description", description);

//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       await fetchProfileData();

//       setTitle("");
//       setDescription("");
//       setFile(null);
//       alert("Video uploaded!");
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Edit video
//   const startEdit = (video) => {
//     setEditingVideo(video.id);
//     setTitle(video.title);
//     setDescription(video.description);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         `http://localhost:5000/api/videos/${editingVideo}`,
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchProfileData();

//       setEditingVideo(null);
//       setTitle("");
//       setDescription("");
//       alert("Video updated!");
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   // Delete video
//   const handleDelete = async (videoId) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       await fetchProfileData();
//       alert("Video deleted!");
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   // ✅ React (like/dislike) video
//   const handleReaction = async (videoId, type) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/react`,
//         { type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // update state locally
//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? {
//                 ...v,
//                 likes:
//                   type === "like" ? (v.likes || 0) + 1 : v.likes,
//                 dislikes:
//                   type === "dislike" ? (v.dislikes || 0) + 1 : v.dislikes,
//               }
//             : v
//         )
//       );
//     } catch (err) {
//       console.error("Failed to react:", err);
//       alert("Failed to react on video");
//     }
//   };

//   // ✅ Comment video
//   const handleComment = async (videoId) => {
//     const text = commentText[videoId];
//     if (!text || !text.trim()) return;

//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/comment`,
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? { ...v, VideoComments: [...(v.VideoComments || []), res.data] }
//             : v
//         )
//       );

//       setCommentText((prev) => ({ ...prev, [videoId]: "" }));
//     } catch (err) {
//       console.error("Failed to comment:", err);
//       alert("Failed to add comment");
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div>
//       {/* User Info */}
//       {user && (
//         <div className="bg-white p-4 rounded shadow-md mb-6">
//           <h2 className="text-xl font-semibold">{user.name}</h2>
//           <p className="text-gray-600">{user.email}</p>
//         </div>
//       )}

//       {/* Upload / Edit Form */}
//       <div className="bg-white p-4 rounded shadow-md mb-6">
//         <h3 className="font-semibold mb-2">
//           {editingVideo ? "Edit Video" : "Upload a Video"}
//         </h3>
//         <form onSubmit={editingVideo ? handleUpdate : handleUpload}>
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//             required
//           />
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           {!editingVideo && (
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="w-full mb-2"
//               required
//             />
//           )}
//           <button
//             type="submit"
//             disabled={uploading}
//             className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//           >
//             {editingVideo
//               ? "Update Video"
//               : uploading
//               ? "Uploading..."
//               : "Upload Video"}
//           </button>
//           {editingVideo && (
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingVideo(null);
//                 setTitle("");
//                 setDescription("");
//               }}
//               className="ml-2 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//           )}
//         </form>
//       </div>

//       {/* My Uploaded Videos */}
//       <h3 className="text-xl font-semibold mb-2">My Uploaded Videos</h3>
//       {videos.length === 0 && <p>No videos uploaded yet.</p>}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {videos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div className="aspect-video bg-black flex items-center justify-center">
//               <video className="w-full h-full" controls preload="metadata">
//                 <source
//                   src={`http://localhost:5000/uploads/${video.filename}`}
//                   type="video/mp4"
//                 />
//               </video>
//             </div>
//             <div className="p-4">
//               <h3 className="font-semibold">{video.title || "Untitled"}</h3>
//               <p className="text-sm text-gray-500">
//                 {video.description || "No description"}
//               </p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Views: {video.views || 0}
//               </p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Likes: {video.likes || 0} | Dislikes: {video.dislikes || 0}
//               </p>

//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={() => handleReaction(video.id, "like")}
//                   className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
//                 >
//                   Like
//                 </button>
//                 <button
//                   onClick={() => handleReaction(video.id, "dislike")}
//                   className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
//                 >
//                   Dislike
//                 </button>
//                 <button
//                   onClick={() => startEdit(video)}
//                   className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(video.id)}
//                   className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900"
//                 >
//                   Delete
//                 </button>
//               </div>

//               <div className="mt-2">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentText[video.id] || ""}
//                   onChange={(e) =>
//                     setCommentText((prev) => ({
//                       ...prev,
//                       [video.id]: e.target.value,
//                     }))
//                   }
//                   className="w-full p-2 mb-2 border rounded"
//                 />
//                 <button
//                   onClick={() => handleComment(video.id)}
//                   className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
//                 >
//                   Comment
//                 </button>
//               </div>

//               {video.VideoComments?.length > 0 && (
//                 <div className="mt-2">
//                   <h4 className="font-semibold">Comments:</h4>
//                   {video.VideoComments.map((c) => (
//                     <p key={c.id} className="text-sm text-gray-600">
//                       {c.text} -{" "}
//                       <span className="text-gray-400">
//                         {c.user?.name || "Unknown"}
//                       </span>
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }











// Q&A displayed at last
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getQuestions, askQuestion } from "../questionService";
// import dayjs from "dayjs";

// export default function Profile() {
//   const token = localStorage.getItem("token");

//   const [user, setUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [commentText, setCommentText] = useState({});
//   const [questionText, setQuestionText] = useState({});
//   const [questions, setQuestions] = useState([]);
//   const [loadingQ, setLoadingQ] = useState(false);
//   const [showQuestions, setShowQuestions] = useState(false);

//   // ---------------- Fetch Profile ----------------
//   const fetchProfileData = async () => {
//     if (!token) return setError("You must be logged in");
//     setLoading(true);
//     setError(null);

//     try {
//       const userRes = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userRes.data.user);

//       const videosRes = await axios.get(
//         "http://localhost:5000/api/videos/myvideos",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const fetchedVideos = videosRes.data;

//       // Fetch all questions per video and map asker → User
//       const allQuestions = [];
//       const updatedVideos = await Promise.all(
//         fetchedVideos.map(async (video) => {
//           const q = await getQuestions(video.id, token);
//           const mappedQuestions = q.map((question) => ({
//             ...question,
//             User: question.asker, // map backend 'asker' → 'User'
//             videoTitle: video.title,
//           }));
//           allQuestions.push(...mappedQuestions);

//           // Also attach per-video questions
//           return {
//             ...video,
//             VideoQuestions: mappedQuestions.sort(
//               (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//             ),
//           };
//         })
//       );

//       setVideos(updatedVideos);
//       setQuestions(allQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profile data or token expired");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Ask Question per Video ----------------
//   const handleAskQuestionForVideo = async (videoId) => {
//     const text = questionText[videoId];
//     if (!text?.trim()) return alert("Enter a question");
//     if (!token) return alert("You must be logged in");

//     setLoadingQ(true);
//     try {
//       await askQuestion(videoId, text, 0, token);
//       setQuestionText((prev) => ({ ...prev, [videoId]: "" }));
//       await fetchProfileData();
//     } catch (err) {
//       console.error("Failed to ask question:", err);
//       alert(err.message);
//     } finally {
//       setLoadingQ(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   // ---------------- Upload / Edit / Delete ----------------
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Select a video file");
//     if (!token) return alert("You must be logged in");

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("video", file);
//       formData.append("title", title);
//       formData.append("description", description);

//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       await fetchProfileData();
//       setTitle("");
//       setDescription("");
//       setFile(null);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const startEdit = (video) => {
//     setEditingVideo(video.id);
//     setTitle(video.title);
//     setDescription(video.description);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!token) return alert("You must be logged in");

//     try {
//       await axios.put(
//         `http://localhost:5000/api/videos/${editingVideo}`,
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchProfileData();
//       setEditingVideo(null);
//       setTitle("");
//       setDescription("");
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   const handleDelete = async (videoId) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     if (!token) return alert("You must be logged in");

//     try {
//       await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       await fetchProfileData();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   // ---------------- Reactions & Comments ----------------
//   const handleReaction = async (videoId, type) => {
//     if (!token) return alert("You must be logged in");
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/react`,
//         { type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedReaction = res.data;
//       setVideos((prev) =>
//         prev.map((v) => {
//           if (v.id !== videoId) return v;
//           let likes = v.likes || 0;
//           let dislikes = v.dislikes || 0;
//           const prevReaction = v.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );
//           if (prevReaction) {
//             if (prevReaction.type === "like") likes -= 1;
//             if (prevReaction.type === "dislike") dislikes -= 1;
//           }
//           if (updatedReaction.type === "like") likes += 1;
//           if (updatedReaction.type === "dislike") dislikes += 1;

//           const newReactions =
//             v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
//           newReactions.push(updatedReaction);
//           return { ...v, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error("Failed to react:", err);
//       alert("Failed to react on video");
//     }
//   };

//   const handleComment = async (videoId) => {
//     const text = commentText[videoId];
//     if (!text?.trim()) return;
//     if (!token) return alert("You must be logged in");
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/comment`,
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? { ...v, VideoComments: [...(v.VideoComments || []), res.data] }
//             : v
//         )
//       );
//       setCommentText((prev) => ({ ...prev, [videoId]: "" }));
//     } catch (err) {
//       console.error("Failed to comment:", err);
//       alert("Failed to add comment");
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* User Info */}
//       {user && (
//         <div className="bg-white p-6 rounded-xl shadow-lg mb-8 text-center hover:shadow-xl transition duration-300">
//           <h2 className="text-2xl font-bold">{user.name}</h2>
//           <p className="text-gray-600">{user.email}</p>
//         </div>
//       )}

//       {/* Upload / Edit Form */}
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8 hover:shadow-xl transition duration-300 text-center">
//         <h3 className="font-semibold mb-4 text-lg">
//           {editingVideo ? "Edit Video" : "Upload a Video"}
//         </h3>
//         <form
//           onSubmit={editingVideo ? handleUpdate : handleUpload}
//           className="space-y-3"
//         >
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//           {!editingVideo && (
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="w-full"
//               required
//             />
//           )}
//           <div className="flex justify-center gap-3 mt-2">
//             <button
//               type="submit"
//               disabled={uploading}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//             >
//               {editingVideo
//                 ? "Update Video"
//                 : uploading
//                 ? "Uploading..."
//                 : "Upload Video"}
//             </button>
//             {editingVideo && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingVideo(null);
//                   setTitle("");
//                   setDescription("");
//                 }}
//                 className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* Videos */}
//       <h3 className="text-2xl font-semibold mb-4">My Uploaded Videos</h3>
//       {videos.length === 0 && <p>No videos uploaded yet.</p>}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {videos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
//           >
//             <div className="aspect-video bg-black flex items-center justify-center group">
//               <video
//                 className="w-full h-full group-hover:scale-105 transition-transform duration-300"
//                 controls
//                 preload="metadata"
//               >
//                 <source
//                   src={`http://localhost:5000/uploads/${video.filename}`}
//                   type="video/mp4"
//                 />
//               </video>
//             </div>
//             <div className="p-4">
//               <h3 className="font-semibold text-lg">{video.title || "Untitled"}</h3>
//               <p className="text-sm text-gray-500">{video.description || "No description"}</p>
//               <p className="text-sm text-gray-400 mt-1">Views: {video.views || 0}</p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Likes: {video.likes || 0} | Dislikes: {video.dislikes || 0}
//               </p>

//               {/* Reactions */}
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={() => handleReaction(video.id, "like")}
//                   className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
//                 >
//                   Like
//                 </button>
//                 <button
//                   onClick={() => handleReaction(video.id, "dislike")}
//                   className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
//                 >
//                   Dislike
//                 </button>
//                 <button
//                   onClick={() => startEdit(video)}
//                   className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(video.id)}
//                   className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition"
//                 >
//                   Delete
//                 </button>
//               </div>

//               {/* Comments */}
//               <div className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentText[video.id] || ""}
//                   onChange={(e) =>
//                     setCommentText((prev) => ({ ...prev, [video.id]: e.target.value }))
//                   }
//                   className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={() => handleComment(video.id)}
//                   className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
//                 >
//                   Comment
//                 </button>
//                 {video.VideoComments?.length > 0 && (
//                   <div className="mt-2 max-h-12 overflow-y-auto border-t pt-2">
//                     {video.VideoComments.slice().reverse().map((c) => (
//                       <p key={c.id} className="text-sm text-gray-600 mb-1">
//                         <strong>{c.user?.name || "Unknown"}:</strong> {c.text}
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Per-video Q&A */}
//               <div className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="Ask a question about this video..."
//                   value={questionText[video.id] || ""}
//                   onChange={(e) =>
//                     setQuestionText((prev) => ({ ...prev, [video.id]: e.target.value }))
//                   }
//                   className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-purple-500"
//                 />
//                 <button
//                   onClick={() => handleAskQuestionForVideo(video.id)}
//                   className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition"
//                 >
//                   Ask Question
//                 </button>
//                 {video.VideoQuestions?.length > 0 && (
//                   <div className="mt-2 max-h-36 overflow-y-auto border-t pt-2">
//                     {video.VideoQuestions.map((q) => (
//                       <p key={q.id} className="text-sm text-gray-600 mb-1">
//                         <strong>{q.User?.name || "Anonymous"}:</strong> {q.text}{" "}
//                         <span className="text-xs text-gray-400">
//                           ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")})
//                         </span>
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Global Q&A Section */}
//       <div className="mt-8 bg-white p-4 rounded shadow-md">
//         <h3 className="text-xl font-semibold mb-2">All Questions (Global)</h3>

//         <button
//           onClick={() => setShowQuestions(!showQuestions)}
//           className="text-blue-600 underline mb-2"
//         >
//           {showQuestions ? "Hide Questions" : "View Questions"}
//         </button>

//         {showQuestions && questions.length > 0 && (
//           <ul className="space-y-2 max-h-72 overflow-y-auto">
//             {questions.map((q) => (
//               <li key={q.id} className="border p-2 rounded bg-gray-50 shadow-sm">
//                 <p className="text-sm text-gray-500">
//                   <strong>{q.User?.name || "Anonymous"}:</strong> {q.text} <br />
//                   <em>Video: {q.videoTitle || "Unknown"}</em>{" "}
//                   <span className="text-xs text-gray-400">
//                     ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")})
//                   </span>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//         {showQuestions && questions.length === 0 && <p>No questions yet.</p>}
//       </div>
//     </div>
//   );
// }







// Q&A after every video and last of videos

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getQuestions, askQuestion } from "../questionService";
// import dayjs from "dayjs";

// export default function Profile() {
//   const token = localStorage.getItem("token");

//   const [user, setUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [commentText, setCommentText] = useState({});
//   const [questionText, setQuestionText] = useState({});
//   const [questions, setQuestions] = useState([]);
//   const [loadingQ, setLoadingQ] = useState(false);
//   const [showQuestions, setShowQuestions] = useState(false);

//   // ---------------- Fetch Profile ----------------
//   const fetchProfileData = async () => {
//     if (!token) return setError("You must be logged in");
//     setLoading(true);
//     setError(null);

//     try {
//       const userRes = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userRes.data.user);

//       const videosRes = await axios.get(
//         "http://localhost:5000/api/videos/myvideos",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const fetchedVideos = videosRes.data;

//       // Fetch all questions per video and map asker → User
//       const allQuestions = [];
//       const updatedVideos = await Promise.all(
//         fetchedVideos.map(async (video) => {
//           const q = await getQuestions(video.id, token);
//           const mappedQuestions = q.map((question) => ({
//             ...question,
//             User: question.asker, // map backend 'asker' → 'User'
//             videoTitle: video.title,
//           }));
//           allQuestions.push(...mappedQuestions);

//           return {
//             ...video,
//             VideoQuestions: mappedQuestions.sort(
//               (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//             ),
//           };
//         })
//       );

//       setVideos(updatedVideos);
//       setQuestions(allQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profile data or token expired");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Ask Question per Video ----------------
//   const handleAskQuestionForVideo = async (videoId) => {
//     const text = questionText[videoId];
//     if (!text?.trim()) return alert("Enter a question");
//     if (!token) return alert("You must be logged in");

//     setLoadingQ(true);
//     try {
//       await askQuestion(videoId, text, 0, token);
//       setQuestionText((prev) => ({ ...prev, [videoId]: "" }));
//       await fetchProfileData();
//     } catch (err) {
//       console.error("Failed to ask question:", err);
//       alert(err.message);
//     } finally {
//       setLoadingQ(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   // ---------------- Upload / Edit / Delete ----------------
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Select a video file");
//     if (!token) return alert("You must be logged in");

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("video", file);
//       formData.append("title", title);
//       formData.append("description", description);

//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       await fetchProfileData();
//       setTitle("");
//       setDescription("");
//       setFile(null);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const startEdit = (video) => {
//     setEditingVideo(video.id);
//     setTitle(video.title);
//     setDescription(video.description);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!token) return alert("You must be logged in");

//     try {
//       await axios.put(
//         `http://localhost:5000/api/videos/${editingVideo}`,
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchProfileData();
//       setEditingVideo(null);
//       setTitle("");
//       setDescription("");
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   const handleDelete = async (videoId) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     if (!token) return alert("You must be logged in");

//     try {
//       await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       await fetchProfileData();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   // ---------------- Reactions & Comments ----------------
//   const handleReaction = async (videoId, type) => {
//     if (!token) return alert("You must be logged in");
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/react`,
//         { type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedReaction = res.data;
//       setVideos((prev) =>
//         prev.map((v) => {
//           if (v.id !== videoId) return v;
//           let likes = v.likes || 0;
//           let dislikes = v.dislikes || 0;
//           const prevReaction = v.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );
//           if (prevReaction) {
//             if (prevReaction.type === "like") likes -= 1;
//             if (prevReaction.type === "dislike") dislikes -= 1;
//           }
//           if (updatedReaction.type === "like") likes += 1;
//           if (updatedReaction.type === "dislike") dislikes += 1;

//           const newReactions =
//             v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
//           newReactions.push(updatedReaction);
//           return { ...v, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error("Failed to react:", err);
//       alert("Failed to react on video");
//     }
//   };

//   const handleComment = async (videoId) => {
//     const text = commentText[videoId];
//     if (!text?.trim()) return;
//     if (!token) return alert("You must be logged in");
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/comment`,
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? { ...v, VideoComments: [...(v.VideoComments || []), res.data] }
//             : v
//         )
//       );
//       setCommentText((prev) => ({ ...prev, [videoId]: "" }));
//     } catch (err) {
//       console.error("Failed to comment:", err);
//       alert("Failed to add comment");
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* User Info */}
//       {user && (
//         <div className="bg-white p-6 rounded-xl shadow-lg mb-8 text-center hover:shadow-xl transition duration-300">
//           <h2 className="text-2xl font-bold">{user.name}</h2>
//           <p className="text-gray-600">{user.email}</p>
//         </div>
//       )}

//       {/* Upload / Edit Form */}
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8 hover:shadow-xl transition duration-300 text-center">
//         <h3 className="font-semibold mb-4 text-lg">
//           {editingVideo ? "Edit Video" : "Upload a Video"}
//         </h3>
//         <form
//           onSubmit={editingVideo ? handleUpdate : handleUpload}
//           className="space-y-3"
//         >
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//           {!editingVideo && (
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="w-full"
//               required
//             />
//           )}
//           <div className="flex justify-center gap-3 mt-2">
//             <button
//               type="submit"
//               disabled={uploading}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//             >
//               {editingVideo
//                 ? "Update Video"
//                 : uploading
//                 ? "Uploading..."
//                 : "Upload Video"}
//             </button>
//             {editingVideo && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingVideo(null);
//                   setTitle("");
//                   setDescription("");
//                 }}
//                 className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* Videos */}
//       <h3 className="text-2xl font-semibold mb-4">My Uploaded Videos</h3>
//       {videos.length === 0 && <p>No videos uploaded yet.</p>}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {videos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
//           >
//             <div className="aspect-video bg-black flex items-center justify-center group">
//               <video
//                 className="w-full h-full group-hover:scale-105 transition-transform duration-300"
//                 controls
//                 preload="metadata"
//               >
//                 <source
//                   src={`http://localhost:5000/uploads/${video.filename}`}
//                   type="video/mp4"
//                 />
//               </video>
//             </div>
//             <div className="p-4">
//               <h3 className="font-semibold text-lg">{video.title || "Untitled"}</h3>
//               <p className="text-sm text-gray-500">{video.description || "No description"}</p>
//               <p className="text-sm text-gray-400 mt-1">Views: {video.views || 0}</p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Likes: {video.likes || 0} | Dislikes: {video.dislikes || 0}
//               </p>

//               {/* Reactions */}
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={() => handleReaction(video.id, "like")}
//                   className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
//                 >
//                   Like
//                 </button>
//                 <button
//                   onClick={() => handleReaction(video.id, "dislike")}
//                   className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
//                 >
//                   Dislike
//                 </button>
//                 <button
//                   onClick={() => startEdit(video)}
//                   className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(video.id)}
//                   className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition"
//                 >
//                   Delete
//                 </button>
//               </div>

//               {/* Comments */}
//               <div className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentText[video.id] || ""}
//                   onChange={(e) =>
//                     setCommentText((prev) => ({ ...prev, [video.id]: e.target.value }))
//                   }
//                   className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={() => handleComment(video.id)}
//                   className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
//                 >
//                   Comment
//                 </button>

//                 {/* Display comments in “test-like” scrollable box */}
//                 {video.VideoComments?.length > 0 && (
//                   <div className="mt-2 max-h-12 overflow-y-auto border-t pt-2">
//                     {video.VideoComments
//                       .slice()
//                       .reverse()
//                       .map((c) => (
//                         <p key={c.id} className="text-sm text-gray-600 mb-1">
//                           <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}{" "}
//                           <span className="text-xs text-gray-400">
//                             ({dayjs(c.createdAt).format("DD MMM YYYY, hh:mm A")})
//                           </span>
//                         </p>
//                       ))}
//                   </div>
//                 )}
//               </div>

//               {/* Per-video Q&A */}
//               <div className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="Ask a question about this video..."
//                   value={questionText[video.id] || ""}
//                   onChange={(e) =>
//                     setQuestionText((prev) => ({ ...prev, [video.id]: e.target.value }))
//                   }
//                   className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-purple-500"
//                 />
//                 <button
//                   onClick={() => handleAskQuestionForVideo(video.id)}
//                   className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition"
//                 >
//                   Ask Question
//                 </button>

//                 {/* Display per-video Q&A in scrollable box */}
//                 {video.VideoQuestions?.length > 0 && (
//                   <div className="mt-2 max-h-36 overflow-y-auto border-t pt-2">
//                     {video.VideoQuestions.map((q) => (
//                       <p key={q.id} className="text-sm text-gray-600 mb-1">
//                         <strong>{q.User?.name || "Anonymous"}:</strong> {q.text}{" "}
//                         <span className="text-xs text-gray-400">
//                           ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")})
//                         </span>
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Global Q&A Section */}
//       <div className="mt-8 bg-white p-4 rounded shadow-md">
//         <h3 className="text-xl font-semibold mb-2">All Questions (Global)</h3>

//         <button
//           onClick={() => setShowQuestions(!showQuestions)}
//           className="text-blue-600 underline mb-2"
//         >
//           {showQuestions ? "Hide Questions" : "View Questions"}
//         </button>

//         {showQuestions && questions.length > 0 && (
//           <ul className="space-y-2 max-h-72 overflow-y-auto">
//             {questions.map((q) => (
//               <li key={q.id} className="border p-2 rounded bg-gray-50 shadow-sm">
//                 <p className="text-sm text-gray-500">
//                   <strong>{q.User?.name || "Anonymous"}:</strong> {q.text} <br />
//                   <em>Video: {q.videoTitle || "Unknown"}</em>{" "}
//                   <span className="text-xs text-gray-400">
//                     ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")})
//                   </span>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//         {showQuestions && questions.length === 0 && <p>No questions yet.</p>}
//       </div>
//     </div>
//   );
// }






// code to add badges
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { calculateUserBadges } from "../utils/badgeUtils";


// import { getQuestions, askQuestion } from "../questionService";
// import dayjs from "dayjs";

// function Profile({ token }) {
//   const [allVideos, setAllVideos] = useState([]); // <-- Add this line
// // export default function Profile() {
// //   const token = localStorage.getItem("token");

//   const [user, setUser] = useState(null);
//   const [videos, setVideos] = useState([]);
//   // const [badges, setBadges] = useState([]); // 🏅 badges
//   const [userBadges, setUserBadges] = useState({ badges: [], points: 0 });

//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [commentText, setCommentText] = useState({});
//   const [questionText, setQuestionText] = useState({});
//   const [questions, setQuestions] = useState([]);
//   const [loadingQ, setLoadingQ] = useState(false);
//   const [showQuestions, setShowQuestions] = useState(false);
//   const [privacy, setPrivacy] = useState({
//     videoVisibility: "public",
//     allowMessages: "everyone",
//     showBadges: true,
//   });


//   // ---------------- Fetch Profile ----------------
//   const fetchProfileData = async () => {
//     if (!token) return setError("You must be logged in");
//     setLoading(true);
//     setError(null);

//     try {
//       const userRes = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userRes.data.user);

//       // privact latest code
//       const privacyRes = await axios.get("http://localhost:5000/api/privacy/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPrivacy(privacyRes.data);


//       const res = await axios.get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const userData = res.data.user;
//       setUser(userData); // userData.subscriberCount will be available
    

//       const videosRes = await axios.get(
//         "http://localhost:5000/api/videos/myvideos",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const fetchedVideos = videosRes.data;


//       // 3️⃣ Fetch all videos (for badge keyword matching)
//       const allVideosRes = await axios.get("http://localhost:5000/api/videos", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allVideosFetched = allVideosRes.data; // array of { id, title, description }
//       setAllVideos(allVideosFetched);
      

//       // Fetch all questions globally
//       const allQuestionsRes = await axios.get("http://localhost:5000/api/questions", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allQuestionsGlobal = allQuestionsRes.data; // all questions from all videos


//       // Fetch all questions per video and map asker → User
//       const allQuestions = [];
//       const updatedVideos = await Promise.all(
//         fetchedVideos.map(async (video) => {
//           const q = await getQuestions(video.id, token);
//           const mappedQuestions = q.map((question) => ({
//             ...question,
//             User: question.asker,        // <- make sure this has id
//             userId: question.asker?.id,  // <- add this for easier filtering
//             videoTitle: video.title,
//           }));
//           allQuestions.push(...mappedQuestions);


//           return {
//             ...video,
//             VideoQuestions: mappedQuestions.sort(
//               (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//             ),
//           };
//         })
//       );

//       setVideos(updatedVideos);
//       setQuestions(
//         allQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       );

//       // 🏅 Badge Logic
//       // calculateBadges(userRes.data.user, updatedVideos);
//       // calculateBadges(userRes.data.user, updatedVideos, allQuestions, allVideosFetched);
//       // setBadges(badges);

//       // const badges = calculateUserBadges(userRes.data.user, updatedVideos, allQuestions, allVideosFetched);
//       // setBadges(badges);
//       const calculatedBadges = calculateUserBadges(userRes.data.user, updatedVideos, allQuestions, allVideosFetched);
//       setUserBadges(calculatedBadges);

    

//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profile data or token expired");
//     } finally {
//       setLoading(false);
//     }
//   };


//   // ---------------- Upload / Edit / Delete ----------------
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Select a video file");
//     if (!token) return alert("You must be logged in");

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("video", file);
//       formData.append("title", title);
//       formData.append("description", description);
//       // formData.append("privacy", privacy.videoVisibility);
//       formData.append("privacy", privacy.videoVisibility);

//       await axios.post("http://localhost:5000/api/videos/upload", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       await fetchProfileData();
//       setTitle("");
//       setDescription("");
//       setFile(null);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const startEdit = (video) => {
//     setEditingVideo(video.id);
//     setTitle(video.title);
//     setDescription(video.description);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!token) return alert("You must be logged in");

//     try {
//       await axios.put(
//         `http://localhost:5000/api/videos/${editingVideo}`,
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchProfileData();
//       setEditingVideo(null);
//       setTitle("");
//       setDescription("");
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   const handleDelete = async (videoId) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     if (!token) return alert("You must be logged in");

//     try {
//       await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       await fetchProfileData();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   // ---------------- Reactions & Comments ----------------
//   const handleReaction = async (videoId, type) => {
//     if (!token) return alert("You must be logged in");
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/react`,
//         { type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedReaction = res.data;
//       setVideos((prev) =>
//         prev.map((v) => {
//           if (v.id !== videoId) return v;
//           let likes = v.likes || 0;
//           let dislikes = v.dislikes || 0;
//           const prevReaction = v.VideoReactions?.find(
//             (r) => r.userId === updatedReaction.userId
//           );
//           if (prevReaction) {
//             if (prevReaction.type === "like") likes -= 1;
//             if (prevReaction.type === "dislike") dislikes -= 1;
//           }
//           if (updatedReaction.type === "like") likes += 1;
//           if (updatedReaction.type === "dislike") dislikes += 1;

//           const newReactions =
//             v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
//           newReactions.push(updatedReaction);
//           return { ...v, likes, dislikes, VideoReactions: newReactions };
//         })
//       );
//     } catch (err) {
//       console.error("Failed to react:", err);
//       alert("Failed to react on video");
//     }
//   };

//   const handleComment = async (videoId) => {
//     const text = commentText[videoId];
//     if (!text?.trim()) return;
//     if (!token) return alert("You must be logged in");
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/comment`,
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setVideos((prev) =>
//         prev.map((v) =>
//           v.id === videoId
//             ? { ...v, VideoComments: [...(v.VideoComments || []), res.data] }
//             : v
//         )
//       );
//       setCommentText((prev) => ({ ...prev, [videoId]: "" }));
//     } catch (err) {
//       console.error("Failed to comment:", err);
//       alert("Failed to add comment");
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* User Info */}
//       {user && (
//         <div className="bg-white p-6 rounded-xl shadow-lg mb-8 text-center hover:shadow-xl transition duration-300">
//           <h2 className="text-2xl font-bold">{user.name}</h2>
//           <p className="text-gray-600">{user.email}</p>
//           <p className="text-gray-700 mt-2">
//             Subscribers: <span className="font-semibold">{user.subscriberCount || 0}</span>
//           </p>
//           <p>Points: {userBadges.points}</p>
          

//           {/* 🏅 Badge Section
//           <div className="mt-4 flex flex-wrap justify-center gap-4">
//             {badges.map((badge, index) => (
//               <div
//                 key={index}
//                 className="bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-400 rounded-xl px-4 py-2 text-center shadow-md hover:shadow-lg transition"
//               >
//                 <p className="font-semibold text-yellow-800">{badge.name}</p>
//                 <p className="text-xs text-yellow-700">{badge.description}</p>
//               </div>
//             ))}
//           </div> */}
//           {/* 🏅 Badge Section with Enhanced Effects */}
//           <div className="mt-4 flex flex-wrap justify-center gap-6">
//             {/* {badges.map((badge, index) => ( */}
//             {userBadges.badges.map((badge, index) => (
              
//               <div
//                 key={index}
//                 className="
//                 relative
//                 bg-gradient-to-r from-yellow-100 to-yellow-200
//                 border border-yellow-400
//                 rounded-2xl
//                 px-6 py-4
//                 text-center
//                 shadow-lg
//                 transform
//                 transition-all duration-300
//                 hover:scale-110
//                 hover:rotate-3
//                 hover:shadow-2xl
//                 cursor-pointer
//                 before:absolute before:inset-0 before:rounded-2xl before:bg-yellow-300 before:opacity-20 before:blur-xl before:scale-90 before:transition-all before:duration-500 hover:before:scale-110
//               "
//               >
//                 <p className="font-bold text-yellow-800 text-lg animate-pulse">{badge.name}</p>
//                 <p className="text-xs text-yellow-700 mt-1">{badge.description}</p>
//                 {/* <p>Points: {userBadges.points}</p> */}
//                 {/* Display points per batch */}
//                 {/* Uploads */}
//                 {badge.name.includes("Creator") && (
//                   <p>Points: {userBadges.batchPoints.uploads.points}</p>
//                 )}

//                 {/* Likes */}
//                 {badge.name.includes("Audience") && (
//                   <p>
//                     Likes: {userBadges.batchPoints.likes.count} | Points: {userBadges.batchPoints.likes.points}
//                   </p>
//                 )}

//                 {/* Subscribers */}
//                 {(badge.name.includes("Influencer") || badge.name.includes("Popular") || badge.name.includes("Rising")) && (
//                   <p>Points: {userBadges.batchPoints.subscribers.points}</p>
//                 )}

//                 {/* Questions */}
//                 {(badge.name.includes("Curious") || badge.name.includes("Inquisitive") || badge.name.includes("Expert")) && (
//                   <p>Points: {userBadges.batchPoints.questions.points}</p>
//                 )}

//                 {/* Keyword Match */}
//                 {badge.name.includes("Matcher") && (
//                   <p>Points: {userBadges.batchPoints.keywordMatch.points}</p>
//                 )}


//                 {/* Sparkle Animation */}
//                 <span className="absolute top-1 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
//                 <span className="absolute bottom-1 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-200"></span>
//               </div>
//             ))}
//           </div>


//         </div>
//       )}
//       {/* Privacy Settings */}
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
//         <h3 className="text-xl font-semibold mb-4">Privacy Settings 🔒</h3>
//         <form
//           onSubmit={async (e) => {
//             e.preventDefault();
//             try {
//               await axios.put(
//                 "http://localhost:5000/api/privacy/update",
//                 privacy,
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//               alert("Privacy settings updated!");
//             } catch (err) {
//               console.error(err);
//               alert("Failed to update privacy settings");
//             }
//           }}
//           className="space-y-4"
//         >
//           {/* Visibility */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Who can view your videos?
//             </label>
//             <select
//               value={privacy.videoVisibility}
//               onChange={(e) =>
//                 setPrivacy((prev) => ({ ...prev, videoVisibility: e.target.value }))
//               }
//               className="w-full mt-1 p-2 border rounded"
//             >
//               <option value="public">Public</option>
//               <option value="subscribers">Subscribers only</option>
//               <option value="private">Only me</option>
//             </select>
//           </div>

//           {/* Messaging */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Who can message you?
//             </label>
//             <select
//               value={privacy.allowMessages}
//               onChange={(e) =>
//                 setPrivacy((prev) => ({ ...prev, allowMessages: e.target.value }))
//               }
//               className="w-full mt-1 p-2 border rounded"
//             >
//               <option value="everyone">Everyone</option>
//               <option value="subscribers">Subscribers only</option>
//               <option value="none">No one</option>
//             </select>
//           </div>

//           {/* Badges */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={privacy.showBadges}
//               onChange={(e) =>
//                 setPrivacy((prev) => ({ ...prev, showBadges: e.target.checked }))
//               }
//             />
//             <label className="text-sm text-gray-700">
//               Show my badges publicly
//             </label>
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>

//       {/* Upload / Edit Form */}
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8 hover:shadow-xl transition duration-300 text-center">
//         <h3 className="font-semibold mb-4 text-lg">
//           {editingVideo ? "Edit Video" : "Upload a Video"}
//         </h3>
//         <form
//           onSubmit={editingVideo ? handleUpdate : handleUpload}
//           className="space-y-3"
//         >
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//           {!editingVideo && (
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="w-full"
//               required
//             />
//           )}
//           <div className="flex justify-center gap-3 mt-2">
//             <button
//               type="submit"
//               disabled={uploading}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//             >
//               {editingVideo
//                 ? "Update Video"
//                 : uploading
//                 ? "Uploading..."
//                 : "Upload Video"}
//             </button>
//             {editingVideo && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingVideo(null);
//                   setTitle("");
//                   setDescription("");
//                 }}
//                 className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* Videos */}
//       <h3 className="text-2xl font-semibold mb-4">My Uploaded Videos</h3>
//       {videos.length === 0 && <p>No videos uploaded yet.</p>}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {videos.map((video) => (
//           <div
//             key={video.id}
//             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
//           >
//             <div className="aspect-video bg-black flex items-center justify-center group">
//               <video
//                 className="w-full h-full group-hover:scale-105 transition-transform duration-300"
//                 controls
//                 preload="metadata"
//               >
//                 <source
//                   src={`http://localhost:5000/uploads/${video.filename}`}
//                   type="video/mp4"
//                 />
//               </video>
//             </div>
//             <div className="p-4">
//               <h3 className="font-semibold text-lg">
//                 {video.title || "Untitled"}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {video.description || "No description"}
//               </p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Views: {video.views || 0}
//               </p>
//               <p className="text-sm text-gray-400 mt-1">
//                 Likes: {video.likes || 0} | Dislikes: {video.dislikes || 0}
//               </p>

//               {/* Reactions */}
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={() => handleReaction(video.id, "like")}
//                   className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
//                 >
//                   Like
//                 </button>
//                 <button
//                   onClick={() => handleReaction(video.id, "dislike")}
//                   className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
//                 >
//                   Dislike
//                 </button>
//                 <button
//                   onClick={() => startEdit(video)}
//                   className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(video.id)}
//                   className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition"
//                 >
//                   Delete
//                 </button>
//               </div>

//               {/* Comments */}
//               <div className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentText[video.id] || ""}
//                   onChange={(e) =>
//                     setCommentText((prev) => ({
//                       ...prev,
//                       [video.id]: e.target.value,
//                     }))
//                   }
//                   className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={() => handleComment(video.id)}
//                   className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
//                 >
//                   Comment
//                 </button>

//                 {video.VideoComments?.length > 0 && (
//                   <div className="mt-2 max-h-12 overflow-y-auto border-t pt-2">
//                     {video.VideoComments.slice()
//                       .reverse()
//                       .map((c) => (
//                         <p key={c.id} className="text-sm text-gray-600 mb-1">
//                           <strong>{c.user?.name || "Anonymous"}:</strong>{" "}
//                           {c.text}{" "}
//                           <span className="text-xs text-gray-400">
//                             ({dayjs(c.createdAt).format(
//                               "DD MMM YYYY, hh:mm A"
//                             )})
//                           </span>
//                         </p>
//                       ))}
//                   </div>
//                 )}
//               </div>

//               {/* Per-video Q&A */}
//               <div className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="Ask a question about this video..."
//                   value={questionText[video.id] || ""}
//                   onChange={(e) =>
//                     setQuestionText((prev) => ({
//                       ...prev,
//                       [video.id]: e.target.value,
//                     }))
//                   }
//                   className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-purple-500"
//                 />
//                 <button
//                   onClick={() => handleAskQuestionForVideo(video.id)}
//                   className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition"
//                 >
//                   Ask Question
//                 </button>

//                 {video.VideoQuestions?.length > 0 && (
//                   <div className="mt-2 max-h-12 overflow-y-auto border-t pt-2">
//                     {video.VideoQuestions.map((q) => (
//                       <p key={q.id} className="text-sm text-gray-600 mb-1">
//                         <strong>{q.User?.name || "Anonymous"}:</strong> {q.text}{" "}
//                         <span className="text-xs text-gray-400">
//                           ({dayjs(q.createdAt).format(
//                             "DD MMM YYYY, hh:mm A"
//                           )})
//                         </span>
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Global Q&A Section */}
//       <div className="mt-8 bg-white p-4 rounded shadow-md">
//         <h3 className="text-xl font-semibold mb-2">All Questions (Global)</h3>

//         <button
//           onClick={() => setShowQuestions(!showQuestions)}
//           className="text-blue-600 underline mb-2"
//         >
//           {showQuestions ? "Hide Questions" : "View Questions"}
//         </button>

//         {showQuestions && questions.length > 0 && (
//           <ul className="space-y-2 max-h-72 overflow-y-auto">
//             {questions.map((q) => (
//               <li
//                 key={q.id}
//                 className="border p-2 rounded bg-gray-50 shadow-sm"
//               >
//                 <p className="text-sm text-gray-500">
//                   <strong>{q.User?.name || "Anonymous"}:</strong> {q.text} <br />
//                   <em>Video: {q.videoTitle || "Unknown"}</em>{" "}
//                   <span className="text-xs text-gray-400">
//                     ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")})
//                   </span>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//         {showQuestions && questions.length === 0 && <p>No questions yet.</p>}
//       </div>
//     </div>
//   );
// }
// // At the end of Profile.jsx
// export default Profile;


















import { useEffect, useState } from "react";
import axios from "axios";
import { calculateUserBadges } from "../utils/badgeUtils";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";



import { getQuestions, askQuestion } from "../questionService";
import dayjs from "dayjs";

function Profile({ token }) {
  const [allVideos, setAllVideos] = useState([]); // <-- Add this line
// export default function Profile() {
//   const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  // const [badges, setBadges] = useState([]); // 🏅 badges
  const [userBadges, setUserBadges] = useState({ badges: [], points: 0 });
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [questionText, setQuestionText] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [privacy, setPrivacy] = useState({
    videoVisibility: "public",
    allowMessages: "everyone",
    showBadges: true,
  });


  // ---------------- Fetch Profile ----------------
  const fetchProfileData = async () => {
    if (!token) return setError("You must be logged in");
    setLoading(true);
    setError(null);

    try {
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);

      // privact latest code
      const privacyRes = await axios.get("http://localhost:5000/api/privacy/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrivacy(privacyRes.data);


      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.user;
      setUser(userData); // userData.subscriberCount will be available
    

      const videosRes = await axios.get(
        "http://localhost:5000/api/videos/myvideos",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedVideos = videosRes.data;


      // 3️⃣ Fetch all videos (for badge keyword matching)
      const allVideosRes = await axios.get("http://localhost:5000/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allVideosFetched = allVideosRes.data; // array of { id, title, description }
      setAllVideos(allVideosFetched);
      

      // Fetch all questions globally
      const allQuestionsRes = await axios.get("http://localhost:5000/api/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allQuestionsGlobal = allQuestionsRes.data; // all questions from all videos


      // Fetch all questions per video and map asker → User
      const allQuestions = [];
      const updatedVideos = await Promise.all(
        fetchedVideos.map(async (video) => {
          const q = await getQuestions(video.id, token);
          const mappedQuestions = q.map((question) => ({
            ...question,
            User: question.asker,        // <- make sure this has id
            userId: question.asker?.id,  // <- add this for easier filtering
            videoTitle: video.title,
          }));
          allQuestions.push(...mappedQuestions);


          return {
            ...video,
            VideoQuestions: mappedQuestions.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          };
        })
      );

      setVideos(updatedVideos);
      setQuestions(
        allQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );

      // 🏅 Badge Logic
      // calculateBadges(userRes.data.user, updatedVideos);
      // calculateBadges(userRes.data.user, updatedVideos, allQuestions, allVideosFetched);
      // setBadges(badges);

      // const badges = calculateUserBadges(userRes.data.user, updatedVideos, allQuestions, allVideosFetched);
      // setBadges(badges);
      const calculatedBadges = calculateUserBadges(userRes.data.user, updatedVideos, allQuestions, allVideosFetched);
      setUserBadges(calculatedBadges);

    

    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile data or token expired");
    } finally {
      setLoading(false);
    }
  };
  // ProfilePage.jsx


  const ProfilePage = ({ profileUser }) => {
    const token = localStorage.getItem("token");
    const currentUserId = token ? jwt_decode(token).id : null;

    const [showChat, setShowChat] = useState(false);

    const isOwnerOrAdmin = currentUserId === profileUser.id; // profile owner/admin

    return (
      <div>
        <h1>{profileUser.name}'s Profile</h1>
        {/* other profile info */}

        {isOwnerOrAdmin && (
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            {showChat ? "Hide Chat" : "View Chat"}
          </button>
        )}

        {showChat && (
          <div className="mt-4">
            <MessagePage
              initialUserId={null} // can leave null to show all chats related to profile
              videoOwnerId={profileUser.id} // pass profile owner
              readOnly={false} // make input box hidden for owner/admin view
            />
          </div>
        )}
      </div>
    );
  };




  // ---------------- Badge Calculation ----------------
  // const calculateBadges = (user, userVideos, allQuestions) => {
  //   const newBadges = [];
  //   const uploadCount = userVideos.length;
  //   const totalLikes = userVideos.reduce((sum, v) => sum + (v.likes || 0), 0);
  //   const subscriberCount = user.subscriberCount || 0;

  //   // Upload badge
  //   if (uploadCount >= 5)
  //     newBadges.push({
  //       name: "Content Creator 🎥",
  //       description: "Uploaded 5+ videos",
  //     });
    
  //   // Likes badge
  //   if (totalLikes >= 50)
  //     newBadges.push({
  //       name: "Audience Favorite 👍",
  //       description: "Earned 50+ likes across videos",
  //     });

  //   // Subscriber badge
  //   if (subscriberCount >= 10)
  //     newBadges.push({
  //       name: "Rising Star 🌟",
  //       description: "10+ subscribers on your channel",
  //     });


  // //   // ---------------- Q&A Badges ----------------
  // //   const userQuestions = allQuestions.filter(q => String(q.userId) === String(user.id));
  // //   const questionCount = userQuestions.length;

  // // // Badge 1: Questions Count
  // //   if (questionCount >= 5) {
  // //     newBadges.push({
  // //       name: "Curious Mind 💡",
  // //       description: "Posted 5+ questions",
  // //     });
  // //   } else if (questionCount >= 1) {
  // //     newBadges.push({
  // //       name: "Inquisitive 🧐",
  // //       description: `Posted ${questionCount} question(s)`,
  // //     });
  // //   }

  // // // Badge 2: Keyword match with video descriptions
  // //   if (allVideos && allVideos.length > 0) {
  // //     const keywordMatched = userQuestions.some(q =>
  // //       allVideos.some(video => {
  // //         if (!video?.description) return false;

  // //         const descriptionWords = video.description
  // //           .toLowerCase()
  // //           .match(/\b\w{2,}\b/g) || [];

  // //         return descriptionWords.some(word =>
  // //           q.text.toLowerCase().includes(word)
  // //         );
  // //       })
  // //     );

  // //     if (keywordMatched) {
  // //       newBadges.push({
  // //         name: "Description Matcher 📝",
  // //         description: "Posted a question matching video description keywords",
  // //       });
  // //     }
  // //   }
  //   const userQuestions = allQuestions.filter(q => String(q.userId) === String(user.id));

  //   const questionCount = userQuestions.length;
  //   if (questionCount >= 5) newBadges.push({ name: "Curious Mind 💡", description: "Posted 5+ questions" });
  //   else if (questionCount >= 1) newBadges.push({ name: "Inquisitive 🧐", description: `Posted ${questionCount} question(s)` });

  //   const keywordMatched = allVideos.some(video =>
  //     userQuestions.some(q =>
  //       video.description?.toLowerCase().split(/\W+/).some(word =>
  //         q.text.toLowerCase().includes(word)
  //       )
  //     )
  //   );

  //   if (keywordMatched) newBadges.push({ name: "Description Matcher 📝", description: "Posted a question matching video description keywords" });

  //   if (!newBadges.length) newBadges.push({ name: "Newcomer 🐣", description: "Keep engaging to earn badges!" });
  //   console.log("User Questions Count:", userQuestions.length);
  //   console.log("User Questions:", userQuestions);

  //   // No badge yet
  //   if (newBadges.length === 0)
  //     newBadges.push({
  //       name: "Newcomer 🐣",
  //       description: "Keep engaging to earn badges!",
  //     });

    // setBadges(newBadges);
  // };

  // ---------------- Ask Question per Video ----------------
  const handleAskQuestionForVideo = async (videoId) => {
    const text = questionText[videoId];
    if (!text?.trim()) return alert("Enter a question");
    if (!token) return alert("You must be logged in");

    setLoadingQ(true);
    try {
      await askQuestion(videoId, text, 0, token);
      setQuestionText((prev) => ({ ...prev, [videoId]: "" }));
      await fetchProfileData();
    } catch (err) {
      console.error("Failed to ask question:", err);
      alert(err.message);
    } finally {
      setLoadingQ(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // ---------------- Upload / Edit / Delete ----------------
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a video file");
    if (!token) return alert("You must be logged in");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("description", description);
      // formData.append("privacy", privacy.videoVisibility);
      formData.append("privacy", privacy.videoVisibility);

      await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchProfileData();
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (video) => {
    setEditingVideo(video.id);
    setTitle(video.title);
    setDescription(video.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in");

    try {
      await axios.put(
        `http://localhost:5000/api/videos/${editingVideo}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchProfileData();
      setEditingVideo(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    if (!token) return alert("You must be logged in");

    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProfileData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ---------------- Reactions & Comments ----------------
  const handleReaction = async (videoId, type) => {
    if (!token) return alert("You must be logged in");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/react`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedReaction = res.data;
      setVideos((prev) =>
        prev.map((v) => {
          if (v.id !== videoId) return v;
          let likes = v.likes || 0;
          let dislikes = v.dislikes || 0;
          const prevReaction = v.VideoReactions?.find(
            (r) => r.userId === updatedReaction.userId
          );
          if (prevReaction) {
            if (prevReaction.type === "like") likes -= 1;
            if (prevReaction.type === "dislike") dislikes -= 1;
          }
          if (updatedReaction.type === "like") likes += 1;
          if (updatedReaction.type === "dislike") dislikes += 1;

          const newReactions =
            v.VideoReactions?.filter((r) => r.userId !== updatedReaction.userId) || [];
          newReactions.push(updatedReaction);
          return { ...v, likes, dislikes, VideoReactions: newReactions };
        })
      );
    } catch (err) {
      console.error("Failed to react:", err);
      alert("Failed to react on video");
    }
  };

  const handleComment = async (videoId) => {
    const text = commentText[videoId];
    if (!text?.trim()) return;
    if (!token) return alert("You must be logged in");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? { ...v, VideoComments: [...(v.VideoComments || []), res.data] }
            : v
        )
      );
      setCommentText((prev) => ({ ...prev, [videoId]: "" }));
    } catch (err) {
      console.error("Failed to comment:", err);
      alert("Failed to add comment");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto pt-20">
      {/* User Info */}
      {user && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 text-center hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-700 mt-2">
            Subscribers: <span className="font-semibold">{user.subscriberCount || 0}</span>
          </p>
          <p>Points: {userBadges.points}</p>
          {/* <ProfilePage profileUser={user} /> */}
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate(`/messages/${user.id}`)}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition transform hover:scale-105"
            >
              Message
            </button>
          </div>
          

          {/* 🏅 Badge Section
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-400 rounded-xl px-4 py-2 text-center shadow-md hover:shadow-lg transition"
              >
                <p className="font-semibold text-yellow-800">{badge.name}</p>
                <p className="text-xs text-yellow-700">{badge.description}</p>
              </div>
            ))}
          </div> */}
          {/* 🏅 Badge Section with Enhanced Effects */}
          <div className="mt-4 flex flex-wrap justify-center gap-6">
            {/* {badges.map((badge, index) => ( */}
            {userBadges.badges.map((badge, index) => (
              
              <div
                key={index}
                className="
                relative
                bg-gradient-to-r from-yellow-100 to-yellow-200
                border border-yellow-400
                rounded-2xl
                px-6 py-4
                text-center
                shadow-lg
                transform
                transition-all duration-300
                hover:scale-110
                hover:rotate-3
                hover:shadow-2xl
                cursor-pointer
                before:absolute before:inset-0 before:rounded-2xl before:bg-yellow-300 before:opacity-20 before:blur-xl before:scale-90 before:transition-all before:duration-500 hover:before:scale-110
              "
              >
                <p className="font-bold text-yellow-800 text-lg animate-pulse">{badge.name}</p>
                <p className="text-xs text-yellow-700 mt-1">{badge.description}</p>
                {/* <p>Points: {userBadges.points}</p> */}
                {/* Display points per batch */}
                {/* Uploads */}
                {badge.name.includes("Creator") && (
                  <p>Points: {userBadges.batchPoints.uploads.points}</p>
                )}

                {/* Likes */}
                {badge.name.includes("Audience") && (
                  <p>
                    Likes: {userBadges.batchPoints.likes.count} | Points: {userBadges.batchPoints.likes.points}
                  </p>
                )}

                {/* Subscribers */}
                {(badge.name.includes("Influencer") || badge.name.includes("Popular") || badge.name.includes("Rising")) && (
                  <p>Points: {userBadges.batchPoints.subscribers.points}</p>
                )}

                {/* Questions */}
                {(badge.name.includes("Curious") || badge.name.includes("Inquisitive") || badge.name.includes("Expert")) && (
                  <p>Points: {userBadges.batchPoints.questions.points}</p>
                )}

                {/* Keyword Match */}
                {badge.name.includes("Matcher") && (
                  <p>Points: {userBadges.batchPoints.keywordMatch.points}</p>
                )}


                {/* Sparkle Animation */}
                <span className="absolute top-1 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                <span className="absolute bottom-1 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-200"></span>
              </div>
            ))}
          </div>


        </div>
      )}
      {/* Privacy Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Privacy Settings 🔒</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await axios.put(
                "http://localhost:5000/api/privacy/update",
                privacy,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              alert("Privacy settings updated!");
            } catch (err) {
              console.error(err);
              alert("Failed to update privacy settings");
            }
          }}
          className="space-y-4"
        >
          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Who can view your videos?
            </label>
            <select
              value={privacy.videoVisibility}
              onChange={(e) =>
                setPrivacy((prev) => ({ ...prev, videoVisibility: e.target.value }))
              }
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="public">Public</option>
              <option value="subscribers">Subscribers only</option>
              <option value="private">Only me</option>
            </select>
          </div>

          {/* Messaging */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Who can message you?
            </label>
            <select
              value={privacy.allowMessages}
              onChange={(e) =>
                setPrivacy((prev) => ({ ...prev, allowMessages: e.target.value }))
              }
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="everyone">Everyone</option>
              <option value="subscribers">Subscribers only</option>
              <option value="none">No one</option>
            </select>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={privacy.showBadges}
              onChange={(e) =>
                setPrivacy((prev) => ({ ...prev, showBadges: e.target.checked }))
              }
            />
            <label className="text-sm text-gray-700">
              Show my badges publicly
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>


      {/* Upload / Edit Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 hover:shadow-xl transition duration-300 text-center">
        <h3 className="font-semibold mb-4 text-lg">
          {editingVideo ? "Edit Video" : "Upload a Video"}
        </h3>
        <form
          onSubmit={editingVideo ? handleUpdate : handleUpload}
          className="space-y-3"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {!editingVideo && (
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
              required
            />
          )}
          <div className="flex justify-center gap-3 mt-2">
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {editingVideo
                ? "Update Video"
                : uploading
                ? "Uploading..."
                : "Upload Video"}
            </button>
            {editingVideo && (
              <button
                type="button"
                onClick={() => {
                  setEditingVideo(null);
                  setTitle("");
                  setDescription("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Videos */}
      <h3 className="text-2xl font-semibold mb-4">My Uploaded Videos</h3>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div className="aspect-video bg-black flex items-center justify-center group">
              {/* <video
                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                controls
                preload="metadata"
              >
                <source
                  src={`http://localhost:5000/uploads/${video.filename}`}
                  type="video/mp4"
                />
              </video> */}
              <video
                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                controls
                preload="metadata"
              >
                <source
                  src={video.videoUrl ? video.videoUrl : `http://localhost:5000/uploads/${video.filename}`}
                  type="video/mp4"
                />
              </video>

            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">
                {video.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-500">
                {video.description || "No description"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Views: {video.views || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Likes: {video.likes || 0} | Dislikes: {video.dislikes || 0}
              </p>

              {/* Reactions */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleReaction(video.id, "like")}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                >
                  Like
                </button>
                <button
                  onClick={() => handleReaction(video.id, "dislike")}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  Dislike
                </button>
                <button
                  onClick={() => startEdit(video)}
                  className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="bg-red-800 text-white px-2 py-1 rounded hover:bg-red-900 transition"
                >
                  Delete
                </button>
              </div>

              {/* Comments */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[video.id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [video.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleComment(video.id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                >
                  Comment
                </button>

                {video.VideoComments?.length > 0 && (
                  <div className="mt-2 max-h-12 overflow-y-auto border-t pt-2">
                    {video.VideoComments.slice()
                      .reverse()
                      .map((c) => (
                        <p key={c.id} className="text-sm text-gray-600 mb-1">
                          <strong>{c.user?.name || "Anonymous"}:</strong>{" "}
                          {c.text}{" "}
                          <span className="text-xs text-gray-400">
                            ({dayjs(c.createdAt).format(
                              "DD MMM YYYY, hh:mm A"
                            )})
                          </span>
                        </p>
                      ))}
                  </div>
                )}
              </div>

              {/* Per-video Q&A */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Ask a question about this video..."
                  value={questionText[video.id] || ""}
                  onChange={(e) =>
                    setQuestionText((prev) => ({
                      ...prev,
                      [video.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => handleAskQuestionForVideo(video.id)}
                  className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition"
                >
                  Ask Question
                </button>

                {video.VideoQuestions?.length > 0 && (
                  <div className="mt-2 max-h-12 overflow-y-auto border-t pt-2">
                    {video.VideoQuestions.map((q) => (
                      <p key={q.id} className="text-sm text-gray-600 mb-1">
                        <strong>{q.User?.name || "Anonymous"}:</strong> {q.text}{" "}
                        <span className="text-xs text-gray-400">
                          ({dayjs(q.createdAt).format(
                            "DD MMM YYYY, hh:mm A"
                          )})
                        </span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Q&A Section */}
      <div className="mt-8 bg-white p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2">All Questions (Global)</h3>

        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="text-blue-600 underline mb-2"
        >
          {showQuestions ? "Hide Questions" : "View Questions"}
        </button>

        {showQuestions && questions.length > 0 && (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {questions.map((q) => (
              <li
                key={q.id}
                className="border p-2 rounded bg-gray-50 shadow-sm"
              >
                <p className="text-gray-800">
                  <strong>{q.asker?.name || "Anonymous"}:</strong> {q.text}
                
                  <br />
                  <em>
                    At {formatTime(q.timestamp)} •{" "}
                    <span className="text-xs text-gray-400">
                      ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")})
                    </span>
                  </em>
                </p>
                <p className="text-sm text-gray-500">
                  {/* <strong>{q.User?.name || "Anonymous"}:</strong> {q.text} <br /> */}
                  {/* <em>
                    At {formatTime(q.timestamp)} •{" "}
                    <span className="text-xs text-gray-400">
                      {dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")}
                    </span>
                  </em> */}
                  <em>Video: {q.videoTitle || "Unknown"}</em>{" "}
                  <span className="text-xs text-gray-400">
                    {/* ({dayjs(q.createdAt).format("DD MMM YYYY, hh:mm A")}) */}
                  </span>
                  
                </p>
              </li>
            ))}
          </ul>
        )}
        {showQuestions && questions.length === 0 && <p>No questions yet.</p>}
      </div>
    </div>
  );
}
// Utility to format seconds into mm:ss
function formatTime(seconds) {
  if (!seconds && seconds !== 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// At the end of Profile.jsx
export default Profile;