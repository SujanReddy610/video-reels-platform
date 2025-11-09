// NotificationService.js
import API from "./api.js"; // your pre-configured axios instance

/**
 * Fetch all notifications for the logged-in user
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Array>} - Array of notification objects
 */
export const fetchNotifications = async (token) => {
  try {
    const response = await API.get("/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // should be an array of notifications
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Mark a single notification as read
 * @param {string|number} id - Notification ID
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} - Updated notification object
 */
export const markNotificationRead = async (id, token) => {
  try {
    const response = await API.post(
      `/notifications/read/${id}`,
      {}, // empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // should return { success: true } or updated notification
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    throw error;
  }
};
