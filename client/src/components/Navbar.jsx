







// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { fetchNotifications } from "../NotificationService";

// export default function Navbar({ token, handleLogout, setCurrentPage, resetHome }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Fetch unread notifications count
//   const loadNotifications = async () => {
//     if (!token) return;
//     try {
//       const notifications = await fetchNotifications(token);
//       const unread = notifications.filter((n) => !n.read).length;
//       setUnreadCount(unread);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();

//     // Auto-refresh notifications every 10 seconds
//     const interval = setInterval(() => {
//       loadNotifications();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [token]);

//   // Refresh notifications when returning from /notifications page
//   useEffect(() => {
//     if (location.pathname === "/notifications") {
//       loadNotifications();
//     }
//   }, [location.pathname]);

  

//   return (
//     <header className="mb-6 flex justify-between items-center p-4 bg-white shadow-md">
//       {/* Logo + Name */}
//       <div
//         className="flex items-center gap-2 cursor-pointer"
//         onClick={() => {
//           if (resetHome) resetHome(); // reset videos and page
//           navigate("/");
//         }}
//       >
//         <img
//           src="/PRAVAH Logo.png" // image must be in public folder
//           alt="Pravah Logo"
//           className="w-13 h-12" // adjust size
//         />
//         <h1 className="text-3xl font-bold text-blue-600">PRAVAH</h1>
//       </div>

//       {/* Navigation */}
//       {token && (
//         <nav className="flex items-center space-x-4">
//           <button
//             onClick={() => resetHome && resetHome()}
//             className="hover:text-blue-600 font-medium"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => setCurrentPage("profile")}
//             className="hover:text-blue-600 font-medium"
//           >
//             Profile
//           </button>
//           <button
//             onClick={() => setCurrentPage("upload")}
//             className="hover:text-blue-600 font-medium"
//           >
//             Upload
//           </button>

//           {/* Notifications Bell */}
//           <button
//             onClick={() => {
//               navigate("/notifications");
//               setUnreadCount(0); // clear UI count when viewing
//             }}
//             className="relative text-2xl hover:text-blue-600"
//             title="Notifications"
//           >
//             🔔
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </nav>
//       )}
//     </header>
//   );
// }








// code for reels working for only laptop

// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { fetchNotifications } from "../NotificationService";

// export default function Navbar({ token, handleLogout, setCurrentPage, resetHome }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Fetch unread notifications count
//   const loadNotifications = async () => {
//     if (!token) return;
//     try {
//       const notifications = await fetchNotifications(token);
//       const unread = notifications.filter((n) => !n.read).length;
//       setUnreadCount(unread);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();

//     // Auto-refresh notifications every 10 seconds
//     const interval = setInterval(() => {
//       loadNotifications();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [token]);

//   // Refresh notifications when returning from /notifications page
//   useEffect(() => {
//     if (location.pathname === "/notifications") {
//       loadNotifications();
//     }
//   }, [location.pathname]);

//   return (
//     <header className="mb-6 flex justify-between items-center p-4 bg-white shadow-md">
//       {/* Logo + Name */}
//       <div
//         className="flex items-center gap-2 cursor-pointer"
//         onClick={() => {
//           if (resetHome) resetHome(); // reset videos and page
//           navigate("/");
//         }}
//       >
//         <img
//           src="/PRAVAH Logo.png" // image must be in public folder
//           alt="Pravah Logo"
//           className="w-13 h-12" // adjust size
//         />
//         <h1 className="text-3xl font-bold text-blue-600">PRAVAH</h1>
//       </div>

//       {/* Navigation */}
//       {token && (
//         <nav className="flex items-center space-x-4">
//           <button
//             onClick={() => resetHome && resetHome()}
//             className="hover:text-blue-600 font-medium"
//           >
//             Home
//           </button>

//           <button
//             onClick={() => setCurrentPage("profile")}
//             className="hover:text-blue-600 font-medium"
//           >
//             Profile
//           </button>

//           <button
//             onClick={() => setCurrentPage("upload")}
//             className="hover:text-blue-600 font-medium"
//           >
//             Upload
//           </button>

//           {/* ✅ Reels Button */}
//           <button
//             onClick={() => navigate("/reels")}
//             className="hover:text-blue-600 font-medium"
//           >
//             Reels
//           </button>

//           {/* Notifications Bell */}
//           <button
//             onClick={() => {
//               navigate("/notifications");
//               setUnreadCount(0); // clear UI count when viewing
//             }}
//             className="relative text-2xl hover:text-blue-600"
//             title="Notifications"
//           >
//             🔔
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </nav>
//       )}
//     </header>
//   );
// }






// working code for all devices
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchNotifications } from "../NotificationService";
import { Menu, X } from "lucide-react"; // for hamburger icons

export default function Navbar({ token, handleLogout, setCurrentPage, resetHome }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch unread notifications count
  const loadNotifications = async () => {
    if (!token) return;
    try {
      const notifications = await fetchNotifications(token);
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  // Refresh notifications when returning from /notifications page
  useEffect(() => {
    if (location.pathname === "/notifications") {
      loadNotifications();
    }
  }, [location.pathname]);

  const handleNavClick = (page) => {
    setMenuOpen(false);
    if (page === "home") {
      if (resetHome) resetHome();
      navigate("/");
    } else if (page === "reels") {
      navigate("/reels");
    } else if (page === "notifications") {
      navigate("/notifications");
      setUnreadCount(0);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-50">
      {/* Logo + Name */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          if (resetHome) resetHome();
          navigate("/");
        }}
      >
        <img
          src="/PRAVAH Logo.png"
          alt="Pravah Logo"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">PRAVAH</h1>
      </div>

      {/* Desktop Navigation */}
      {token && (
        <nav className="hidden md:flex items-center space-x-5">
          <button onClick={() => handleNavClick("home")} className="hover:text-blue-600 font-medium">
            Home
          </button>
          <button onClick={() => handleNavClick("profile")} className="hover:text-blue-600 font-medium">
            Profile
          </button>
          <button onClick={() => handleNavClick("upload")} className="hover:text-blue-600 font-medium">
            Upload
          </button>
          <button onClick={() => handleNavClick("reels")} className="hover:text-blue-600 font-medium">
            Reels
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => handleNavClick("notifications")}
            className="relative text-2xl hover:text-blue-600"
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      )}

      {/* Mobile Menu Button */}
      {token && (
        <button
          className="md:hidden text-3xl text-blue-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      )}

      {/* Mobile Dropdown Menu */}
      {menuOpen && token && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
          <button onClick={() => handleNavClick("home")} className="hover:text-blue-600 font-medium">
            Home
          </button>
          <button onClick={() => handleNavClick("profile")} className="hover:text-blue-600 font-medium">
            Profile
          </button>
          <button onClick={() => handleNavClick("upload")} className="hover:text-blue-600 font-medium">
            Upload
          </button>
          <button onClick={() => handleNavClick("reels")} className="hover:text-blue-600 font-medium">
            Reels
          </button>
          <button onClick={() => handleNavClick("notifications")} className="relative text-xl hover:text-blue-600">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
