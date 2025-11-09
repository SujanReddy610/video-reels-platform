// src/components/ProfileBadges.jsx
import React, { useEffect, useState } from "react";
import { getUserBadges } from "../badgeService";

export default function ProfileBadges({ userId, token }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const data = await getUserBadges(userId, token);
      setBadges(data || []);
    };
    if (userId && token) fetchBadges();
  }, [userId, token]);

  if (!badges.length) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">🎖️ Achievements</h3>
        <p className="text-gray-500 text-sm">No badges earned yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">🎖️ Achievements</h3>

      <div className="flex flex-wrap gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id || badge.name}
            className="flex flex-col items-center bg-white border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition"
          >
            <span className="text-2xl">{badge.icon}</span>
            <p className="text-sm font-medium mt-1">{badge.name}</p>
            <p className="text-xs text-gray-500">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
