// import React, { useEffect, useState, useRef } from "react";
// import API from "../api";

// export default function ChatPage() {
//   const token = localStorage.getItem("token") || "";
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [groupId, setGroupId] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Decode JWT
//   const getUserId = () => {
//     if (!token) return null;
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const decoded = JSON.parse(atob(base64));
//       return decoded.userId || decoded.id;
//     } catch {
//       return null;
//     }
//   };
//   const userId = getUserId();

//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   useEffect(scrollToBottom, [messages]);

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await API.get("/messages/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   useEffect(() => { fetchUsers(); }, []);

//   // Fetch/create group
//   const fetchOrCreateGroup = async (otherUserId) => {
//     try {
//       const res = await API.post(
//         "/messages/direct",
//         { userId2: otherUserId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setGroupId(res.data.id);
//       return res.data.id;
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   };

//   // Fetch messages
//   const fetchMessages = async (grpId) => {
//     if (!grpId) return;
//     try {
//       const res = await API.get(`/messages/${grpId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Select chat
//   const handleSelectUser = async (user) => {
//     setSelectedUser(user);
//     const grpId = await fetchOrCreateGroup(user.id);
//     if (grpId) fetchMessages(grpId);
//   };

//   // Poll every 5s
//   useEffect(() => {
//     let interval;
//     if (groupId) interval = setInterval(() => fetchMessages(groupId), 5000);
//     return () => clearInterval(interval);
//   }, [groupId]);

//   // Send message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !groupId) return;
//     try {
//       const res = await API.post(
//         `/messages/${groupId}`,
//         { text: newMessage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessages((prev) => [...prev, res.data]);
//       setNewMessage("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send message");
//     }
//   };

//   return (
//     <div className="chat-wrapper">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>Chats</h2>
//         <ul>
//           {users.map((user) => (
//             <li
//               key={user.id}
//               className={`user ${selectedUser?.id === user.id ? "active" : ""}`}
//               onClick={() => handleSelectUser(user)}
//             >
//               <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
//               <span>{user.name}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat */}
//       <div className="chat-area">
//         <div className="chat-header">
//           {selectedUser ? selectedUser.name : "Select a user to start chat"}
//         </div>

//         <div className="messages">
//           {selectedUser ? (
//             <>
//               {messages.length === 0 && (
//                 <p className="no-msg">No messages yet</p>
//               )}
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id || msg._id}
//                   className={`msg ${msg.senderId === userId ? "sent" : "recv"}`}
//                 >
//                   <div className="msg-text">{msg.message || msg.text}</div>
//                   <div className="time">
//                     {new Date(msg.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </>
//           ) : (
//             <p className="no-msg">Select a user to start chatting</p>
//           )}
//         </div>

//         {selectedUser && (
//           <form onSubmit={handleSendMessage} className="chat-input">
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//             />
//             <button type="submit">➤</button>
//           </form>
//         )}
//       </div>

//       {/* CSS */}
//       <style>{`
//         .chat-wrapper {
//           display: flex;
//           height: 100vh;
//           background: #e9eef6;
//           font-family: 'Segoe UI', sans-serif;
//         }

//         /* Sidebar */
//         .sidebar {
//           width: 260px;
//           background: rgba(255,255,255,0.75);
//           backdrop-filter: blur(8px);
//           border-right: 1px solid rgba(200,200,200,0.4);
//           box-shadow: 2px 0 8px rgba(0,0,0,0.05);
//           display: flex;
//           flex-direction: column;
//         }

//         .sidebar h2 {
//           text-align: center;
//           font-size: 1.4rem;
//           padding: 18px;
//           color: #1e3a8a;
//           font-weight: 600;
//           border-bottom: 1px solid rgba(0,0,0,0.1);
//         }

//         .sidebar ul {
//           flex: 1;
//           list-style: none;
//           padding: 10px;
//           margin: 0;
//           overflow-y: auto;
//         }

