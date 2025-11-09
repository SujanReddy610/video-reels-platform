
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import VideoCard from "../components/VideoCard"; // The card component for each video

// export default function Home({ token }) {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // ---------------- Fetch All Videos ----------------
//   const fetchVideos = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/videos", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Map likes/dislikes, views, and proper streaming URLs
//       const mappedVideos = data.map((video) => ({
//         ...video,
//         views: video.views ?? 0,
//         VideoReactions: video.VideoReactions || [],
//         likes: video.VideoReactions
//           ? video.VideoReactions.filter((r) => r.type === "like").length
//           : 0,
//         dislikes: video.VideoReactions
//           ? video.VideoReactions.filter((r) => r.type === "dislike").length
//           : 0,
//         videoSrc: video.filename
//           ? `http://localhost:5000/api/videos/stream/${video.filename}`
//           : video.videoUrl, // fallback if external URL
//       }));

//       setVideos(mappedVideos);
//     } catch (err) {
//       console.error("Fetch Videos Error:", err);
//       setError("Failed to load videos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [token]);

//   if (loading) return <p>Loading videos...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 className="text-3xl font-bold mb-6">Home Feed</h1>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         {videos.map((video) => (
//           <VideoCard
//             key={video.id}
//             video={video}
//             navigate={navigate}
//           />
//         ))}
//       </div>

//       {videos.length === 0 && <p>No videos available. Try uploading one!</p>}
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import VideoCard from "../components/VideoCard";

// export default function Home({ token }) {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   // ---------------- Fetch All Videos ----------------
//   const fetchVideos = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/videos", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const mappedVideos = data.map((video) => ({
//         ...video,
//         views: video.views ?? 0,
//         VideoReactions: video.VideoReactions || [],
//         likes: video.VideoReactions
//           ? video.VideoReactions.filter((r) => r.type === "like").length
//           : 0,
//         dislikes: video.VideoReactions
//           ? video.VideoReactions.filter((r) => r.type === "dislike").length
//           : 0,
//         videoSrc: video.filename
//           ? `http://localhost:5000/api/videos/stream/${video.filename}`
//           : video.videoUrl,
//       }));

//       setVideos(mappedVideos);
//     } catch (err) {
//       console.error("Fetch Videos Error:", err);
//       setError("Failed to load videos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Search Videos ----------------
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return fetchVideos(); // show all if empty

//     setLoading(true);
//     setError(null);

//     try {
//       const { data } = await axios.get(
//         `http://localhost:5000/api/videos/search?q=${encodeURIComponent(
//           searchQuery
//         )}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const mappedVideos = data.map((video) => ({
//         ...video,
//         views: video.views ?? 0,
//         VideoReactions: video.VideoReactions || [],
//         likes: video.VideoReactions
//           ? video.VideoReactions.filter((r) => r.type === "like").length
//           : 0,
//         dislikes: video.VideoReactions
//           ? video.VideoReactions.filter((r) => r.type === "dislike").length
//           : 0,
//         videoSrc: video.filename
//           ? `http://localhost:5000/api/videos/stream/${video.filename}`
//           : video.videoUrl,
//       }));

//       setVideos(mappedVideos);
//     } catch (err) {
//       console.error("Search failed", err);
//       setError("Search failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [token]);

//   if (loading) return <p>Loading videos...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 className="text-3xl font-bold mb-6">Home Feed</h1>

//       {/* Search Bar */}
//       <div className="flex mb-6 gap-2">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search videos..."
//           className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Search
//         </button>
//       </div>

//       {/* Video Grid */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         {videos.map((video) => (
//           <VideoCard key={video.id} video={video} navigate={navigate} />
//         ))}
//       </div>

//       {videos.length === 0 && <p>No videos found.</p>}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import VideoCard from "../components/VideoCard";

// export default function Home({ token }) {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   // ---------------- Fetch All Videos ----------------
//   const fetchVideos = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/videos", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setVideos(mapVideos(data));
//     } catch (err) {
//       console.error("Fetch Videos Error:", err);
//       setError("Failed to load videos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Search Videos ----------------
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return fetchVideos(); // Show all if empty

//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await axios.get(
//         `http://localhost:5000/api/videos/search?q=${encodeURIComponent(searchQuery)}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setVideos(mapVideos(data));
//     } catch (err) {
//       console.error("Search failed", err);
//       setError("Search failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Map Video Data ----------------
//   const mapVideos = (data) =>
//     data.map((video) => ({
//       ...video,
//       views: video.views ?? 0,
//       VideoReactions: video.VideoReactions || [],
//       likes: video.VideoReactions
//         ? video.VideoReactions.filter((r) => r.type === "like").length
//         : 0,
//       dislikes: video.VideoReactions
//         ? video.VideoReactions.filter((r) => r.type === "dislike").length
//         : 0,
//       videoSrc: video.filename
//         ? `http://localhost:5000/api/videos/stream/${video.filename}`
//         : video.videoUrl,
//     }));

//   // ---------------- Fetch videos on load ----------------
//   useEffect(() => {
//     fetchVideos();
//   }, [token]);

//   if (loading) return <p>Loading videos...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 className="text-3xl font-bold mb-6">Home Feed</h1>

//       {/* ---------------- Search Bar ---------------- */}
//       <div className="flex mb-6 gap-2">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search videos..."
//           className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Search
//         </button>
//       </div>

//       {/* ---------------- Video Grid ---------------- */}
//       {videos.length > 0 ? (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {videos.map((video) => (
//             <VideoCard key={video.id} video={video} navigate={navigate} />
//           ))}
//         </div>
//       ) : (
//         <p>No videos found.</p>
//       )}
//     </div>
//   );
// }


// video privacy setting
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";

export default function Home({ token }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ---------------- Fetch All Videos ----------------
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("http://localhost:5000/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Filter only public or network videos
      const visibleVideos = data.filter(
        (v) => v.privacy === "public" || v.privacy === "network"
      );

      setVideos(mapVideos(visibleVideos));
    } catch (err) {
      console.error("Fetch Videos Error:", err);
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Search Videos ----------------
  const handleSearch = async () => {
    if (!searchQuery.trim()) return fetchVideos(); // Show all if empty

    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/videos/search?q=${encodeURIComponent(
          searchQuery
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Filter search results by privacy visibility
      const visibleResults = data.filter(
        (v) => v.privacy === "public" || v.privacy === "network"
      );

      setVideos(mapVideos(visibleResults));
    } catch (err) {
      console.error("Search failed", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Map Video Data ----------------
  const mapVideos = (data) =>
    data.map((video) => ({
      ...video,
      views: video.views ?? 0,
      VideoReactions: video.VideoReactions || [],
      likes: video.VideoReactions
        ? video.VideoReactions.filter((r) => r.type === "like").length
        : 0,
      dislikes: video.VideoReactions
        ? video.VideoReactions.filter((r) => r.type === "dislike").length
        : 0,
      videoSrc: video.filename
        ? `http://localhost:5000/api/videos/stream/${video.filename}`
        : video.videoUrl,
    }));

  // ---------------- Fetch videos on load ----------------
  useEffect(() => {
    fetchVideos();
  }, [token]);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-8 animate-pulse">
        Loading videos...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-8 font-medium">{error}</p>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-bold mb-6">Home Feed</h1>

      {/* ---------------- Search Bar ---------------- */}
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos..."
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* ---------------- Video Grid ---------------- */}
      {videos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} navigate={navigate} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No videos found.</p>
      )}
    </div>
  );
}
