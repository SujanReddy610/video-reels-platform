// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./ReelCard.css";


// export default function ReelCard({ video }) {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/video/${video.id}`);
//   };

//   return (
//     // <div
//     //   onClick={handleClick}
//     //   className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-200"
//     // >
//     <div
//       onClick={handleClick}
//       className="reel-card"
//       style={{
//         cursor: "pointer",
//         width: "200px", // 👈 Half of regular video card width (~360px)
//         borderRadius: "10px",
//         overflow: "hidden",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         backgroundColor: "#fff",
//         transition: "transform 0.2s ease",
//       }}
//     >
//       <video
//         src={`http://localhost:5000/uploads/${video.filename}`}
//         width="100%"
//         height="180"
//         style={{
//           objectFit: "cover",
//           height: "300px", // Smaller height for Reels
//           width: "100%",
//         }}
//       />
//       <div className="p-2">
//         <h3 className="font-semibold text-gray-800 text-sm truncate">
//           {video.title}
//         </h3>
//         <p className="text-xs text-gray-500">
//           👁 {video.views} | 👍 {video.likes}
//         </p>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function ReelCard({ video }) {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/video/${video.id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="reel-card"
//       style={{
//         cursor: "pointer",
//         width: "180px",
//         borderRadius: "10px",
//         overflow: "hidden",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         backgroundColor: "#fff",
//         transition: "transform 0.2s ease",
//         margin: "0",           // 👈 remove external spacing
//         padding: "0",          // 👈 remove internal spacing
//       }}
//     >
//       <video
//         src={`http://localhost:5000/uploads/${video.filename}`}
//         style={{
//           width: "100%",
//           height: "300px",
//           objectFit: "cover",
//           borderRadius: "10px",
//         }}
//         muted
//         loop
//         autoPlay
//       />
//       <div style={{ padding: "4px", textAlign: "center" }}>
//         <h3
//           style={{
//             fontWeight: "bold",
//             fontSize: "0.85rem",
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {video.title}
//         </h3>
//       </div>
//     </div>
//   );
// }












































// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Volume2, VolumeX } from "lucide-react";

// export default function ReelCard({ video }) {
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);

//   // const [isMobile, setIsMobile] = useState(false);

//   const handleClick = () => {
//     navigate(`/video/${video.id}`);
//   };

//    // Detect mobile devices
//   // useEffect(() => {
//   //   setIsMobile(window.innerWidth < 768);
//   // }, []);

//   // Set video to 2nd frame (approx 0.5s–1s) once loaded
//   useEffect(() => {
//     const vid = videoRef.current;
//     if (!vid) return;

//     const handleLoaded = () => {
//       vid.currentTime = 0.5; // Adjust between 0.5 to 1 for best frame
//     };

//     vid.addEventListener("loadeddata", handleLoaded);
//     return () => vid.removeEventListener("loadeddata", handleLoaded);
//   }, []);

//   // Handle hover play/pause
//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     if (videoRef.current) videoRef.current.play();
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0.5; // Go back to 2nd frame
//     }
//   };

//   // Toggle mute/unmute
//   const toggleMute = (e) => {
//     e.stopPropagation(); // Prevent navigation
//     setIsMuted((prev) => !prev);
//     if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
//   };

//   return (
//     <div
//       onClick={handleClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className="relative cursor-pointer"
//       style={{
//         width: "220px",
//         borderRadius: "10px",
//         overflow: "hidden",
//         backgroundColor: "#fff",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//         transition: "transform 0.3s ease",
//       }}
//     >
//       <video
//         ref={videoRef}
//         src={`http://localhost:5000/uploads/${video.filename}`}
//         muted={isMuted}
//         loop
//         playsInline
//         preload="metadata"
//         style={{
//           width: "100%",
//           height: "400px",
//           objectFit: "cover",
//           borderRadius: "10px",
//           backgroundColor: "#000", // fallback background
//         }}
//       />

//       {/* Title */}
//       <div
//         style={{
//           padding: "4px",
//           textAlign: "center",
//           background: "rgba(255, 255, 255, 0.8)",
//         }}
//       >
//         <h3
//           style={{
//             fontWeight: "bold",
//             fontSize: "0.85rem",
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {video.title}
//         </h3>
//       </div>

//       {/* Volume Icon on Hover */}
//       {isHovered && (
//         <button
//           onClick={toggleMute}
//           className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
//         >
//           {isMuted ? (
//             <VolumeX size={20} color="white" />
//           ) : (
//             <Volume2 size={20} color="white" />
//           )}
//         </button>
//       )}
//     </div>
//   );
// }

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

export default function ReelCard({ video }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // ✅ Default muted

  const previewTime = 0.5;
  const isLocal = !video.videoUrl;

  const getCloudinaryPoster = (url) => {
    if (!url) return "";
    return url.replace("/upload/", `/upload/so_${previewTime}/`).replace(/\.\w+$/, ".jpg");
  };

  const poster = video.videoUrl
    ? getCloudinaryPoster(video.videoUrl)
    : video.thumbnail_path || "/fallback.png";

  const videoSrc = video.videoUrl || `http://localhost:5000/uploads/${video.filename}`;
  const fallbackThumbnail = "/fallback.png";

  // Hover: play video
  const handleMouseEnter = () => {
    setIsHovered(true);
    const vid = videoRef.current;
    if (vid) {
      vid.muted = isMuted; // muted by default for autoplay
      vid.play().catch(() => {}); // play on hover
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      if (isLocal) vid.currentTime = previewTime;
    }
  };

  // Toggle mute/unmute
  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const vid = videoRef.current;
      if (vid) vid.muted = !prev; // update video immediately
      return !prev;
    });

    // Ensure video plays if muted -> unmuted (browsers allow play only if muted first)
    const vid = videoRef.current;
    if (vid && vid.paused) vid.play().catch(() => {});
  };

  const handleClick = () => navigate("/reels");

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer rounded-lg overflow-hidden shadow-md w-full max-w-[400px] mb-6 bg-black"
      style={{ height: "500px" }}
    >
      {/* Poster / Thumbnail */}
      {!isHovered && (
        <img
          src={poster}
          alt={video.title}
          onError={(e) => (e.target.src = fallbackThumbnail)}
          className="w-full h-[390px] object-cover"
        />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        width="100%"
        height="400"
        muted={isMuted}
        loop
        playsInline
        className={`object-cover w-full ${isHovered ? "block" : "hidden"}`}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mute/unmute button */}
      {isHovered && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
        >
          {isMuted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
        </button>
      )}

      {/* Video info */}
      <div className="p-3 text-white">
        <h3 className="font-bold mb-1">{video.title}</h3>
        <h3 className="font-bold text-sm mb-1 truncate">{video.title}</h3>
        <p className="text-xs text-gray-300 truncate">
          Uploaded by: {video.User?.name || video.user?.name || "Unknown"}
        </p>

        <p className="text-xs text-gray-300 mt-1"></p>
        <p className="text-sm text-gray-300">
          👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
        </p>
      </div>
    </div>
  );
}

