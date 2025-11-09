// // code for youtube

// // src/components/VideoCard.jsx
// // src/components/VideoCard.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function VideoCard({ video }) {
//   const navigate = useNavigate(); // get navigate from react-router

//   const handleClick = () => {
//     navigate(`/video/${video.id}`); // navigate to video details page
//   };

//   return (
//     <div
//       onClick={handleClick}
//       style={{
//         cursor: "pointer",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         marginBottom: "16px",
//         backgroundColor: "#fff",
//       }}
//     >
//       <video
//         src={`http://localhost:5000/uploads/${video.filename}`}
//         width="100%"
//         height="250px"
//         style={{ objectFit: "cover" }}
//       />
//       <div style={{ padding: "4px" }}>
//         <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>
//           {video.title}
//         </h3>
//         <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
//           👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
//         </p>
//       </div>
//     </div>
//   );
// }






// display shorts in saperate row
// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function VideoCard({ video }) {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/video/${video.id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       style={{
//         cursor: "pointer",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         marginBottom: "16px",
//         backgroundColor: "#fff",
//       }}
//     >
//       <video
//         src={`http://localhost:5000/uploads/${video.filename}`}
//         width="100%"
//         height="250"
//         style={{ objectFit: "cover" }}
//       />
//       <div style={{ padding: "4px" }}>
//         <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>
//           {video.title}
//         </h3>
//         <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
//           👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
//         </p>
//       </div>
//     </div>
//   );
// }









// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Volume2, VolumeX } from "lucide-react";

// export default function VideoCard({ video }) {
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [isMuted, setIsMuted] = useState(true);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [previewTime] = useState(0.5); // 🖼️ Default preview frame (0.5 seconds)

//   const handleClick = () => {
//     navigate(`/video/${video.id}`);
//   };

//   // ✅ Show the preview frame (instead of black screen)
//   // useEffect(() => {
//   //   const vid = videoRef.current;
//   //   if (vid) {
//   //     const onLoad = () => {
//   //       try {
//   //         vid.currentTime = previewTime;
//   //       } catch (e) {
//   //         console.warn("Could not set preview frame:", e);
//   //       }
//   //       setIsLoaded(true);
//   //     };
//   //     vid.addEventListener("loadedmetadata", onLoad);
//   //     return () => vid.removeEventListener("loadedmetadata", onLoad);
//   //   }
//   // }, [previewTime]);
//   useEffect(() => {
//     const vid = videoRef.current;
//     if (!vid) return;

//     const onLoaded = () => {
//       try {
//         vid.currentTime = previewTime; // 0.5 sec preview
//         setIsLoaded(true);
//       } catch (err) {
//         console.warn("Could not set preview frame:", err);
//       }
//     };

//     vid.addEventListener("loadedmetadata", onLoaded);
//     return () => vid.removeEventListener("loadedmetadata", onLoaded);
//   }, [previewTime]);


//   // ▶️ Play when hovered
//   const handleMouseEnter = () => {
//     const vid = videoRef.current;
//     if (vid && isLoaded) {
//       setIsHovered(true);
//       vid.muted = isMuted;
//       vid.play().catch(() => {});
//     }
//   };

//   // ⏹️ Stop when hover ends and go back to preview frame (not 0)
//   const handleMouseLeave = () => {
//     const vid = videoRef.current;
//     if (vid) {
//       setIsHovered(false);
//       vid.pause();
//       vid.currentTime = previewTime; // ⬅️ go back to preview frame, not black
//     }
//   };

//   // 🔇 Toggle mute
//   const toggleMute = (e) => {
//     e.stopPropagation();
//     const vid = videoRef.current;
//     if (vid) {
//       vid.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         cursor: "pointer",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         marginBottom: "16px",
//         backgroundColor: "#fff",
//         position: "relative",
//         width: "100%",
//         maxWidth: "500px",
//         transition: "transform 0.2s ease-in-out",
//       }}
//     >
//       <video
//         ref={videoRef}
//         // src={`http://localhost:5000/uploads/${video.filename}`}
//         // src={video.videoUrl || `http://localhost:5000/uploads/${video.filename}`} // ✅ Cloudinary first
//         width="100%"
//         height="290"
//         style={{
//           objectFit: "cover",
//           display: "block",
//           backgroundColor: "#000",
//         }}
//         preload="metadata"
//         muted={isMuted}
//       >
//         <source src={video.videoUrl || `http://localhost:5000/uploads/${video.filename}`} type="video/mp4" />

