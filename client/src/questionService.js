// // src/questionService.js
// import axios from "axios";

// // ---------------------
// // Axios Instance
// // ---------------------
// const API = axios.create({
//   baseURL: "http://localhost:5000/api/questions",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ---------------------
// // Helper: Get Auth Headers
// // ---------------------
// const getAuthHeaders = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// // ---------------------
// // Get All Questions for a Video
// // ---------------------
// export const getQuestions = async (videoId, token) => {
//   if (!token) throw new Error("User must be logged in to fetch Q&A.");

//   try {
//     // Updated route to match backend: GET /api/questions/video/:videoId
//     const response = await API.get(`/video/${videoId}`, getAuthHeaders(token));
//     return response.data; // Array of questions with user & answers
//   } catch (err) {
//     console.error("❌ Failed to fetch questions:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to fetch questions. Please try again.");
//   }
// };

// // ---------------------
// // Ask a Question
// // ---------------------
// export const askQuestion = async (videoId, text, timestamp = 0, token) => {
//   if (!token) throw new Error("User must be logged in to ask a question.");

//   try {
//     // Backend route for asking a question
//     const response = await API.post(
//       "/ask",
//       { videoId, text, timestamp },
//       getAuthHeaders(token)
//     );
//     return response.data; // Newly created question object
//   } catch (err) {
//     console.error("❌ Failed to ask question:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit your question. Try again.");
//   }
// };

// // ---------------------
// // Answer a Question
// // ---------------------
// export const answerQuestion = async (questionId, answerText, token) => {
//   if (!token) throw new Error("User must be logged in to submit an answer.");

//   try {
//     const response = await API.post(
//       `/${questionId}/answer`,
//       { text: answerText },
//       getAuthHeaders(token)
//     );
//     return response.data; // Newly created answer object
//   } catch (err) {
//     console.error("❌ Failed to submit answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit answer. Please try again.");
//   }
// };

// // ---------------------
// // Delete a Question (Admin)
// // ---------------------
// export const deleteQuestion = async (questionId, token) => {
//   if (!token) throw new Error("User must be logged in to delete a question.");

//   try {
//     const response = await API.delete(`/${questionId}`, getAuthHeaders(token));
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to delete question:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to delete question. Please try again.");
//   }
// };

// // ---------------------
// // Delete an Answer (Admin)
// // ---------------------
// export const deleteAnswer = async (answerId, token) => {
//   if (!token) throw new Error("User must be logged in to delete an answer.");

//   try {
//     const response = await API.delete(`/answer/${answerId}`, getAuthHeaders(token));
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to delete answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to delete answer. Please try again.");
//   }
// };








// // src/questionService.js
// import axios from "axios";

// // ---------------------
// // Axios Instance
// // ---------------------
// const API = axios.create({
//   baseURL: "http://localhost:5000/api/questions",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ---------------------
// // Helper: Get Auth Headers
// // ---------------------
// const getAuthHeaders = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// // ---------------------
// // Get All Questions for a Video
// // ---------------------
// export const getQuestions = async (videoId, token) => {
//   if (!token) throw new Error("User must be logged in to fetch Q&A.");

//   try {
//     // Updated route to match backend: GET /api/questions/video/:videoId
//     const response = await API.get(`/video/${videoId}`, getAuthHeaders(token));
//     return response.data; // Array of questions with user & answers
//   } catch (err) {
//     console.error("❌ Failed to fetch questions:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to fetch questions. Please try again.");
//   }
// };

// // ---------------------
// // Ask a Question
// // ---------------------
// export const askQuestion = async (videoId, text, timestamp = 0, token) => {
//   if (!token) throw new Error("User must be logged in to ask a question.");

//   try {
//     // Backend route for asking a question
//     const response = await API.post(
//       "/ask",
//       { videoId, text, timestamp },
//       getAuthHeaders(token)
//     );
//     return response.data; // Newly created question object
//   } catch (err) {
//     console.error("❌ Failed to ask question:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit your question. Try again.");
//   }
// };

// // ---------------------
// // Answer a Question
// // ---------------------
// export const answerQuestion = async (questionId, answerText, token) => {
//   if (!token) throw new Error("User must be logged in to submit an answer.");

//   try {
//     const response = await axios.post(
//       `http://localhost:5000/api/answers/${questionId}/answer`,
//       { text: answerText },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to submit answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit answer. Please try again.");
//   }
// };


// // ---------------------
// // Delete a Question (Admin)
// // ---------------------
// export const deleteQuestion = async (questionId, token) => {
//   if (!token) throw new Error("User must be logged in to delete a question.");

//   try {
//     const response = await API.delete(`/${questionId}`, getAuthHeaders(token));
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to delete question:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to delete question. Please try again.");
//   }
// };

// // ---------------------
// // Delete an Answer (Admin)
// // ---------------------
// export const deleteAnswer = async (answerId, token) => {
//   if (!token) throw new Error("User must be logged in to delete an answer.");

//   try {
//     const response = await API.delete(`/answer/${answerId}`, getAuthHeaders(token));
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to delete answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to delete answer. Please try again.");
//   }
// };

// latest new code to display answers
// import axios from "axios";

