"use client";
import { Input } from "@/components/ui/input";
import { checkUserAuth } from "@/service/auth.service";
import axios from "axios";
import { ChevronLeft, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatOnline from "../components/chatOnline/ChatOnline";
import Conversation from "../components/conversations/Conversation";
import Message from "../components/message/Message";
import "./messenger.css";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";


const Messenger = () => {
    const [user, setUser] = useState(null);
    // const [conversations, setConversations] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();
    const socket = useRef();
    const [showOptions, setShowOptions] = useState(false);
    const [showNicknameOptions, setShowNicknameOptions] = useState(false);
    const [myNickname, setMyNickname] = useState(null);
    const [friendNickname, setFriendNickname] = useState(null);
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [chatColor, setChatColor] = useState("#30BDFF");
    const [showColorModal, setShowColorModal] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

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

    // Lấy danh sách bạn bè của user
    useEffect(() => {
        if (!user || !user._id) return;

        const getFriends = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/users/mutual-friends/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Danh sách bạn bè:", res.data.data);
                setFriends(res.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách bạn bè:", err);
            }
        };
        getFriends();
    }, [user]);

    // Lấy danh sách hội thoại của user
    // useEffect(() => {
    //     if (!user || !user._id) return;

    //     const getConversations = async () => {
    //         try {
    //             const res = await axios.get(`https://vibely-study-social-web.onrender.com/conversation/${user._id}`);
    //             console.log("📨 Danh sách hội thoại:", res.data);
    //             setConversations(res.data);
    //         } catch (err) {
    //             console.error("❌ Lỗi khi lấy hội thoại:", err);
    //         }
    //     };

    //     getConversations();
    // }, [user]);

    // Lấy tin nhắn khi currentChat thay đổi
    useEffect(() => {
        if (!currentChat || !currentChat._id) return;

        const getMessages = async () => {
            try {
                const res = await axios.get(`${API_URL}/message/${currentChat._id}`);
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
            const res = await axios.post(`${API_URL}/message`, message);
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

    // Tìm kiếm bạn bè
    const searchFriend = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);

        if (value.length === 0) {
            setFilteredFriends([]);
            return;
        }

        const filtered = friends.filter((friend) =>
            friend.username.toLowerCase().includes(value)
        );

        setFilteredFriends(filtered);
    };

    const displayedFriends = searchValue.length > 0 ? filteredFriends : friends;

    const handleOptionClick = async (option) => {
        switch (option) {
            case "changeColor":
                setShowColorModal(true);
                break;
            case "setNickname":
                setShowNicknameModal(true);
                break;
            case "deleteChat":
                setShowDeleteModal(true); // Hiển thị popup xác nhận xóa thay vì window.confirm
                break;
            default:
                break;
        }
        setShowOptions(false);
    };

    // Lấy biệt danh khi conversation hoặc selectedFriend thay đổi
    useEffect(() => {
        const getNicknames = async () => {
            if (!currentChat || !currentChat._id || !selectedFriend || !user) return;

            try {
                // Lấy biệt danh của người bạn đang chat
                const friendNicknameRes = await axios.get(`${API_URL}/conversation/nickname/${currentChat._id}/${selectedFriend._id}`);
                setFriendNickname(friendNicknameRes.data.nickname);

                // Lấy biệt danh của bạn
                const myNicknameRes = await axios.get(`${API_URL}/conversation/nickname/${currentChat._id}/${user._id}`);
                setMyNickname(myNicknameRes.data.nickname);
            } catch (err) {
                console.error("Lỗi khi lấy biệt danh:", err);
            }
        };

        getNicknames();
    }, [currentChat, selectedFriend, user]);

    const setUserNickname = async (userId, username, currentNickname) => {
        const newNickname = prompt(`Đặt biệt danh cho ${username}:`, currentNickname || "");
        if (newNickname !== null) { // Người dùng không nhấn cancel
            try {
                await axios.put(`${API_URL}/conversation/nickname`, {
                    conversationId: currentChat._id,
                    userId: userId,
                    nickname: newNickname,
                });

                // Cập nhật state
                if (userId === user._id) {
                    setMyNickname(newNickname);
                } else {
                    setFriendNickname(newNickname);
                }

                console.log("Đặt biệt danh thành công");
            } catch (err) {
                console.error("Không thể đặt biệt danh:", err);
            }
        }
    };

    const handleDeleteChat = async () => {
        try {
            await axios.delete(`${API_URL}/conversation/${currentChat._id}`);
            setCurrentChat(null);
            setShowDeleteModal(false);
            console.log("Xóa cuộc trò chuyện thành công");
        } catch (err) {
            console.error("Không thể xóa cuộc trò chuyện:", err);
        }
    };

    // Lấy màu khi currentChat thay đổi
    useEffect(() => {
        if (currentChat && currentChat.color) {
            setChatColor(currentChat.color);
            // Áp dụng màu cho CSS
            document.documentElement.style.setProperty('--message-color', currentChat.color);
        } else {
            // Đặt về màu mặc định
            setChatColor("#30BDFF");
            document.documentElement.style.setProperty('--message-color', "#30BDFF");
        }
    }, [currentChat]);

    // Thêm hàm đổi màu
    const changeColor = async (newColor) => {
        try {
            await axios.put(`${API_URL}/conversation/color`, {
                conversationId: currentChat._id,
                color: newColor
            });

            setChatColor(newColor);
            document.documentElement.style.setProperty('--message-color', newColor);

            console.log("Đổi màu đoạn chat thành công");
        } catch (err) {
            console.error("Không thể đổi màu đoạn chat:", err);
        }
        setShowColorModal(false);
    };
    const [openChat, setOpenChat] = useState(window.matchMedia("(min-width: 768px)").matches)   //<md
    return (
        <div className="pt-14 messenger">
            {/* Sidebar danh sách hội thoại */}
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <h1 className="text-xl font-bold mb-6">Đoạn chat</h1>
                    {/* Ô tìm kiếm */}
                    <div className="relative w-full mb-4">
                        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-800" size={20} />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm trên Messenger"
                            className="pl-10 w-full h-10 bg-[#F0F2F5] rounded-full border-none chatMenuInput"
                            style={{ textIndent: "40px" }}
                            value={searchValue}
                            onChange={searchFriend}
                        />
                    </div>
                    <div className="md:hidden w-screen">
                        <div className="p-2 h-[100%]">
                        {user && <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} setSelectedFriend={setSelectedFriend} mode={"mobile"}/>}
                        </div>
                    </div>
                    {/* Danh sách hội thoại */}
                    {displayedFriends.length > 0 ? (
                        displayedFriends.map((friend) => (
                            <button
                                key={friend._id}
                                onClick={async () => {
                                    try {
                                        const res = await axios.post(`${API_URL}/conversation`, {
                                            senderId: user._id,
                                            receiverId: friend._id,
                                        });
                                        setCurrentChat(res.data);
                                        setSelectedFriend(friend);
                                        setOpenChat(true)
                                    } catch (err) {
                                        console.error("Lỗi tạo hoặc lấy hội thoại:", err);
                                    }
                                }}
                                className="w-full text-left"
                            >
                                <Conversation friend={friend} currentChat={currentChat} />
                            </button>
                        ))
                    ) : (
                        <p>Không có bạn bè nào</p>
                    )}
                </div>
            </div>

            <div className="hidden md:block chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ? (
                        <>
                            {/* Hiển thị ảnh + tên người đang chat */}
                            {selectedFriend && (
                                <div className="flex items-center justify-between gap-4 pr-4 pl-0 py-2 border-b border-gray-300">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={selectedFriend.profilePicture || "/images/user_default.jpg"}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="font-medium">
                                            {friendNickname || selectedFriend?.username}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <button onClick={() => setShowOptions(!showOptions)}>
                                            <PiDotsThreeVerticalBold size={25} />
                                        </button>
                                        {showOptions && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                                                <button
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => handleOptionClick("changeColor")}
                                                >
                                                    Đổi màu đoạn chat
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                        onClick={() => {
                                                            handleOptionClick("setNickname");
                                                            setShowNicknameOptions(false);
                                                        }}
                                                    >
                                                        Đặt biệt danh
                                                    </button>

                                                </div>
                                                <button
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => handleOptionClick("deleteChat")}
                                                >
                                                    Xóa đoạn chat
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Danh sách tin nhắn */}
                            <div className="chatBoxTop">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div key={msg._id} ref={scrollRef}>
                                            <Message message={msg} own={msg.sender === user._id} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="">Chưa có tin nhắn nào</p>
                                    </div>
                                )}
                            </div>
                            {/* Gửi tin nhắn */}
                            <div className="chatBoxBottom">
                                <textarea className="chatMessageInput"
                                    placeholder="Aa"
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value={newMessage}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                                ></textarea>
                                <button
                                    onClick={handleSubmit}
                                    className="chatSubmitButton flex items-center justify-center"
                                    style={{ color: chatColor }}
                                >
                                    <IoSend size={24} />
                                </button>
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
            {openChat && (
            <div className="fixed inset-0 z-50 bg-white w-full h-full md:hidden">
                <div className="chatBoxWrapper overflow-y-auto h-[calc(100%-64px)]">

            {/* Hiển thị ảnh + tên người đang chat */}
            {selectedFriend && (
                <div className="flex items-center justify-between gap-4 pr-4 pl-0 py-2 border-b border-gray-300">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden" onClick={() => setOpenChat(false)}>
                            <ChevronLeft size={25} />
                        </button>
                        <img
                            src={selectedFriend.profilePicture || "/images/user_default.jpg"}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">
                            {friendNickname || selectedFriend?.username}
                        </span>
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowOptions(!showOptions)}>
                            <PiDotsThreeVerticalBold size={25} />
                        </button>
                        {showOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleOptionClick("changeColor")}
                                >
                                    Đổi màu đoạn chat
                                </button>
                                <div className="relative">
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            handleOptionClick("setNickname");
                                            setShowNicknameOptions(false);
                                        }}
                                    >
                                        Đặt biệt danh
                                    </button>

                                </div>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleOptionClick("deleteChat")}
                                >
                                    Xóa đoạn chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Danh sách tin nhắn */}
            <div className="chatBoxTop">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg._id} ref={scrollRef}>
                            <Message message={msg} own={msg.sender === user._id} />
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="">Chưa có tin nhắn nào</p>
                    </div>
                )}
            </div>
            {/* Gửi tin nhắn */}
            <div className="chatBoxBottom">
                <textarea className="chatMessageInput"
                    placeholder="Aa"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                ></textarea>
                <button
                    onClick={handleSubmit}
                    className="chatSubmitButton flex items-center justify-center"
                    style={{ color: chatColor }}
                >
                    <IoSend size={24} />
                </button>
            </div>
            </div>
            </div>
            )}
            {/* Danh sách bạn bè online */}
            <div className="hidden md:block chatOnline">
                <div className="chatOnlineWrapper">
                    {user && <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} setSelectedFriend={setSelectedFriend} />}
                </div>
            </div>

            {/* Modal Biệt Danh */}
            {showNicknameModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-[450px] max-w-[90%] overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="relative flex justify-center items-center px-6 py-4 border-b">
                            <h3 className="text-[17px] font-semibold">Biệt danh</h3>
                            <button
                                onClick={() => setShowNicknameModal(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4 mt-2">
                            {/* Bạn */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={user?.profilePicture || "/images/user_default.jpg"}
                                        className="w-10 h-10 rounded-full mr-4 object-cover"
                                        alt={user?.username}
                                    />
                                    <div>
                                        <div className="font-medium">{user?.username}</div>
                                        <div className="text-sm text-gray-500">
                                            {myNickname ? `Biệt danh: ${myNickname}` : "Đặt biệt danh"}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUserNickname(user?._id, user?.username, myNickname)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Người đối thoại */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        src={selectedFriend?.profilePicture || "/images/user_default.jpg"}
                                        className="w-10 h-10 rounded-full mr-4 object-cover"
                                        alt={selectedFriend?.username}
                                    />
                                    <div>
                                        <div className="font-medium">{selectedFriend?.username}</div>
                                        <div className="text-sm text-gray-500">
                                            {friendNickname ? `Biệt danh: ${friendNickname}` : "Đặt biệt danh"}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUserNickname(selectedFriend?._id, selectedFriend?.username, friendNickname)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xác nhận xóa đoạn chat */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-[450px] max-w-[90%] overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="relative flex justify-center items-center px-6 py-4 border-b">
                            <h3 className="text-[17px] font-semibold">Xóa đoạn chat</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            <p className="text-center mb-4">
                                Bạn có chắc chắn muốn xóa đoạn chat này?
                            </p>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDeleteChat}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chọn màu đoạn chat */}
            {showColorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-[450px] max-w-[90%] overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="relative flex justify-center items-center px-6 py-4 border-b">
                            <h3 className="text-[17px] font-semibold">Đổi màu đoạn chat</h3>
                            <button
                                onClick={() => setShowColorModal(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            <p className="text-center mb-4">Chọn màu cho đoạn chat</p>

                            <div className="grid grid-cols-5 gap-4 mt-4">
                                {['#30BDFF', '#E84040', '#096621', '#000000', '#472ECF',
                                    '#FF79C6', '#0551E9', '#FF8357', '#001C44', '#00B22C'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => changeColor(color)}
                                            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
                                            style={{
                                                backgroundColor: color,
                                                border: chatColor === color ? '3px solid #000' : 'none',
                                            }}
                                        >
                                            {chatColor === color && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messenger;
