"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
import "./chatPage.css";
import { IoMdClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

const Chatbot = ({ isOpen, onClose }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const messagesEndRef = useRef(null);
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";

    // Set isClient to true after mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Lấy lịch sử chat khi mở popup
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!isClient || !isOpen) return;

            try {
                const token = localStorage.getItem("auth_token");

                const response = await fetch(`${API_URL}/chatbot/history`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.history && data.history.length > 0) {
                        const formattedMessages = [];
                        data.history.slice().reverse().forEach(chat => {
                            chat.history.forEach(msg => {
                                formattedMessages.push({
                                    role: msg.role === 'user' ? 'user' : 'assistant',
                                    content: msg.parts[0].text
                                });
                            });
                        });
                        setMessages(formattedMessages);
                    } else {
                        // Nếu chưa có lịch sử, thêm tin nhắn chào mừng
                        setMessages([
                            { role: "user", content: "Xin chào, chatbot!" },
                            { role: "assistant", content: "Chào bạn! Tôi là trợ lý học tập của Vibely. Tôi có thể giúp gì cho bạn?" }
                        ]);
                    }
                } else {
                    console.error("Failed to fetch history:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử chat:", error);
            }
        };

        fetchChatHistory();
    }, [isOpen, isClient]);

    // Cuộn xuống cuối cùng khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Xử lý gửi tin nhắn
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`${API_URL}/chatbot/handleMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: input.trim(),
                    maxLength: 2000
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("API Error:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorData,
                    headers: Object.fromEntries(response.headers.entries())
                });
                throw new Error(errorData.message || "Không thể nhận câu trả lời từ chatbot");
            }

            const data = await response.json();

            // Thêm câu trả lời vào danh sách tin nhắn
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.message
            }]);

        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Xin lỗi, đã có lỗi xảy ra: ${error.message}. Vui lòng thử lại sau.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý nhấn phím Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Xử lý xóa lịch sử chat
    const handleDeleteHistory = async () => {
        if (!isClient) return;

        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`${API_URL}/chatbot/history`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMessages([
                    { role: "user", content: "Xin chào, chatbot!" },
                    { role: "assistant", content: "Chào bạn! Tôi là trợ lý học tập của Vibely. Tôi có thể giúp gì cho bạn?" }
                ]);
            } else {
                console.error("Failed to delete history:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Lỗi khi xóa lịch sử chat:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-popup">
            <div className="chatbot-header">
                <h3>Chatbot Vibely</h3>
                <div className="header-buttons">
                    <button onClick={handleDeleteHistory} className="delete-button" title="Xóa lịch sử chat">
                        <FaTrash size={20} />
                    </button>
                    <button onClick={onClose} className="close-button">
                        <IoMdClose size={24} />
                    </button>
                </div>
            </div>
            <div className="chatbot-content">
                <div className="chat">
                    {messages.map((message, i) => (
                        <div key={i} className={message.role === "user" ? "userMessage" : "botMessage"}>
                            <Markdown>{message.content}</Markdown>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="inputContainer">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="chatInput"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        className="sendButton"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang gửi..." : "Gửi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;

