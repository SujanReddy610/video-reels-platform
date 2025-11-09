import axios from "axios";

const CHAT_API = "http://localhost:5000/api"; // chat-app-root backend

// Fetch all messages for uploader
export const fetchChatMessages = (uploaderId) =>
  axios.get(`${CHAT_API}/groups/users/${uploaderId}/messages`);

// Send a message
export const sendChatMessage = (uploaderId, content) =>
  axios.post(`${CHAT_API}/groups/users/${uploaderId}/messages`, { content });

// Fetch all users (optional, if needed for chat list)
export const fetchUsers = () => axios.get(`${CHAT_API}/groups/users`);
