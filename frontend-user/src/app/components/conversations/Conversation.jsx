import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const friendIds = conversation.members.filter((m) => m !== currentUser._id);

    const getUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://localhost:8080/users/get-users",
          { userIds: friendIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFriends(res.data.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
      }
    };

    if (friendIds.length > 0) getUsers();
  }, [currentUser, conversation]);

  return (
    <div>
      {friends.map((user) => (
        <div className="conversation" key={user._id}>
          <img
            className="conversationImg"
            src={user.profilePicture || "/images/user_default.jpg"}
            alt={user.username}
          />
          <span className="conversationName">{user.username}</span>
        </div>
      ))}
    </div>
  );
}
