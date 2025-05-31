"use client";
import { Input } from "@/components/ui/input";
import { checkUserAuth } from "@/service/auth.service";
import axios from "axios";
import { ChevronLeft, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import ChatOnline from "../components/chatOnline/ChatOnline";
import Conversation from "../components/conversations/Conversation";
import LeftSideBar from "../components/LeftSideBar";
import Message from "../components/message/Message";
import "./messenger.css";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


const Messenger = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
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
    const stompClient = useRef(null);
    const [showOptions, setShowOptions] = useState(false);
    const [showNicknameOptions, setShowNicknameOptions] = useState(false);
    const [myNickname, setMyNickname] = useState(null);
    const [friendNickname, setFriendNickname] = useState(null);
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [chatColor, setChatColor] = useState("#30BDFF");
    const [showColorModal, setShowColorModal] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
    const [isViewingChat, setIsViewingChat] = useState(false);
    const [openChat, setOpenChat] = useState(false);

    // Khởi tạo STOMP khi user đã có
    useEffect(() => {
        if (!user) return;
        const socketUrl = `${API_URL.replace(/\/$/, '')}/ws`;
        stompClient.current = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP connected');
                if (user?.id) {
                    stompClient.current.publish({
                        destination: '/app/chat.addUser',
                        body: JSON.stringify({ userId: user.id })
                    });
                }
                // Lắng nghe tin nhắn mới
                stompClient.current.subscribe(`/user/${user.id}/queue/messages`, (message) => {
                    const data = JSON.parse(message.body);
                    setMessages(prev => [...prev, data]);
                });
                // Lắng nghe sự kiện đã đọc
                stompClient.current.subscribe(`/user/${user.id}/queue/read`, (message) => {
                    const { messageId, userId } = JSON.parse(message.body);
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === messageId
                                ? {
                                    ...msg,
                                    readBy: [...(msg.readBy || []), userId],
                                    isRead: true
                                }
                                : msg
                        )
                    );
                });
                // Thông báo user online (nếu cần)
                stompClient.current.subscribe(`/user/${user.id}/queue/users`, (message) => {
                    const users = JSON.parse(message.body);
                    console.log("Messenger received online users:", users);
                    if (user.followings && Array.isArray(user.followings)) {
                        setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
                    } else {
                        setOnlineUsers([]);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message'], frame.body);
            },
        });
        stompClient.current.activate();
        return () => {
            if (stompClient.current) stompClient.current.deactivate();
        };
    }, [user, API_URL]);

   

    // Kiểm tra xác thực người dùng
    useEffect(() => {
        checkUserAuth().then((res) => {
            if (!res.isAuthenticated) {
                window.location.href = "/user-login";
            } else {
                setUser(res.user);
                console.log("user after checkUserAuth:", res.user); // DEBUG LOG
            }
        });
    }, []);

    // Lấy danh sách bạn bè của user
    useEffect(() => {
        if (!user || !user.id) return;

        const getFriends = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const res = await axios.get(`${API_URL}/users/mutual-friends/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFriends(res.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách bạn bè:", err);
            }
        };
        getFriends();
    }, [user]);

    // Lấy tin nhắn khi currentChat thay đổi
    useEffect(() => {
        if (!currentChat || !currentChat.id) return;

        const getMessages = async () => {
            try {
                const res = await axios.get(`${API_URL}/messages/conversation/${currentChat.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                setMessages(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy tin nhắn:", err);
            }
        };

        getMessages();
    }, [currentChat]);

    // Lấy danh sách hội thoại của user
    useEffect(() => {
        console.log("user in conversations useEffect:", user); // DEBUG LOG
        if (!user || !user.id) return;
        const getConversations = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const res = await axios.get(`${API_URL}/conversations/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Conversations from backend:", res.data);
                // Sort conversations trước khi set
                const sorted = (res.data || []).slice().sort((a, b) => {
                    console.log("Comparing:", {
                        a: a.lastMessageTime,
                        b: b.lastMessageTime,
                        aDate: new Date(a.lastMessageTime || 0),
                        bDate: new Date(b.lastMessageTime || 0)
                    });
                    return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
                });
                console.log("Sorted conversations:", sorted);
                setConversations(sorted);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách hội thoại:", err);
            }
        };
        getConversations();
    }, [user]);

    // Khi có tin nhắn mới, cập nhật lại conversations
    useEffect(() => {
        if (!arrivalMessage || !arrivalMessage.conversationId) return;
        console.log("New message arrived:", arrivalMessage);
        setConversations(prev => {
            const updated = prev.map(conv => {
                if (conv.id === arrivalMessage.conversationId) {
                    return {
                        ...conv,
                        lastMessage: arrivalMessage.content,
                        lastMessageTime: arrivalMessage.createdAt
                    };
                }
                return conv;
            });
            // Sort lại
            const sorted = updated.slice().sort((a, b) => {
                console.log("Re-sorting after new message:", {
                    a: a.lastMessageTime,
                    b: b.lastMessageTime
                });
                return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
            });
            console.log("Updated conversations after new message:", sorted);
            return sorted;
        });
    }, [arrivalMessage]);

    // Gửi tin nhắn
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            senderId: user.id,
            content: newMessage,
            conversationId: currentChat.id,
        };
        try {
            const res = await axios.post(`${API_URL}/messages`, message, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage("");
            // Gửi realtime qua STOMP
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.publish({
                    destination: '/app/chat.sendMessage',
                    body: JSON.stringify({
                        senderId: user.id,
                        receiverId: currentChat.members.find(member => member !== user.id),
                        ...res.data
                    })
                });
            } else {
                console.error("STOMP not connected - message sent but real-time update failed");
            }
            // Tự động load lại danh sách hội thoại
            fetchConversations(user.id);
        } catch (err) {
            console.error("❌ Lỗi khi gửi tin nhắn:", err);
        }
    };

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

        // Debug logging
        console.log("🔍 Searching for:", value);
        console.log("📞 Available conversations:", conversations);
        
        // Lọc friends
        const filtered = friends.filter((friend) =>
            friend.username.toLowerCase().includes(value)
        );

        setFilteredFriends(filtered);
        
        // Debug kết quả lọc conversations
        const filteredConvs = conversations.filter(c => {
            if (c.membersData && Array.isArray(c.membersData)) {
                const friend = c.membersData.find(m => m.id !== user?.id);
                if (friend) {
                    const matches = friend.username?.toLowerCase().includes(value);
                    console.log(`👤 ${friend.username} matches "${value}":`, matches);
                    return matches;
                }
            }
            return false;
        });
        
        console.log("✅ Filtered conversations:", filteredConvs);
    };

    const displayedFriends = searchValue.length > 0 ? filteredFriends : friends;

    // Tạo danh sách hiển thị kết hợp friends và conversations
    const createCombinedList = () => {
        if (!friends || !user) return [];
        
        // Tạo Set để track những friend đã có conversation
        const friendsWithConversation = new Set();
        
        // Map conversations thành định dạng chuẩn
        const conversationItems = conversations.map(conv => {
            let friend = {};
            if (conv.membersData) {
                friend = conv.membersData.find(m => m.id !== user.id) || {};
            } else if (conv.members) {
                const friendId = conv.members.find(id => id !== user.id);
                const friendFromList = friends.find(f => f.id === friendId);
                friend = friendFromList || { id: friendId, username: `User ${friendId}` };
            }
            
            // Track friend này đã có conversation
            if (friend.id) {
                friendsWithConversation.add(friend.id);
            }
            
            return {
                type: 'conversation',
                id: conv.id,
                friend: friend,
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                unread: !!conv.unread,
                conversationData: conv
            };
        });
        
        // Tạo items cho những friends chưa có conversation
        const friendsWithoutConversation = friends
            .filter(friend => !friendsWithConversation.has(friend.id))
            .map(friend => ({
                type: 'friend',
                id: `friend-${friend.id}`,
                friend: friend,
                lastMessage: null,
                lastMessageTime: null,
                unread: false,
                conversationData: null
            }));
        
        // Kết hợp và sắp xếp
        const combined = [...conversationItems, ...friendsWithoutConversation];
        
        // Sắp xếp: conversations có tin nhắn lên đầu (theo thời gian), friends không có conversation cuối
        return combined.sort((a, b) => {
            // Nếu cả hai đều có lastMessageTime, sắp xếp theo thời gian
            if (a.lastMessageTime && b.lastMessageTime) {
                return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
            }
            // Nếu chỉ a có lastMessageTime, a lên trước
            if (a.lastMessageTime && !b.lastMessageTime) {
                return -1;
            }
            // Nếu chỉ b có lastMessageTime, b lên trước
            if (!a.lastMessageTime && b.lastMessageTime) {
                return 1;
            }
            // Nếu cả hai đều không có lastMessageTime, sắp xếp theo tên
            return (a.friend.username || '').localeCompare(b.friend.username || '');
        });
    };

    // Áp dụng filter tìm kiếm nếu có
    const getDisplayedItems = () => {
        const combinedList = createCombinedList();
        
        if (searchValue.length > 0) {
            return combinedList.filter(item => {
                const friendName = item.friend?.username || '';
                return friendName.toLowerCase().includes(searchValue.toLowerCase());
            });
        }
        
        return combinedList;
    };

    const displayedItems = getDisplayedItems();

    // Sắp xếp hội thoại theo lastMessageTime giảm dần (giữ lại code cũ để backup)
    const displayedConversations = (searchValue.length > 0 ?
        conversations.filter(c => {
            // Lọc conversation theo tên của member (không phải current user)
            if (c.membersData && Array.isArray(c.membersData)) {
                // Tìm friend trong conversation (không phải current user)
                const friend = c.membersData.find(m => m.id !== user?.id);
                if (friend) {
                    return friend.username?.toLowerCase().includes(searchValue.toLowerCase());
                }
            }
            // Fallback: nếu không có membersData, không hiển thị trong kết quả tìm kiếm
            return false;
        }) :
        conversations
    ).slice().sort((a, b) => {
        console.log("Sorting displayed conversations:", {
            a: a.lastMessageTime,
            b: b.lastMessageTime
        });
        return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
    });

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
            if (!currentChat || !currentChat.id || !selectedFriend || !user) return;

            try {
                const friendNicknameRes = await axios.get(`${API_URL}/conversations/nickname/${currentChat.id}/${selectedFriend.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                setFriendNickname(friendNicknameRes.data.nickname);

                const myNicknameRes = await axios.get(`${API_URL}/conversation/nickname/${currentChat.id}/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                setMyNickname(myNicknameRes.data.nickname);
            } catch (err) {
                console.error("Lỗi khi lấy biệt danh:", err);
            }
        };

        getNicknames();
    }, [currentChat, selectedFriend, user]);

    const setUserNickname = async (userId, username, currentNickname) => {
        const newNickname = prompt(`Đặt biệt danh cho ${username}:`, currentNickname || "");
        if (newNickname !== null) {
            try {
                await axios.put(`${API_URL}/conversations/nickname`, {
                    conversationId: currentChat.id,
                    userId: userId,
                    nickname: newNickname,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });

                if (userId === user.id) {
                    setMyNickname(newNickname);
                } else {
                    setFriendNickname(newNickname);
                }
            } catch (err) {
                console.error("Không thể đặt biệt danh:", err);
            }
        }
    };

    const handleDeleteChat = async () => {
        try {
            await axios.delete(`${API_URL}/conversations/${currentChat.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setCurrentChat(null);
            setShowDeleteModal(false);
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
            await axios.put(`${API_URL}/conversations/color`, {
                conversationId: currentChat.id,
                color: newColor
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            setChatColor(newColor);
            document.documentElement.style.setProperty('--message-color', newColor);
        } catch (err) {
            console.error("Không thể đổi màu đoạn chat:", err);
        }
        setShowColorModal(false);
    };

    const markMessagesAsRead = async () => {
        if (!currentChat || !user) return;

        try {
            const unreadMessages = messages.filter(msg =>
                msg.senderId !== user.id && !msg.readBy?.includes(user.id)
            );

            for (const msg of unreadMessages) {
                try {
                    await axios.post(`${API_URL}/messages/read`, {
                        messageId: msg.id,
                        userId: user.id
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    });

                    setMessages(prev => prev.map(m =>
                        m.id === msg.id
                            ? {
                                ...m,
                                readBy: [...(m.readBy || []), user.id],
                                isRead: true
                            }
                            : m
                    ));
                } catch (err) {
                    console.error(`Lỗi khi đánh dấu tin nhắn ${msg.id} đã đọc:`, err);
                }
            }
        } catch (err) {
            console.error("Lỗi khi đánh dấu tin nhắn đã đọc:", err);
        }
    };

    useEffect(() => {
        if (!currentChat || !messages.length || !user) return;

        // Đánh dấu đã đọc khi người dùng đang xem chat
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                markMessagesAsRead();
            }
        };

        // Đánh dấu đã đọc khi component mount và có tin nhắn
        markMessagesAsRead();

        // Theo dõi khi user switch tab/window
        document.addEventListener('visibilitychange', handleVisibility);

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [currentChat, messages, user]);

    // Thêm hàm này ở ngoài useEffect
    const fetchConversations = async (userId) => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await axios.get(`${API_URL}/conversations/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Sort conversations trước khi set
            const sorted = (res.data || []).slice().sort((a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0));
            setConversations(sorted);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách hội thoại:", err);
        }
    };

    useEffect(() => {
        if (!user || !user.id) return;
        fetchConversations(user.id);
    }, [user]);

    return (
        <div className="pt-14 messenger">
            <div className="md:hidden">
                <LeftSideBar />
            </div>
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
                            {user && <ChatOnline onlineUsers={onlineUsers} currentId={user.id} setCurrentChat={setCurrentChat} setSelectedFriend={setSelectedFriend} mode={"mobile"} />}
                        </div>
                    </div>
                    {/* Danh sách hội thoại */}
                    {displayedItems.length > 0 ? (
                        displayedItems.map((item) => {
                            if (item.type === 'conversation') {
                                return (
                                    <button
                                        key={item.id}
                                        onClick={async () => {
                                            try {
                                                setCurrentChat(item.conversationData);
                                                setSelectedFriend(item.friend);
                                                setOpenChat(true);
                                                await markMessagesAsRead();
                                            } catch (err) {
                                                console.error("Lỗi khi chọn hội thoại:", err);
                                            }
                                        }}
                                        className="w-full text-left"
                                    >
                                        <Conversation friend={item.friend} currentChat={currentChat} lastMessage={item.lastMessage} unread={item.unread} />
                                    </button>
                                );
                            } else if (item.type === 'friend') {
                                // Hiển thị friend chưa có conversation
                                return (
                                    <button
                                        key={item.id}
                                        onClick={async () => {
                                            try {
                                                // Tạo hoặc lấy conversation giữa user và friend
                                                const res = await axios.post(`${API_URL}/conversation`, {
                                                    senderId: user.id,
                                                    receiverId: item.friend.id,
                                                });
                                                
                                                setCurrentChat(res.data);
                                                setSelectedFriend(item.friend);
                                                setOpenChat(true);
                                                
                                                // Refresh lại danh sách conversations
                                                fetchConversations(user.id);
                                            } catch (err) {
                                                console.error("Lỗi khi tạo hội thoại mới:", err);
                                            }
                                        }}
                                        className="w-full text-left"
                                    >
                                        <Conversation friend={item.friend} currentChat={currentChat} lastMessage={null} unread={false} />
                                    </button>
                                );
                            }
                            return null;
                        })
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
                                    messages.map((msg) => {
                                        // Tìm user info từ currentChat.membersData dựa trên senderId
                                        let senderInfo = null;
                                        if (currentChat?.membersData && msg.senderId) {
                                            senderInfo = currentChat.membersData.find(member => member.id === msg.senderId);
                                        }
                                        
                                        return (
                                            <div key={msg.id} ref={scrollRef} data-message-id={msg.id}>
                                                <Message 
                                                    message={msg} 
                                                    own={msg.senderId === user.id} 
                                                    senderInfo={senderInfo}
                                                />
                                            </div>
                                        );
                                    })
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
                                    <button className="md:hidden" onClick={() => {
                                        setOpenChat(false)
                                        setCurrentChat(null)
                                    }}>
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
                                messages.map((msg) => {
                                    // Tìm user info từ currentChat.membersData dựa trên senderId
                                    let senderInfo = null;
                                    if (currentChat?.membersData && msg.senderId) {
                                        senderInfo = currentChat.membersData.find(member => member.id === msg.senderId);
                                    }
                                    
                                    return (
                                        <div key={msg.id} ref={scrollRef}>
                                            <Message 
                                                message={msg} 
                                                own={msg.senderId === user.id} 
                                                senderInfo={senderInfo}
                                            />
                                        </div>
                                    );
                                })
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
                    {user && <ChatOnline onlineUsers={onlineUsers} currentId={user.id} setCurrentChat={setCurrentChat} setSelectedFriend={setSelectedFriend} />}
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
                                    onClick={() => setUserNickname(user?.id, user?.username, myNickname)}
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
                                    onClick={() => setUserNickname(selectedFriend?.id, selectedFriend?.username, friendNickname)}
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