// // ---------------------
// // Axios Instance
// // ---------------------
// const API = axios.create({
//   baseURL: "http://localhost:5000/api/questions",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ---------------------
// // Helper: Get Auth Headers
// // ---------------------
// const getAuthHeaders = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// // ---------------------
// // Get All Questions for a Video
// // ---------------------
// export const getQuestions = async (videoId, token) => {
//   if (!token) throw new Error("User must be logged in to fetch Q&A.");

//   try {
//     // GET all questions for a video (backend should populate answers and user info)
//     const response = await API.get(`/video/${videoId}`, getAuthHeaders(token));

//     // Ensure answers have user info
//     const questionsWithAnswers = response.data.map((q) => ({
//       ...q,
//       user: q.User || { name: "Anonymous" },
//       answers: q.answers?.map((a) => ({
//         ...a,
//         user: a.User || { name: "Anonymous" },
//       })) || [],
//     }));

//     return questionsWithAnswers;
//   } catch (err) {
//     console.error("❌ Failed to fetch questions:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to fetch questions. Please try again.");
//   }
// };

// // ---------------------
// // Ask a Question
// // ---------------------
// export const askQuestion = async (videoId, text, timestamp = 0, token) => {
//   if (!token) throw new Error("User must be logged in to ask a question.");

//   try {
//     const response = await API.post(
//       "/ask",
//       { videoId, text, timestamp },
//       getAuthHeaders(token)
//     );

//     // Return question with user info
//     const q = response.data;
//     return {
//       ...q,
//       user: q.User || { name: "Anonymous" },
//       answers: [],
//     };
//   } catch (err) {
//     console.error("❌ Failed to ask question:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit your question. Try again.");
//   }
// };

// // ---------------------
// // Answer a Question (Only Video Uploader / Admin)
// // ---------------------
// export const answerQuestion = async (questionId, answerText, token) => {
//   if (!token) throw new Error("User must be logged in to submit an answer.");

//   try {
//     const response = await axios.post(
//       `http://localhost:5000/api/answers/${questionId}/answer`,
//       { text: answerText },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     // Return answer with user info
//     const a = response.data;
//     return {
//       ...a,
//       user: a.User || { name: "Anonymous" },
//     };
//   } catch (err) {
//     console.error("❌ Failed to submit answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to submit answer. Please try again.");
//   }
// };

// // ---------------------
// // Delete a Question (Admin)
// // ---------------------
// export const deleteQuestion = async (questionId, token) => {
//   if (!token) throw new Error("User must be logged in to delete a question.");

//   try {
//     const response = await API.delete(`/${questionId}`, getAuthHeaders(token));
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to delete question:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to delete question. Please try again.");
//   }
// };

// // ---------------------
// // Delete an Answer (Admin)
// // ---------------------
// export const deleteAnswer = async (answerId, token) => {
//   if (!token) throw new Error("User must be logged in to delete an answer.");

//   try {
//     const response = await API.delete(`/answer/${answerId}`, getAuthHeaders(token));
//     return response.data;
//   } catch (err) {
//     console.error("❌ Failed to delete answer:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Unable to delete answer. Please try again.");
//   }
// };



import axios from "axios";

// ---------------------
// Axios Instance
// ---------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api/questions",
  headers: { "Content-Type": "application/json" },
});

// ---------------------
// Helper: Auth Headers
// ---------------------
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ---------------------
// Get All Questions for a Video
// ---------------------
export const getQuestions = async (videoId, token) => {
  if (!token) throw new Error("User must be logged in to fetch Q&A.");

  try {
    // GET all questions for a video
    const response = await API.get(`/video/${videoId}`, getAuthHeaders(token));

    // Ensure answers have user info
    const questionsWithAnswers = response.data.map((q) => ({
      ...q,
      user: q.User || { name: "Anonymous" },
      answers: q.answers?.map((a) => ({
        ...a,
        user: a.User || { name: "Anonymous" },
      })) || [],
    }));

    return questionsWithAnswers;
  } catch (err) {
    console.error("❌ Failed to fetch questions:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Unable to fetch questions. Please try again.");
  }
};

// ---------------------
// Ask a Question
// ---------------------
export const askQuestion = async (videoId, text, timestamp = 0, token) => {
  if (!token) throw new Error("User must be logged in to ask a question.");

  try {
    const response = await API.post(
      "/ask",
      { videoId, text, timestamp },
      getAuthHeaders(token)
    );

    const q = response.data;
    return {
      ...q,
      user: q.User || { name: "Anonymous" },
      answers: [],
    };
  } catch (err) {
    console.error("❌ Failed to ask question:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Unable to submit your question. Try again.");
  }
};

// ---------------------
// Delete a Question (Admin)
// ---------------------
export const deleteQuestion = async (questionId, token) => {
  if (!token) throw new Error("User must be logged in to delete a question.");

  try {
    const response = await API.delete(`/${questionId}`, getAuthHeaders(token));
    return response.data;
  } catch (err) {
    console.error("❌ Failed to delete question:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Unable to delete question. Please try again.");
  }
};

// ---------------------
// Delete an Answer (Admin)
// ---------------------
export const deleteAnswer = async (answerId, token) => {
  if (!token) throw new Error("User must be logged in to delete an answer.");

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/answers/answer/${answerId}`,
      getAuthHeaders(token)
    );
    return response.data;
  } catch (err) {
    console.error("❌ Failed to delete answer:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Unable to delete answer. Please try again.");
  }
};