//         .user {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 10px;
//           border-radius: 10px;
//           margin-bottom: 6px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }
//         .user:hover {
//           background: #dbeafe;
//           transform: translateX(3px);
//         }
//         .user.active {
//           background: linear-gradient(90deg, #3b82f6, #60a5fa);
//           color: white;
//         }

//         .avatar {
//           width: 38px;
//           height: 38px;
//           border-radius: 50%;
//           background: #3b82f6;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//         }

//         /* Chat Area */
//         .chat-area {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           background: #f9fafb;
//         }

//         .chat-header {
//           background: white;
//           padding: 16px 20px;
//           font-weight: 600;
//           border-bottom: 1px solid #ddd;
//           font-size: 1.1rem;
//           color: #1e293b;
//         }

//         .messages {
//           flex: 1;
//           overflow-y: auto;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//         }

//         .msg {
//           max-width: 60%;
//           padding: 12px 16px;
//           border-radius: 18px;
//           position: relative;
//           animation: popIn 0.25s ease;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.1);
//         }

//         .msg.sent {
//           align-self: flex-end;
//           background: linear-gradient(135deg, #3b82f6, #60a5fa);
//           color: white;
//           border-bottom-right-radius: 4px;
//         }

//         .msg.recv {
//           align-self: flex-start;
//           background: white;
//           color: #333;
//           border: 1px solid #e0e0e0;
//           border-bottom-left-radius: 4px;
//         }

//         .msg-text {
//           font-size: 0.95rem;
//           line-height: 1.4;
//         }

//         .time {
//           font-size: 0.7rem;
//           color: rgba(255,255,255,0.7);
//           text-align: right;
//           margin-top: 4px;
//         }

//         .recv .time {
//           color: #999;
//         }

//         .no-msg {
//           text-align: center;
//           color: #777;
//           margin-top: 25px;
//           font-style: italic;
//         }

//         /* Input */
//         .chat-input {
//           display: flex;
//           padding: 12px 18px;
//           background: white;
//           border-top: 1px solid #ccc;
//           gap: 10px;
//         }

//         .chat-input input {
//           flex: 1;
//           border-radius: 25px;
//           border: 1px solid #ccc;
//           padding: 10px 15px;
//           font-size: 1rem;
//           outline: none;
//           transition: 0.2s;
//         }

//         .chat-input input:focus {
//           border-color: #3b82f6;
//           box-shadow: 0 0 6px rgba(59,130,246,0.4);
//         }

//         .chat-input button {
//           background: #3b82f6;
//           color: white;
//           border: none;
//           border-radius: 50%;
//           width: 45px;
//           height: 45px;
//           font-size: 1.2rem;
//           cursor: pointer;
//           transition: 0.2s ease-in-out;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .chat-input button:hover {
//           background: #2563eb;
//           transform: scale(1.1);
//           box-shadow: 0 4px 10px rgba(37,99,235,0.3);
//         }

//         @keyframes popIn {
//           from { transform: scale(0.9); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }
import React, { useEffect, useState, useRef } from "react";
import API from "../api";

