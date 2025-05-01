"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import "./chatPage.css";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "user", parts: [{ text: "Xin chào, chatbot!" }] },
        { role: "bot", parts: [{ text: "Chào bạn! Tôi có thể giúp gì cho bạn?" }] },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

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

        const userMessage = { role: "user", parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                setMessages(prev => [...prev, {
                    role: "bot",
                    parts: [{ text: "Bạn cần đăng nhập để sử dụng chatbot. Vui lòng đăng nhập và thử lại." }]
                }]);
                setIsLoading(false);
                return;
            }

            // Nếu chưa có chatId, tạo cuộc hội thoại mới
            if (!chatId) {
                const response = await fetch(`${API_URL}/chatbot`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ text: input })
                });

                if (!response.ok) {
                    throw new Error("Không thể tạo cuộc hội thoại mới");
                }

                const data = await response.json();
                setChatId(data._id);
            } else {
                // Nếu đã có chatId, thêm câu hỏi vào cuộc hội thoại hiện tại
                const response = await fetch(`${API_URL}/chatbot/${chatId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ question: input })
                });

                if (!response.ok) {
                    throw new Error("Không thể gửi câu hỏi");
                }
            }

            // Hiển thị tin nhắn "đang nhập" từ bot
            setMessages(prev => [...prev, {
                role: "bot",
                parts: [{ text: "Đang xử lý..." }]
            }]);

            // Gọi API chatbot để nhận câu trả lời
            const chatbotResponse = await fetch(`${API_URL}/chatbot/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: input,
                    userId: localStorage.getItem("userId"),
                    chatId: chatId
                })
            });

            if (!chatbotResponse.ok) {
                throw new Error("Không thể nhận câu trả lời từ chatbot");
            }

            // Xử lý phản hồi dạng stream
            const reader = chatbotResponse.body.getReader();
            let botResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Chuyển đổi Uint8Array thành text
                const text = new TextDecoder().decode(value);
                botResponse += text;

                // Cập nhật tin nhắn "đang nhập" với nội dung mới
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        role: "bot",
                        parts: [{ text: botResponse }]
                    };
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            setMessages(prev => [...prev, {
                role: "bot",
                parts: [{ text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." }]
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

    return (
        <div className="chatPage">
            <div className="wrapper">
                <div className="chat">
                    {messages.map((message, i) => (
                        <div key={i}>
                            {message.img && (
                                <IKImage
                                    urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_KIT_ENDPOINT}
                                    path={message.img}
                                    height="300"
                                    width="400"
                                    transformation={[{ height: 300, width: 400 }]}
                                    loading="lazy"
                                    lqip={{ active: true, quality: 20 }}
                                />
                            )}
                            <div className={message.role === "user" ? "userMessage" : "botMessage"}>
                                <Markdown>{message.parts[0].text}</Markdown>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Ô nhập tin nhắn */}
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
