import { useEffect, useState } from "react";
import API from "../api";

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await API.get("/videos?type=reel"); // backend should filter reel-type videos
        setReels(res.data || []);
      } catch (err) {
        console.error("Failed to load reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Reels...</p>;

  return (
    <div className="flex flex-col items-center bg-black text-white h-screen overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
        <div
          key={reel.id}
          className="w-full h-screen flex items-center justify-center snap-start relative"
        >
          <video
            src={reel.url}
            className="w-full h-full object-cover"
            controls
            loop
          />
          <div className="absolute bottom-10 left-5 text-left">
            <h2 className="font-bold text-lg">{reel.title}</h2>
            <p className="text-sm text-gray-300">{reel.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
