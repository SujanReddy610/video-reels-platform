import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const ChatPage = ({ currentUser }) => {
  const { userId } = useParams(); // current chat user ID
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch messages
  const fetchMessages = async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/groups/channels/${userId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch users for sidebar
  const fetchUsers = async () => {
    try {
      const res = await API.get("/groups/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await API.post(`/groups/channels/${userId}/messages`, { content: newMessage });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Sidebar for users */}
      <div className="chat-sidebar">
        <h3>Contacts</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className={`user-item ${parseInt(userId) === user.id ? "active" : ""}`}>
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && <p className="no-messages">No messages yet</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.senderId === currentUser.id ? "sent" : "received"}`}
            >
              <div className="sender-name">{msg.sender?.name}</div>
              <div className="message-text">{msg.message}</div>
              <div className="timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="chat-send-btn">Send</button>
        </form>
      </div>

      {/* Embedded CSS */}
      <style>{`
        .chat-wrapper {
          display: flex;
          height: 90vh;
          max-width: 1100px;
          margin: 20px auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border-radius: 15px;
          overflow: hidden;
        }

        /* Sidebar */
        .chat-sidebar {
          width: 220px;
          background: #1e293b;
          color: white;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .chat-sidebar h3 {
          margin-bottom: 15px;
          font-size: 1.2rem;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .user-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .user-item {
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .user-item:hover { background: #334155; }
        .user-item.active { background: #3b82f6; }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #60a5fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 10px;
        }
        .user-name { font-weight: 500; }

        /* Chat area */
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f0f4f8;
        }
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          max-width: 65%;
          padding: 12px 18px;
          border-radius: 25px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0,0,0,0.08);
          transition: all 0.2s ease-in-out;
        }
        .chat-message:hover { transform: scale(1.02); }

        .sent {
          align-self: flex-end;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          color: white;
          text-align: right;
        }
        .received {
          align-self: flex-start;
          background: #fff;
          border: 1px solid #ddd;
          color: #333;
        }

        .sender-name { font-size: 0.75rem; color: #555; margin-bottom: 4px; font-weight: bold; }
        .message-text { font-size: 1rem; }
        .timestamp { font-size: 0.65rem; color: #aaa; margin-top: 4px; text-align: right; }
        .no-messages { text-align: center; color: #888; font-style: italic; margin-top: 20px; }

        .chat-input-form {
          display: flex;
          padding: 12px 15px;
          background: #e2e8f0;
          border-top: 1px solid #ccc;
          gap: 10px;
        }
        .chat-input {
          flex-grow: 1;
          padding: 12px 18px;
          border-radius: 50px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 1rem;
          transition: all 0.2s ease-in-out;
        }
        .chat-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 6px rgba(59,130,246,0.5);
        }
        .chat-send-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 25px;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .chat-send-btn:hover {
          background: #2563eb;
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
