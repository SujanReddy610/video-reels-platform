// src/services/badgeService.js
import API from "../api"; // your axios instance

// Fetch badges for a specific user
export const getUserBadges = async (userId, token) => {
  try {
    const response = await API.get(`/badges/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
};
