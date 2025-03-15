import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ Lỗi: Không tìm thấy token");
          return;
        }

        const res = await axios.get(`http://localhost:8080/users/mutual-friends/${currentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API Response:", res.data);
        setFriends(res.data.data || []);
      } catch (error) {
        console.error("❌ Lỗi lấy danh sách bạn bè:", error.response?.data || error.message);
      }
    };

    if (currentId) getFriends();
  }, [currentId]);

  useEffect(() => {
    if (friends.length > 0 && onlineUsers.length > 0) {
      const onlineOnly = friends.filter((friend) => onlineUsers.includes(friend._id));
      setOnlineFriends(onlineOnly);
    } else {
      setOnlineFriends([]); // Nếu không có ai online, danh sách sẽ rỗng
    }
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try{
      const res = await axios.get(`http://localhost:8080/conversation/find/${currentId}/${user._id}`);
      setCurrentChat(res.data);
    }
    catch(err){
      console.error("❌ Lỗi khi tạo hoặc lấy cuộc trò chuyện:", err);
    }
  }

  return (
    <div className="chatOnline">
      {onlineFriends.length > 0 ? (
        <>
          <div className="chatOnlineTitle">Bạn bè online</div>
          {onlineFriends.map((online) => (
            <div className="chatOnlineFriend" key={online._id} onClick={()=>{handleClick(online)}}>
              <div className="chatOnlineImgContainer">
                <img className="chatOnlineImg" src={online.profilePicture || "images/user_default.jpg"} alt={online.username} />
                <div className="chatOnlineBadge"></div>
              </div>
              <span className="chatOnlineName">{online.username}</span>
            </div>
          ))}
        </>
      ) : (
        <p>Không có bạn bè nào đang online</p>
      )}
    </div>
  );
}
