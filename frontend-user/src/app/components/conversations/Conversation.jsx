import "./conversation.css";

export default function Conversation({ friend, currentChat, lastMessage, unread }) {
  const isActive = currentChat?.members?.includes(friend.id);

  // Debug logging
  console.log("🖼️ Conversation avatar debug:", {
    friendData: friend,
    profilePicture: friend?.profilePicture,
    username: friend?.username,
    hasProfilePicture: !!friend?.profilePicture
  });

  // Đoạn hội thoại
  return (
    <div>
      <div
        className={`conversation ${isActive ? "bg-[#CDE8FF]" : "hover:bg-[#E8F4FF]"} ${unread ? "bg-blue-100 font-bold" : ""}`}
        key={friend?.id}
        style={{ display: "flex", alignItems: "center", padding: 6, position: "relative" }}
      >
        <img
          className="conversationImg"
          src={friend?.profilePicture || "/images/user_default.jpg"}
          alt={friend?.username || "User"}
          onLoad={() => console.log("✅ Avatar loaded successfully:", friend?.profilePicture)}
          onError={(e) => {
            console.log("❌ Avatar failed to load:", friend?.profilePicture);
            console.log("Setting fallback image");
            e.target.src = "/images/user_default.jpg";
          }}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "10px",
            backgroundColor: "#f0f0f0", // Fallback background color
            border: "1px solid #ddd" // Border để thấy rõ vị trí ảnh
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 4 }}>
          <span className="conversationName" style={{ fontWeight: unread ? 700 : 600 }}>
            {friend?.username || "Unknown User"}
            {unread && <span style={{ color: '#2196f3', marginLeft: 6, fontSize: 18 }}>•</span>}
          </span>
          {lastMessage && (
            <span
              className="conversationLastMessage text-gray-500 text-xs truncate max-w-[180px]"
              style={{ marginTop: 2, fontWeight: unread ? 600 : 400, color: unread ? '#222' : undefined }}
            >
              {lastMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
