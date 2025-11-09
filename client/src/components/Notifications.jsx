// import React, { useEffect, useState } from "react";
// import { fetchNotifications, markNotificationRead } from "../notificationService";

// export default function Notifications({ token }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch notifications from backend
//   const loadNotifications = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchNotifications(token);
//       setNotifications(data || []);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//       setError("Failed to load notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) loadNotifications();
//   }, [token]);

//   // Mark a notification as read
//   const handleMarkRead = async (id) => {
//     try {
//       await markNotificationRead(id, token);
//       setNotifications((prev) =>
//         prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//       );
//     } catch (err) {
//       console.error("Failed to mark notification as read:", err);
//     }
//   };

//   if (loading)
//     return (
//       <p className="text-gray-600 text-center mt-10">Loading notifications...</p>
//     );
//   if (error)
//     return (
//       <p className="text-red-600 text-center mt-10">{error}</p>
//     );
//   if (notifications.length === 0)
//     return (
//       <p className="text-gray-500 text-center mt-10">No notifications yet.</p>
//     );

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-6">
//       <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
//       <ul className="space-y-3">
//         {notifications.map((notification) => (
//           <li
//             key={notification.id}
//             className={`p-3 rounded-md border flex justify-between items-center transition ${
//               notification.read
//                 ? "bg-gray-100 border-gray-200"
//                 : "bg-blue-50 border-blue-200 font-medium"
//             }`}
//           >
//             <div>
//               <p className="text-gray-800">{notification.message}</p>
//               <span className="text-xs text-gray-400">
//                 {new Date(notification.createdAt).toLocaleString()}
//               </span>
//             </div>
//             {!notification.read && (
//               <button
//                 onClick={() => handleMarkRead(notification.id)}
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 Mark Read
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationRead } from "../NotificationService";

export default function Notifications({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from backend
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchNotifications(token);
      // Ensure we use backend field 'isRead' for consistency
      setNotifications(data.map((n) => ({ ...n, read: n.isRead })));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadNotifications();
  }, [token]);

  // Mark a notification as read
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  if (loading)
    return (
      <p className="text-gray-600 text-center mt-10">
        Loading notifications...
      </p>
    );

  if (error)
    return (
      <p className="text-red-600 text-center mt-10">{error}</p>
    );

  if (notifications.length === 0)
    return (
      <p className="text-gray-500 text-center mt-10">
        No notifications yet.
      </p>
    );

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-3">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-3 rounded-md border flex justify-between items-center transition-colors ${
              notification.read
                ? "bg-gray-100 border-gray-200"
                : "bg-blue-50 border-blue-200 font-medium"
            }`}
          >
            <div>
              <p className="text-gray-800">{notification.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
            {!notification.read && (
              <button
                onClick={() => handleMarkRead(notification.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
