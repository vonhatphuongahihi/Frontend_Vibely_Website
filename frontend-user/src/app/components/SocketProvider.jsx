"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    useEffect(() => {
        // Kiểm tra user từ localStorage hoặc state management của bạn
        const checkUser = async () => {
            try {
                const response = await fetch(`${API_URL}/users/check-auth`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.isAuthenticated) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            }
        };

        checkUser();
    }, [API_URL]);

    useEffect(() => {
        if (user?._id && !socket) {
            const newSocket = io(API_URL);
            setSocket(newSocket);
            window.socket = newSocket;

            newSocket.emit("addUser", user._id);

            return () => {
                newSocket.disconnect();
                window.socket = null;
                setSocket(null);
            };
        }
    }, [user, API_URL]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}; 