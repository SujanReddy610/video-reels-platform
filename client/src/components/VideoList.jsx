







// import React, { useState, useEffect } from "react";
// import VideoCard from "./VideoCard";

// export default function VideoList({ videos, setVideos, setCurrentPage, handleLogout}) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [category, setCategory] = useState("");
//   const [filteredVideos, setFilteredVideos] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true); // open by default for PC

//   useEffect(() => {
//     setFilteredVideos(videos || []);
//   }, [videos]);

//   // ---------------- Search ----------------
//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;
//     const filtered = videos.filter((v) =>
//       v.title?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredVideos(filtered.length > 0 ? filtered : []);
//   };

//   // ---------------- Filters ----------------
//   const fetchTrending = () => {
//     const trending = [...videos].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//     setFilteredVideos(trending.length > 0 ? trending : []);
//   };

//   const fetchShorts = () => {
//     const shorts = videos.filter(
//       (v) => v.duration && Number(v.duration) < 600
//     );
//     setFilteredVideos(shorts.length > 0 ? shorts : []);
//   };

//   const fetchLongs = () => {
//     const longs = videos.filter(
//       (v) => v.duration && Number(v.duration) > 600
//     );
//     setFilteredVideos(longs.length > 0 ? longs : []);
//   };

//   const fetchByCategory = () => {
//     if (!category.trim()) return;
//     const filtered = videos.filter(
//       (v) =>
//         v.category &&
//         v.category.toLowerCase().includes(category.toLowerCase())
//     );
//     setFilteredVideos(filtered.length > 0 ? filtered : []);
//   };

//   const resetVideos = () => {
//     setFilteredVideos(videos);
//     setSearchQuery("");
//     setCategory("");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Hamburger button - always visible */}
//       <button
//         className="fixed top-1% left-4 z-50 text-3xl p-2 rounded bg-orange"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         &#9776;
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-10% left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-bold ml-14">Menu</h2>
//           <button
//             className="text-white-700 text-2xl"
//             onClick={() => setSidebarOpen(false)}
//           >
//             &times;
//           </button>
//         </div>
//         <nav className="flex flex-col p-4 space-y-4">
//           <button
//             onClick={resetVideos}
//             className="text-left px-3 py-2 rounded hover:bg-blue-100 transition"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => setCurrentPage("profile")}
//             className="text-left px-3 py-2 rounded hover:bg-green-100 transition"
//           >
//             Profile
//           </button>
//           <button
//             onClick={fetchShorts}
//             className="text-left px-3 py-2 rounded hover:bg-green-100 transition"
//           >
//             Shorts
//           </button>
//           <button
//             onClick={fetchTrending}
//             className="text-left px-3 py-2 rounded hover:bg-purple-100 transition"
//           >
//             Trending
//           </button>
//           <button
//             onClick={fetchLongs}
//             className="text-left px-3 py-2 rounded hover:bg-red-100 transition"
//           >
//             Long
//           </button>
//           <button
//             onClick={handleLogout}
//             className="text-left px-3 py-2 rounded hover:bg-red-100 transition"
//           >
//             Logout
//           </button>
//         </nav>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}

//       {/* Main content */}
//       <div
//         className={`flex-1 p-6 transition-all duration-300 ${
//           sidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         {/* Search */}
//         <div className="mr-30 flex flex-wrap gap-3 mb-6 items-center" style={{ marginLeft: "10%" }}>
//           <input
//             type="text"
//             placeholder="Search videos..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="p-2 border border-gray-300 rounded-lg w-[40rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//           />
//           <button
//             onClick={handleSearch}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
//           >
//             Search
//           </button>
//         </div>

