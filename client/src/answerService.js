// // src/answerService.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/answers", // ✅ correct base URL
//   headers: { "Content-Type": "application/json" },
// });

// const getAuthHeaders = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// export const answerQuestion = async (questionId, text, token) => {
//   if (!token) throw new Error("User must be logged in to submit an answer.");

//   try {
//     const { data } = await API.post(`/${questionId}/answer`, { text }, getAuthHeaders(token));
//     return data;
//   } catch (err) {
//     console.error("❌ Failed to submit answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit answer. Please try again.");
//   }
// };

// src/answerService.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/answers",
//   headers: { "Content-Type": "application/json" },
// });

// const getAuthHeaders = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// export const answerQuestion = async (questionId, text, token) => {
//   if (!token) throw new Error("User must be logged in to submit an answer.");

//   try {
//     const { data } = await API.post(
//       `/${questionId}/answer`,
//       { text },
//       getAuthHeaders(token)
//     );
//     return data;
//   } catch (err) {
//     console.error("❌ Failed to submit answer:", err.response?.data || err.message);
//     throw new Error("Unable to submit answer");
//   }
// };










































// src/answerService.js
// src/answerService.js
import axios from "axios";

// ---------------------
// Axios Instance
// ---------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api/answers", // base URL for answers API
  headers: { "Content-Type": "application/json" },
});

// ---------------------
// Helper: Auth Headers
// ---------------------
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ---------------------
// Submit an answer to a question
// ---------------------
export const answerQuestion = async (questionId, text, token) => {
  if (!token) throw new Error("User must be logged in to submit an answer.");
  if (!text.trim()) throw new Error("Answer text cannot be empty.");

  try {
    const { data } = await API.post(
      `/${questionId}/answer`,
      { text },
      getAuthHeaders(token)
    );

    // Return the saved answer, mapping user
    return {
      ...data,
      user: data.User || { name: "Anonymous" }, // map backend User object
    };
  } catch (err) {
    console.error(
      "❌ Failed to submit answer:",
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.message || "Unable to submit answer");
  }
};

// ---------------------
// Fetch all answers for a question
// ---------------------
export const getAnswers = async (questionId, token) => {
  if (!questionId) return [];
  try {
    const { data } = await API.get(`/${questionId}`, getAuthHeaders(token));

    // Map answers to frontend format
    const mapped = data.map((a) => ({
      id: a.id,
      text: a.text,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      user: a.User || { name: "Anonymous" },
    }));

    return mapped;
  } catch (err) {
    console.error(
      "❌ Failed to fetch answers:",
      err.response?.data || err.message
    );
    return [];
  }
};
