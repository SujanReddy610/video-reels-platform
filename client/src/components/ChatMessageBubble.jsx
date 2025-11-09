import React from "react";

export default function ChatMessageBubble({ message, currentUserId, adminId }) {
  const isSender = message.senderId === currentUserId;
  const isAdmin = message.senderId === adminId;

  const bubbleClasses = isSender
    ? "self-end bg-gradient-to-br from-orange-400 to-orange-500 text-white"
    : isAdmin
    ? "self-start bg-gradient-to-br from-yellow-200 to-yellow-300 text-gray-900 font-semibold"
    : "self-start bg-gradient-to-br from-green-200 to-green-300 text-gray-800";

  return (
    <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md relative text-sm ${bubbleClasses}`}>
      <div className="font-medium text-[0.75rem] mb-1">
        {message.senderName || "User"}
      </div>
      <div>{message.text || message.message}</div>
      <div className="text-[0.65rem] mt-1 opacity-70 text-right">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
