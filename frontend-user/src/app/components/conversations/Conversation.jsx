import "./conversation.css";

export default function Conversation({ friend, currentChat, lastMessage }) {
  const isActive = currentChat?.members?.includes(friend.id);

  // Đoạn hội thoại
  return (
    <div>
      <div
        className={`conversation ${isActive ? "bg-[#CDE8FF]" : "hover:bg-[#E8F4FF]"}`}
        key={friend?.id}
        style={{ display: "flex", alignItems: "center", padding: 6 }}
      >
        <img
          className="conversationImg"
          src={friend?.profilePicture || "/images/user_default.jpg"}
          alt={friend?.username}
        />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 4 }}>
          <span className="conversationName" style={{ fontWeight: 600 }}>
            {friend?.username}
          </span>
          {lastMessage && (
            <span
              className="conversationLastMessage text-gray-500 text-xs truncate max-w-[180px]"
              style={{ marginTop: 2 }}
            >
              {lastMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
