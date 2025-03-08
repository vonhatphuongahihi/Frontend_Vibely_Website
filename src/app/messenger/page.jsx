"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./messenger.css";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Conversation from "../components/conversations/Conversation";
import Message from "../components/message/Message";
import ChatOnline from "../components/chatOnline/ChatOnline";
import { checkUserAuth } from "@/service/auth.service";
import {io} from "socket.io-client";

const Messenger = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();
    const socket = useRef();

    // Kết nối socket
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            }); 
        }
        );
      }, []);

    // Thêm tin nhắn mới vào danh sách tin nhắn
    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    // Thêm user vào danh sách online
    useEffect(() => {
        if (user?._id) {  // Dùng optional chaining để tránh lỗi
            socket.current.emit("addUser", user._id);
            socket.current.on("getUsers", (users) => {
                setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
            });
        }
    }, [user]);
    
    

    // Kiểm tra xác thực người dùng
    useEffect(() => {
        checkUserAuth().then((res) => {
            if (!res.isAuthenticated) {
                window.location.href = "/user-login";
            } else {
                console.log("✅ User logged in:", res.user);
                setUser(res.user);
            }
        });
    }, []);

    // Lấy danh sách hội thoại của user
    useEffect(() => {
        if (!user || !user._id) return;

        const getConversations = async () => {
            try {
                console.log(`📞 Gọi API: http://localhost:8080/conversation/${user._id}`);
                const res = await axios.get(`http://localhost:8080/conversation/${user._id}`);
                console.log("📨 Danh sách hội thoại:", res.data);
                setConversations(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy hội thoại:", err);
            }
        };

        getConversations();
    }, [user]);
 
    // Lấy tin nhắn khi currentChat thay đổi
    useEffect(() => {
        if (!currentChat || !currentChat._id) return;

        const getMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/message/${currentChat._id}`);
                setMessages(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy tin nhắn:", err);
            }
        };

        getMessages();
    }, [currentChat]);

    // Log để kiểm tra state thay đổi
    useEffect(() => {
        console.log("🔄 Cập nhật CurrentChat:", currentChat);
    }, [currentChat]);

    // Gửi tin nhắn mới
    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        // Gửi tin nhắn qua socket
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId: currentChat.members.find((member) => member !== user._id),
            text: newMessage,
        });


        try {
            const res = await axios.post("http://localhost:8080/message", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.error("❌ Lỗi khi gửi tin nhắn:", err);
        }
    };


    // Nhận tin nhắn từ socket
    useEffect(() => {
        socket.current.on("getMessage", (data) => {
            setMessages([...messages, data]);
        }
        );
    }, [messages]);


    // Cuộn xuống cuối cùng khi có tin nhắn mới
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="pt-14 messenger">
            {/* Sidebar danh sách hội thoại */}
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    {/* Ô tìm kiếm */}
                    <div className="relative w-full max-w-[300px] md:max-w-[400px] mb-4">
                        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-800" size={20} />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm trên Messenger"
                            className="pl-10 w-40 md:w-64 h-10 bg-[#F0F2F5] rounded-full border-none chatMenuInput"
                            style={{ textIndent: "40px" }}
                        />
                    </div>
                    
                    {/* Danh sách hội thoại */}
                    {conversations.length > 0 ? (
                        conversations.map((conv) => (
                            <button
                                key={conv._id} 
                                onClick={() => {
                                    console.log("👉 Chọn hội thoại:", conv);
                                    setCurrentChat(conv);
                                }}
                                className="w-full text-left"
                            >
                                <Conversation conversation={conv} currentUser={user} />
                            </button>
                        ))
                    ) : (
                        <p>Không có hội thoại nào</p>
                    )}
                </div>
            </div>

            {/* Khung chat */}
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ? (
                        <>
                            <div className="chatBoxTop">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div ref={scrollRef}>
                                            <Message key={msg._id} message={msg} own={msg.sender === user._id} />
                                        </div>
                                    ))
                                ) : (
                                    <p>Chưa có tin nhắn nào</p>
                                )}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea className="chatMessageInput" 
                                          placeholder="Aa"
                                          onChange={(e) => setNewMessage(e.target.value)}
                                          value={newMessage}
                                ></textarea>
                                <img src="images/send.png" alt="send" onClick={handleSubmit} className="chatSubmitButton" />
                            </div>
                        </>
                    ) : (
                        <div className="noConversationContainer">
                            <img src="images/dog_study_1.png" className="chatImage" />
                            <span className="noConversationText">
                                Bắt đầu trò chuyện thảo luận học tập cùng bạn bè!
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Danh sách bạn bè online */}
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                {user && <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />}
                </div>
            </div>
        </div>
    );
};

export default Messenger;
