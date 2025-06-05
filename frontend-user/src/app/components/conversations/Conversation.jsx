import "./conversation.css";
import { useState } from "react";

export default function Conversation({ friend, currentChat, lastMessage, unread }) {
  const isActive = currentChat?.members?.includes(friend?.id);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = "/images/user_default.jpg";
  };

  // Đoạn hội thoại
  return (
    <div>
      <div
        className={`conversation ${isActive ? "bg-[#CDE8FF]" : "hover:bg-[#E8F4FF]"} ${unread ? "bg-blue-100 font-bold" : ""}`}
        key={friend?.id}
        style={{ display: "flex", alignItems: "center", padding: 6, position: "relative" }}
      >
        <div style={{
          width: "50px",
          height: "50px",
          marginRight: "10px",
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: imageError ? "#ff6b6b" : "#f0f0f0", // Đỏ nếu lỗi, xám nếu bình thường
          border: `2px solid ${imageLoaded ? "#4caf50" : "#ddd"}`, // Xanh nếu load thành công
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}>
          <img
            src={friend?.profilePicture || "/images/user_default.jpg"}
            alt={friend?.username || "User"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: imageLoaded ? 1 : 0.7
            }}
          />
          {/* Debug overlay */}
          {!imageLoaded && !imageError && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "10px",
              color: "#666",
              textAlign: "center"
            }}>
              Loading...
            </div>
          )}
          {imageError && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "8px",
              color: "#fff",
              textAlign: "center",
              background: "rgba(0,0,0,0.5)",
              padding: "2px",
              borderRadius: "2px"
            }}>
              Error
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 4, flex: 1 }}>
          <span className="conversationName" style={{ fontWeight: unread ? 700 : 600 }}>
            {friend?.username || "Unknown User"}
            {unread && <span style={{ color: '#2196f3', marginLeft: 6, fontSize: 18 }}>•</span>}
          </span>
          {lastMessage ? (
            <span
              className="conversationLastMessage text-gray-500 text-xs truncate max-w-[180px]"
              style={{ marginTop: 2, fontWeight: unread ? 600 : 400, color: unread ? '#222' : undefined }}
            >
              {lastMessage}
            </span>
          ) : (
            <span
              className="conversationLastMessage text-gray-400 text-xs truncate max-w-[180px]"
              style={{ marginTop: 2, fontStyle: 'italic' }}
            >
              Nhấn để bắt đầu trò chuyện
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
