// src/pages/VideoDetail.jsx
// src/pages/VideoDetail.jsx
// src/pages/VideoDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function VideoDetails({ token }) {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideo();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "16px" }}>
      <video
        src={`http://localhost:5000/uploads/${video.filename}`}
        controls
        width="100%"
        style={{ borderRadius: "8px" }}
      />
      <h2 style={{ marginTop: "12px" }}>{video.title}</h2>
      <p>
        👁 {video.views} | 👍 {video.likes} | 👎 {video.dislikes}
      </p>
      <div>
        <h3>Comments</h3>
        {(video.VideoComments || []).map((c, idx) => (
          <p key={idx} style={{ borderBottom: "1px solid #eee", padding: "4px 0" }}>
            {c.text || c.comment || c}
          </p>
        ))}
      </div>
    </div>
  );
}