//         {/* Video Feed */}
//         {filteredVideos.length === 0 ? (
//           <p className="text-center mt-10 text-gray-500 text-lg">
//             No videos found
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {filteredVideos.map((video) => (
//               <VideoCard key={video.id} video={video} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









// to display shorts in saperate row

// import React, { useState, useEffect } from "react";
// import VideoCard from "../components/VideoCard";
// import ReelCard from "../components/ReelCard";
// import { Link } from "react-router-dom";
// import { PlaySquare } from 'lucide-react'; // optional icon
// {/* <Link
//   to="/reels"
//   className="text-left px-3 py-2 rounded hover:bg-yellow-100 transition"
// >
//   Reels
// </Link> */}


// export default function VideoList({ videos, setVideos, setCurrentPage, handleLogout }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [category, setCategory] = useState("");
//   const [filteredVideos, setFilteredVideos] = useState([]);
//   const [shortVideos, setShortVideos] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // ✅ Separate short videos (<2min) from regular ones
//   useEffect(() => {
//     if (videos && videos.length > 0) {
//       const shorts = videos.filter(v => v.duration && Number(v.duration) < 120);
//       const regular = videos.filter(v => v.duration && Number(v.duration) >= 120);

//       setShortVideos(shorts);
//       setFilteredVideos(regular); // show only regular videos in "All Videos"
//     }
//   }, [videos]);

//   // ---------------- Search ----------------
//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;
//     const filtered = videos.filter(v =>
//       v.title?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredVideos(filtered.length > 0 ? filtered : []);
//   };

//   // ---------------- Filters ----------------
//   const fetchTrending = () => {
//     const trending = [...videos].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//     setFilteredVideos(trending.length > 0 ? trending : []);
//   };

//   const fetchShorts = () => {
//     const shorts = videos.filter(v => v.duration && Number(v.duration) < 120);
//     setFilteredVideos(shorts.length > 0 ? shorts : []);
//   };

//   const fetchLongs = () => {
//     const longs = videos.filter(v => v.duration && Number(v.duration) >= 120);
//     setFilteredVideos(longs.length > 0 ? longs : []);
//   };

//   const fetchByCategory = () => {
//     if (!category.trim()) return;
//     const filtered = videos.filter(
//       v => v.category && v.category.toLowerCase().includes(category.toLowerCase())
//     );
//     setFilteredVideos(filtered.length > 0 ? filtered : []);
//   };

//   const resetVideos = () => {
//     const regular = videos.filter(v => v.duration && Number(v.duration) >= 120);
//     setFilteredVideos(regular);
//     setSearchQuery("");
//     setCategory("");
//   };

//   // ---------------- UI ----------------
//   return (
//     <div className="pt-20 flex min-h-screen bg-gray-50 right-20">
//       {/* Hamburger button */}
//       <button
//         className="fixed top-35 left-4 z-50 text-3xl p-2 rounded bg-orange-500 text-white shadow-md"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         &#9776;
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-25 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between p-4 border-b bg-gray-100">
//           <h2 className="text-xl font-bold ml-14 bg-gray-100">Menu</h2>
//           <button
//             className="text-gray-700 text-2xl"
//             onClick={() => setSidebarOpen(false)}
//           >
//             &times;
//           </button>
//         </div>
//         <nav className="flex flex-col p-4 space-y-4">
//           <button
//             onClick={resetVideos}
//             className="text-left px-3 py-2 rounded hover:bg-blue-100 transition"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => setCurrentPage("profile")}
//             className="text-left px-3 py-2 rounded hover:bg-green-100 transition"
//           >
//             Profile
//           </button>
//           {/* <button
//             onClick={fetchShorts}
//             className="text-left px-3 py-2 rounded hover:bg-yellow-100 transition"
//           >
//             Reels
//           </button> */}
//           <Link
//             to="/reels"
//             className="text-left px-3 py-2 rounded hover:bg-yellow-100 transition"
//           >
//             Reels
//           </Link>

//           <button
//             onClick={fetchTrending}
//             className="text-left px-3 py-2 rounded hover:bg-purple-100 transition"
//           >
//             Trending
//           </button>
//           <button
//             onClick={fetchLongs}
//             className="text-left px-3 py-2 rounded hover:bg-red-100 transition"
//           >
//             Long
//           </button>
//           <button
//             onClick={handleLogout}
//             className="text-left px-3 py-2 rounded hover:bg-red-200 transition"
//           >
//             Logout
//           </button>
//         </nav>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}

//       {/* Main content */}
//       <div
//         className={`flex-1 p-6 flex flex-col items-center transition-all duration-300 ${
//           sidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         {/* Search Bar */}
//         <div
//           className="flex flex-wrap gap-3 mb-6  justify-start pl-12"
//           style={{ marginLeft: "-19%" }}
//         >
//         {/* <div
//           className="flex flex-wrap gap-3 mb-6 items-center justify-start -ml-15"
//         > */}
//           <input
//             type="text"
//             placeholder="Search videos..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="p-2 border border-gray-300 rounded-lg w-[40rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//           />
//           <button
//             onClick={handleSearch}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
//           >
//             Search
//           </button>
//         </div>

//         {/* Reels Section */}
//         {/* {shortVideos.length > 0 && (
//           <section className="mb-10 -ml-40">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">🎥 Reels</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-9 justify-center"
//             style={{ marginLeft: "-15%" }}
//             >

//               {shortVideos.map((video) => (
//                 <ReelCard key={video.id} video={video} />
//               ))}
//             </div>
//           </section>
//         )} */}
//         {/* Reels Section */}
//         {shortVideos.length > 0 && (
//           <section className="-ml-2 mb-10">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">🎥 Reels</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
//               {shortVideos.map((video) => (
//                 <ReelCard key={video.id} video={video} />
//               ))}
//             </div>
//           </section>
//         )}



//         {/* Regular Videos Section */}
//         <section className="-ml-2">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">All Videos</h2>
//           {filteredVideos.length === 0 ? (
//             <p className="text-center mt-10 text-gray-500 text-lg">
//               No videos found
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//               {filteredVideos.map((video) => (
//                 <VideoCard key={video.id} video={video} />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { PlaySquare } from "lucide-react"; // optional icon

// ✅ Lazy load components for performance
const VideoCard = lazy(() => import("../components/VideoCard"));
const ReelCard = lazy(() => import("../components/ReelCard"));

export default function VideoList({ videos, setVideos, setCurrentPage, handleLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [shortVideos, setShortVideos] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ Separate short (<2min) and regular videos
  useEffect(() => {
    if (videos && videos.length > 0) {
      const shorts = videos.filter(v => v.duration && Number(v.duration) < 120);
      const regular = videos.filter(v => v.duration && Number(v.duration) >= 120);
      setShortVideos(shorts);
      setFilteredVideos(regular);
    }
  }, [videos]);

  // ✅ Search videos
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const filtered = videos.filter(v =>
      v.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered.length > 0 ? filtered : []);
  };

  // ✅ Category & filters
  const fetchTrending = () => {
    const trending = [...videos].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredVideos(trending);
  };

  const fetchShorts = () => {
    const shorts = videos.filter(v => v.duration && Number(v.duration) < 120);
    setFilteredVideos(shorts);
  };

  const fetchLongs = () => {
    const longs = videos.filter(v => v.duration && Number(v.duration) >= 120);
    setFilteredVideos(longs);
  };

  const fetchByCategory = () => {
    if (!category.trim()) return;
    const filtered = videos.filter(
      v => v.category && v.category.toLowerCase().includes(category.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  const resetVideos = () => {
    const regular = videos.filter(v => v.duration && Number(v.duration) >= 120);
    setFilteredVideos(regular);
    setSearchQuery("");
    setCategory("");
  };

  // ✅ Component UI
  return (
    <div className="pt-20 flex min-h-screen bg-gray-50">
      {/* Hamburger button */}
      <button
        className="fixed top-25 left-4 z-50 text-3xl p-2 rounded-md bg-orange-500 text-white shadow-md "
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        &#9776;
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-24 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-gray-100">
          <h2 className="text-xl font-bold ml-4">Menu</h2>
          <button
            className="text-gray-700 text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-3">
          <button
            onClick={resetVideos}
            className="text-left px-3 py-2 rounded hover:bg-blue-100 transition"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("profile")}
            className="text-left px-3 py-2 rounded hover:bg-green-100 transition"
          >
            Profile
          </button>
          <Link
            to="/reels"
            className="text-left px-3 py-2 rounded hover:bg-yellow-100 transition"
          >
            Reels
          </Link>
          <button
            onClick={fetchTrending}
            className="text-left px-3 py-2 rounded hover:bg-purple-100 transition"
          >
            Trending
          </button>
          <button
            onClick={fetchLongs}
            className="text-left px-3 py-2 rounded hover:bg-red-100 transition"
          >
            Long
          </button>
          <button
            onClick={handleLogout}
            className="text-left px-3 py-2 rounded hover:bg-red-200 transition"
          >
            Logout
          </button>
        </nav>
      </div>
      {/* Sidebar */}
      

      {/* Overlay (for mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 p-4 sm:p-6 flex flex-col items-center transition-all duration-300 ${
          sidebarOpen ? "md:ml-72" : "ml-0"
        }`}
      >
        {/* Search Bar */}
        <div className="flex flex-wrap gap-3 mb-6 w-full justify-center sm:justify-start px-4">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-[25rem] md:w-[35rem] lg:w-[40rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
          >
            Search
          </button>
        </div>

        {/* Reels Section */}
        {/* {shortVideos.length > 0 && (
          <section className="px-3 sm:px-6 mb-10 w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">🎥 Reels</h2>
            <Suspense fallback={<p className="text-center text-gray-500">Loading Reels...</p>}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {shortVideos.map((video) => (
                  <ReelCard key={video.id} video={video} />
                ))}
              </div>
            </Suspense>
          </section>
        )} */}
        {/* Reels Section */}
        {shortVideos.length > 0 && (
          <section className="px-3 sm:px-6 mb-10 w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">🎥 Reels</h2>
            <Suspense fallback={<p className="text-center text-gray-500">Loading Reels...</p>}>
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {shortVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex-shrink-0 w-[20%] min-w-[190px]" // 5 columns visible
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <ReelCard video={video} />
                  </div>
                ))}
              </div>
            </Suspense>
          </section>
        )}


        {/* Regular Videos Section */}
        <section className="px-3 sm:px-6 w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">All Videos</h2>
          {filteredVideos.length === 0 ? (
            <p className="text-center mt-10 text-gray-500 text-lg">
              No videos found
            </p>
          ) : (
            <Suspense fallback={<p className="text-center text-gray-500">Loading Videos...</p>}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </Suspense>
          )}
        </section>
      </div>
    </div>
  );
}