//       </video>

      


//       {/* 🔊/🔇 Mute Button (only visible on hover) */}
//       {isHovered && (
//         <div
//           onClick={toggleMute}
//           style={{
//             position: "absolute",
//             bottom: "10px",
//             right: "10px",
//             backgroundColor: "rgba(0,0,0,0.6)",
//             borderRadius: "50%",
//             padding: "6px",
//             cursor: "pointer",
//           }}
//         >
//           {isMuted ? (
//             <VolumeX color="white" size={20} />
//           ) : (
//             <Volume2 color="white" size={20} />
//           )}
//         </div>
//       )}

//       <div style={{ padding: "8px" }}>
//         <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>
//           {video.title}
//         </h3>
//         <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
//           👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
//         </p>
//       </div>
//     </div>
//   );
// }







// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Volume2, VolumeX } from "lucide-react";

// export default function VideoCard({ video }) {
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [isMuted, setIsMuted] = useState(true);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   // const previewTime = 0.5; // default preview frame 0.5s
//   const [previewTime] = useState(0.5); // 🖼️ Default preview frame (0.5 seconds)



//   const handleClick = () => {
//     navigate(`/video/${video.id}`);
//   };

//   // Generate Cloudinary preview frame if videoUrl exists
//   const getPreviewUrl = (videoUrl) => {
//     if (!videoUrl) return null;
//     return videoUrl.replace("/upload/", `/upload/so_${previewTime}/`);
//   };

//   // Set preview frame for local videos
//   useEffect(() => {
//     const vid = videoRef.current;
//     if (!vid || video.videoUrl) return; // Cloudinary uses preview img

//     const onCanPlay = () => {
//       try {
//         vid.currentTime = previewTime;
//         setIsLoaded(true);
//       } catch (err) {
//         console.warn("Could not set preview frame:", err);
//       }
//     };

//     vid.addEventListener("loadedmetadata", onCanPlay);
//     return () => vid.removeEventListener("loadedmetadata", onCanPlay);
//   }, [video.videoUrl]);
//   useEffect(() => {
//     const vid = videoRef.current;
//     if (vid) {
//       const onLoad = () => {
//         try {
//           vid.currentTime = previewTime;
//         } catch (e) {
//           console.warn("Could not set preview frame:", e);
//         }
//         setIsLoaded(true);
//       };
//       vid.addEventListener("loadedmetadata", onLoad);
//       return () => vid.removeEventListener("loadedmetadata", onLoad);
//     }
//   }, [previewTime]);

//   // ▶️ Play when hovered
//   const handleMouseEnter = () => {
//     const vid = videoRef.current;
//     if (!vid) return;

//     setIsHovered(true);

//     // For local video, wait until metadata loaded
//     if (!video.videoUrl && !isLoaded) return;

//     vid.muted = isMuted;
//     vid.play().catch(() => {});
//   };

//   // ⏹️ Stop when hover ends
//   const handleMouseLeave = () => {
//     const vid = videoRef.current;
//     if (!vid) return;

//     setIsHovered(false);
//     vid.pause();

//     // Go back to preview frame for local videos
//     if (!video.videoUrl) vid.currentTime = previewTime;
//   };

//   // 🔇 Toggle mute
//   const toggleMute = (e) => {
//     e.stopPropagation();
//     const vid = videoRef.current;
//     if (!vid) return;

//     vid.muted = !isMuted;
//     setIsMuted(!isMuted);
//   };

//   // Decide whether to use Cloudinary preview image
//   // Generate Cloudinary thumbnail
  

//   const getCloudinaryPreview = (videoUrl) => {
//     if (!videoUrl) return null;
//     // Replace the file extension with jpg and add so_0.5 for 0.5s frame
//     return videoUrl
//       .replace("/upload/", `/upload/so_0.5/`)
//       .replace(/\.\w+$/, ".jpg"); // convert mp4 -> jpg
//   };
//   const cloudinaryPreview = video.videoUrl ? getCloudinaryPreview(video.videoUrl) : null;