export default function ChatPage() {
  const token = localStorage.getItem("token") || "";
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupId, setGroupId] = useState(null);
  const messagesEndRef = useRef(null);

  // Decode JWT
  const getUserId = () => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      return decoded.userId || decoded.id;
    } catch {
      return null;
    }
  };
  const userId = getUserId();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/messages/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => { fetchUsers(); }, []);

  // Fetch or create group
  const fetchOrCreateGroup = async (otherUserId) => {
    try {
      const res = await API.post(
        "/messages/direct",
        { userId2: otherUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupId(res.data.id);
      return res.data.id;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Fetch messages
  const fetchMessages = async (grpId) => {
    if (!grpId) return;
    try {
      const res = await API.get(`/messages/${grpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle user click
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    const grpId = await fetchOrCreateGroup(user.id);
    if (grpId) fetchMessages(grpId);
  };

  // Auto refresh
  useEffect(() => {
    let interval;
    if (groupId) interval = setInterval(() => fetchMessages(groupId), 4000);
    return () => clearInterval(interval);
  }, [groupId]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !groupId) return;
    try {
      const res = await API.post(
        `/messages/${groupId}`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 font-[Poppins] relative">
      {/* Chakra Watermark */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg')] bg-center bg-no-repeat bg-contain pointer-events-none" />

      {/* Sidebar */}
      <div className="w-64 bg-white/90 border-r border-orange-200 shadow-md backdrop-blur-sm z-10">
        <div className="p-5 border-b border-orange-100">
          <h2 className="text-2xl font-bold text-orange-600">Bharat Chat 🇮🇳</h2>
          <p className="text-sm text-gray-500">Connecting Independent Minds</p>
        </div>
        <ul className="overflow-y-auto h-[calc(100%-80px)]">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`p-3 mx-2 my-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedUser?.id === user.id
                  ? "bg-orange-100 border-l-4 border-orange-500 text-orange-800 font-semibold"
                  : "hover:bg-green-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-orange-300 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span>{user.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-orange-100 via-white to-green-100 shadow-md font-semibold flex justify-between items-center">
          {selectedUser ? (
            <>
              <span className="text-lg text-gray-700">
                Chatting with <span className="text-orange-700">{selectedUser.name}</span>
              </span>
              <span className="text-xs text-gray-500 italic">Independent Bharat ✨</span>
            </>
          ) : (
            <span className="text-gray-500">Select a user to begin the journey 🇮🇳</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-white/70 backdrop-blur-sm">
          {selectedUser ? (
            <>
              {messages.length === 0 && (
                <p className="text-gray-400 text-center mt-4">No messages yet — start a conversation 💬</p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id || msg._id}
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md relative text-sm ${
                    msg.senderId === userId
                      ? "self-end bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                      : "self-start bg-gradient-to-br from-green-200 to-green-300 text-gray-800"
                  }`}
                >
                  {msg.message || msg.text}
                  <div className="text-[0.65rem] mt-1 opacity-70 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <p className="text-gray-400 text-center mt-4 italic">
              Choose a user to see the spirit of Bharat come alive 🇮🇳
            </p>
          )}
        </div>

        {/* Input */}
        {selectedUser && (
          <form
            onSubmit={handleSendMessage}
            className="flex p-3 bg-gradient-to-r from-orange-100 via-white to-green-100 border-t border-gray-200"
          >
            <input
              type="text"
              placeholder="Express your thought..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-3 px-5 py-2 bg-gradient-to-br from-green-500 to-orange-400 text-white rounded-full font-semibold shadow hover:shadow-lg transition-all"
            >
              Send 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
// import React, { useEffect, useState, useRef } from "react";
// import API from "../api";

// export default function ChatPage() {
//   const token = localStorage.getItem("token") || "";
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [groupId, setGroupId] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Decode JWT
//   const getUserId = () => {
//     if (!token) return null;
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const decoded = JSON.parse(atob(base64));
//       return decoded.userId || decoded.id;
//     } catch {
//       return null;
//     }
//   };
//   const userId = getUserId();

//   const scrollToBottom = () =>
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   useEffect(scrollToBottom, [messages]);

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await API.get("/messages/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Fetch or create group
//   const fetchOrCreateGroup = async (otherUserId) => {
//     try {
//       const res = await API.post(
//         "/messages/direct",
//         { userId2: otherUserId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setGroupId(res.data.id);
//       return res.data.id;
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   };

//   // Fetch messages
//   const fetchMessages = async (grpId) => {
//     if (!grpId) return;
//     try {
//       const res = await API.get(`/messages/${grpId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle user click
//   const handleSelectUser = async (user) => {
//     setSelectedUser(user);
//     const grpId = await fetchOrCreateGroup(user.id);
//     if (grpId) fetchMessages(grpId);
//   };

//   // Auto refresh
//   useEffect(() => {
//     let interval;
//     if (groupId) interval = setInterval(() => fetchMessages(groupId), 4000);
//     return () => clearInterval(interval);
//   }, [groupId]);

//   // Send message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !groupId) return;
//     try {
//       const res = await API.post(
//         `/messages/${groupId}`,
//         { text: newMessage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessages((prev) => [...prev, res.data]);
//       setNewMessage("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send message");
//     }
//   };

//   // --- Inline Styles ---
//   const styles = {
//     container: {
//       display: "flex",
//       height: "100vh",
//       fontFamily: "'Poppins', 'Noto Sans Devanagari', sans-serif",
//       background:
//         "linear-gradient(135deg, #FFF8E1, #FFFDF5, #E8F5E9)",
//       position: "relative",
//       overflow: "hidden",
//     },
//     watermark: {
//       position: "absolute",
//       inset: 0,
//       backgroundImage:
//         "url('https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg')",
//       backgroundRepeat: "no-repeat",
//       backgroundPosition: "center",
//       backgroundSize: "contain",
//       opacity: 0.05,
//       pointerEvents: "none",
//     },
//     mantra: {
//       position: "absolute",
//       inset: 0,
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       fontFamily: "'Noto Serif Devanagari', serif",
//       fontSize: "8rem",
//       color: "#E65100",
//       opacity: 0.07,
//       userSelect: "none",
//       pointerEvents: "none",
//       textAlign: "center",
//     },
//     sidebar: {
//       width: "260px",
//       background:
//         "linear-gradient(to bottom, rgba(255,243,224,0.9), rgba(255,255,255,0.85), rgba(232,245,233,0.9))",
//       borderRight: "1px solid #FFCC80",
//       boxShadow: "2px 0 10px rgba(255, 153, 51, 0.2)",
//       zIndex: 10,
//     },
//     sidebarHeader: {
//       padding: "20px",
//       borderBottom: "1px solid #FFE0B2",
//       textAlign: "center",
//     },
//     appTitle: {
//       fontSize: "24px",
//       fontWeight: "bold",
//       color: "#BF360C",
//       letterSpacing: "0.5px",
//     },
//     appSubTitle: {
//       fontSize: "12px",
//       color: "#4E342E",
//       fontFamily: "'Noto Sans Devanagari'",
//       marginTop: "4px",
//     },
//     userItem: (isSelected) => ({
//       padding: "10px 15px",
//       margin: "8px 10px",
//       borderRadius: "10px",
//       cursor: "pointer",
//       background: isSelected
//         ? "rgba(255, 183, 77, 0.25)"
//         : "transparent",
//       borderLeft: isSelected ? "4px solid #E65100" : "none",
//       color: isSelected ? "#BF360C" : "#333",
//       fontWeight: isSelected ? "600" : "400",
//       transition: "0.3s",
//     }),
//     chatWindow: {
//       flex: 1,
//       display: "flex",
//       flexDirection: "column",
//       position: "relative",
//     },
//     header: {
//       padding: "15px",
//       borderBottom: "1px solid #E0E0E0",
//       background:
//         "linear-gradient(to right, rgba(255,153,51,0.2), rgba(255,255,255,0.6), rgba(19,136,8,0.2))",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontWeight: "600",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//     },
//     messagesContainer: {
//       flex: 1,
//       padding: "20px",
//       overflowY: "auto",
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px",
//     },
//     message: (isMine) => ({
//       alignSelf: isMine ? "flex-end" : "flex-start",
//       background: isMine
//         ? "linear-gradient(135deg, #FF9933, #E65100)"
//         : "linear-gradient(135deg, #A5D6A7, #4CAF50)",
//       color: isMine ? "white" : "#1B5E20",
//       padding: "10px 15px",
//       borderRadius: "20px",
//       maxWidth: "70%",
//       boxShadow: isMine
//         ? "0 0 10px rgba(255,153,51,0.4)"
//         : "0 0 10px rgba(76,175,80,0.3)",
//       animation: isMine ? "glow 0.8s ease" : "none",
//       position: "relative",
//       fontSize: "0.95rem",
//       letterSpacing: "0.3px",
//     }),
//     messageTime: {
//       fontSize: "0.7rem",
//       opacity: 0.7,
//       textAlign: "right",
//       marginTop: "3px",
//     },
//     inputContainer: {
//       display: "flex",
//       padding: "10px",
//       borderTop: "1px solid #E0E0E0",
//       background:
//         "linear-gradient(to right, rgba(255,153,51,0.2), white, rgba(19,136,8,0.2))",
//     },
//     input: {
//       flexGrow: 1,
//       padding: "10px 15px",
//       borderRadius: "50px",
//       border: "1px solid #CCC",
//       outline: "none",
//       fontSize: "0.95rem",
//     },
//     button: {
//       marginLeft: "10px",
//       padding: "10px 20px",
//       background:
//         "linear-gradient(to right, #4CAF50, #FF9933)",
//       color: "white",
//       border: "none",
//       borderRadius: "50px",
//       fontWeight: "600",
//       cursor: "pointer",
//       boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
//       transition: "all 0.3s",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <style>{`
//         @keyframes glow {
//           0% { box-shadow: 0 0 0px rgba(255,153,51,0); }
//           50% { box-shadow: 0 0 20px rgba(255,153,51,0.6); }
//           100% { box-shadow: 0 0 0px rgba(255,153,51,0); }
//         }
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-thumb {
//           background: linear-gradient(#FF9933, #4CAF50);
//           border-radius: 4px;
//         }
//       `}</style>

//       <div style={styles.watermark}></div>
//       <div style={styles.mantra}>वसुधैव&nbsp;कुटुम्बकम्</div>

//       {/* Sidebar */}
//       <div style={styles.sidebar}>
//         <div style={styles.sidebarHeader}>
//           <div style={styles.appTitle}>भारत संवाद 🇮🇳</div>
//           <div style={styles.appSubTitle}>वसुधैव कुटुम्बकम्</div>
//         </div>
//         <ul style={{ overflowY: "auto", height: "calc(100% - 80px)" }}>
//           {users.map((user) => (
//             <li
//               key={user.id}
//               onClick={() => handleSelectUser(user)}
//               style={styles.userItem(selectedUser?.id === user.id)}
//             >
//               {user.name}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Window */}
//       <div style={styles.chatWindow}>
//         {/* Header */}
//         <div style={styles.header}>
//           {selectedUser ? (
//             <>
//               <span style={{ color: "#3E2723" }}>
//                 संवाद कर रहे हैं{" "}
//                 <span style={{ color: "#BF360C" }}>{selectedUser.name}</span> 🇮🇳
//               </span>
//               <span style={{ fontSize: "0.8rem", color: "#555" }}>
//                 आत्मनिर्भर भारत ✨
//               </span>
//             </>
//           ) : (
//             <span style={{ color: "#777" }}>
//               उपयोगकर्ता चुनें और संवाद आरंभ करें 🇮🇳
//             </span>
//           )}
//         </div>

//         {/* Messages */}
//         <div style={styles.messagesContainer}>
//           {selectedUser ? (
//             <>
//               {messages.length === 0 && (
//                 <p style={{ color: "#AAA", textAlign: "center" }}>
//                   कोई संदेश नहीं — वार्तालाप प्रारंभ करें 💬
//                 </p>
//               )}
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id || msg._id}
//                   style={styles.message(msg.senderId === userId)}
//                 >
//                   {msg.message || msg.text}
//                   <div style={styles.messageTime}>
//                     {new Date(msg.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </>
//           ) : (
//             <p
//               style={{
//                 textAlign: "center",
//                 color: "#999",
//                 fontStyle: "italic",
//               }}
//             >
//               Choose a user to see the spirit of Bharat come alive 🇮🇳
//             </p>
//           )}
//         </div>

//         {/* Input */}
//         {selectedUser && (
//           <form onSubmit={handleSendMessage} style={styles.inputContainer}>
//             <input
//               type="text"
//               placeholder="अपना विचार लिखें..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               style={styles.input}
//             />
//             <button type="submit" style={styles.button}>
//               भेजें 🚀
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
