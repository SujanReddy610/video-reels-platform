import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function NetworkFeed({ token }) {
  const [networkVideos, setNetworkVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------------
  // Fetch Videos from Network (Subscribed Users)
  // -------------------------
  useEffect(() => {
    const fetchNetworkVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos/network", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNetworkVideos(res.data || []);
      } catch (err) {
        console.error("Error fetching network videos:", err);
        setError("Failed to load network videos");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchNetworkVideos();
  }, [token]);

  // -------------------------
  // Loading State
  // -------------------------
  if (loading) return <div className="text-center mt-8 text-gray-600">Loading network videos...</div>;

  // -------------------------
  // Error State
  // -------------------------
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  // -------------------------
  // Empty State
  // -------------------------
  if (networkVideos.length === 0)
    return (
      <div className="text-center mt-10 text-gray-500">
        No videos from your subscriptions yet.<br />
        <Link to="/explore" className="text-blue-500 hover:underline">
          Explore creators
        </Link>
      </div>
    );

  // -------------------------
  // Render Video Cards
  // -------------------------
  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-6">Your Network Feed</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {networkVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            {/* Thumbnail */}
            <Link to={`/watch/${video.id}`}>
              <img
                src={`http://localhost:5000${video.thumbnailUrl || "/uploads/default-thumbnail.jpg"}`}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </Link>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-md font-semibold text-gray-900 truncate">
                <Link to={`/watch/${video.id}`} className="hover:text-blue-500">
                  {video.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>

              {/* Uploader Info */}
              <div className="flex items-center mt-3">
                <img
                  src={`http://localhost:5000${video.user?.profilePic || "/uploads/default-avatar.png"}`}
                  alt={video.user?.username}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{video.user?.username}</p>
                  <p className="text-xs text-gray-500">
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
