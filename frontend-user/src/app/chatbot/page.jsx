"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import "./chatPage.css";


const Chatbot = () => {
    const [input, setInput] = useState(""); // Trạng thái nhập liệu
    const [messages, setMessages] = useState([
        { role: "user", parts: [{ text: "Xin chào, chatbot!" }] },
        { role: "bot", parts: [{ text: "Chào bạn! Tôi có thể giúp gì cho bạn?" }] },
    ]);

    // Xử lý gửi tin nhắn
    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages([...messages, { role: "user", parts: [{ text: input }] }]);
        setInput(""); // Xóa ô nhập sau khi gửi
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
                </div>

                {/* Ô nhập tin nhắn */}
                <div className="inputContainer">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="chatInput"
                    />
                    <button onClick={sendMessage} className="sendButton">Gửi</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
