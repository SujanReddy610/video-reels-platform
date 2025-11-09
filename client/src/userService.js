// // src/userService.js
// import axios from "axios";

// const API_BASE = "http://localhost:5000/api/users"; // adjust if needed

// export const fetchAllUsers = async (token) => {
//   try {
//     const res = await axios.get(API_BASE, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Failed to fetch users:", err);
//     return [];
//   }
// };
// userService.js
import axios from "axios";

export const fetchAllUsers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/users");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return [];
  }
};