//   return (
//     <div
//       onClick={handleClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         cursor: "pointer",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//         marginBottom: "16px",
//         backgroundColor: "#fff",
//         position: "relative",
//         width: "100%",
//         maxWidth: "500px",
//         transition: "transform 0.2s ease-in-out",
//       }}
//     >
//       {/* Cloudinary preview frame */}
//       {cloudinaryPreview && !isHovered && (
//         <img
//           src={cloudinaryPreview}
//           alt={video.title}
//           style={{
//             width: "100%",
//             height: "220px",
//             objectFit: "cover",
//             display: "block",
//             backgroundColor: "#000",
//           }}
//         />
//       )}

//       {/* Video element */}
//       <video
//         ref={videoRef}
//         width="100%"
//         height="290"
//         style={{
//           objectFit: "cover",
//           display: isHovered || !cloudinaryPreview ? "block" : "none",
//           backgroundColor: "#000",
//         }}
//         preload={video.videoUrl ? "metadata" : "auto"} // Cloudinary metadata only
//         muted={isMuted}
//         controls={isHovered} // show controls on hover
//       >
//         <source
//           src={video.videoUrl || `http://localhost:5000/uploads/${video.filename}`}
//           type="video/mp4"
//         />
//         Your browser does not support the video tag.
//       </video>

//       {/* 🔊 Mute/Unmute Button */}
//       {isHovered && (
//         <div
//           onClick={toggleMute}
//           style={{
//             position: "absolute",
//             bottom: "10px",
//             right: "10px",
//             backgroundColor: "rgba(0,0,0,0.6)",
//             borderRadius: "50%",
//             padding: "6px",
//             cursor: "pointer",
//           }}
//         >
//           {isMuted ? <VolumeX color="white" size={20} /> : <Volume2 color="white" size={20} />}
//         </div>
//       )}

//       {/* Video info */}
//       <div style={{ padding: "8px" }}>
//         <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>{video.title}</h3>
//         <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
//           👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const previewTime = 0.5;
  const isLocal = !video.videoUrl;

  const handleClick = () => navigate(`/video/${video.id}`);

  // Cloudinary poster
  const getCloudinaryPoster = (url) => {
    if (!url) return "";
    return url.replace("/upload/", `/upload/so_${previewTime}/`).replace(/\.\w+$/, ".jpg");
  };

  // Poster: Cloudinary poster or backend thumbnail for local videos
  const poster = video.videoUrl
    ? getCloudinaryPoster(video.videoUrl)
    : video.thumbnail_path; // For local videos, generate thumbnail in backend

  const videoSrc = video.videoUrl || `http://localhost:5000/uploads/${video.filename}`;

  const handleMouseEnter = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setIsHovered(true);
    vid.muted = isMuted;
    vid.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setIsHovered(false);
    vid.pause();
    // if (isLocal) vid.currentTime = previewTime; // reset to preview frame
    vid.currentTime = 0; // <-- always reset to start
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const fallbackThumbnail = "https://via.placeholder.com/320x180?text=No+Thumbnail";

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: "pointer",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        marginBottom: "16px",
        backgroundColor: "#fff",
        position: "relative",
        width: "100%",
        maxWidth: "500px",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      {/* Poster / Thumbnail */}
      {!isHovered && (
        <img
          src={poster || fallbackThumbnail}
          alt={video.title}
          onError={(e) => {
            e.target.src = fallbackThumbnail;
          }}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block",
            backgroundColor: "#000",
          }}
        />
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        width="100%"
        height="220"
        style={{
          objectFit: "cover",
          display: isHovered ? "block" : "none",
          backgroundColor: "#000",
        }}
        muted={isMuted}
        controls={isHovered}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mute button */}
      {isHovered && (
        <div
          onClick={toggleMute}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            padding: "6px",
            cursor: "pointer",
          }}
        >
          {isMuted ? <VolumeX color="white" size={20} /> : <Volume2 color="white" size={20} />}
        </div>
      )}

      {/* Video info */}
      <div style={{ padding: "8px" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>{video.title}</h3>
        <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
          👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
        </p>
      </div>
    </div>
  );
}
