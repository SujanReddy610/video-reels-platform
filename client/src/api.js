
import axios from "axios";

// ------------------
// Create Axios instance
// ------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api", // make sure backend runs on this port
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------
// Request interceptor to attach JWT token
// ------------------
API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token && typeof token === "string") {
      token = token.trim();

      // Validate token string
      if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn(
          "[API] Invalid token format — skipping Authorization header."
        );
      }
    } else {
      // Non-protected routes can skip this warning
      if (!config.url.includes("/auth/login") && !config.url.includes("/auth/register")) {
        console.warn("[API] No token found — request may be unauthorized.");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------
// Response interceptor for global error handling
// ------------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle Unauthorized (401) — token expired or invalid
      if (status === 401) {
        console.error("[API] Unauthorized — possible expired or invalid token.");

        // Optionally auto-logout the user
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // Handle Forbidden (403)
      if (status === 403) {
        console.error("[API] Forbidden — you don’t have permission to access this resource.");
      }

      // Handle Not Found (404)
      if (status === 404) {
        console.error(`[API] Resource not found: ${data?.message || error.config.url}`);
      }

      // Optional: handle other global errors here
    } else if (error.request) {
      // Network errors
      console.error("[API] No response received — possible network error.", error.request);
    } else {
      // Other errors
      console.error("[API] Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
