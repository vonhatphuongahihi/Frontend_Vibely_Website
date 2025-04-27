'use client';
import Loader from "@/lib/Loader";
import { checkUserAuth, logout } from "@/service/auth.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import { io } from "socket.io-client";

export default function AuthWrapper({ children }) {
    const { setUser, clearUser, user } = userStore();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const socketRef = useRef(null);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    const publicPages = ["/user-login", "/forgot-password", "/reset-password"];
    const isPublicPage = publicPages.includes(pathname);

    // Lấy trạng thái vừa đăng ký từ query
    const justRegistered = router.query?.justRegistered === "true";

    // Hàm kết nối socket
    const connectSocket = (userId) => {
        if (userId && !socketRef.current) {
            socketRef.current = io(API_URL);
            window.socket = socketRef.current;

            socketRef.current.emit("addUser", userId);

            socketRef.current.on("getUsers", (users) => {
                console.log("Received online users:", users);
            });

            console.log("Socket connected for user:", userId);
        }
    };

    // Hàm ngắt kết nối socket
    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            window.socket = null;
            console.log("Socket disconnected");
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await checkUserAuth();
                if (result.isAuthenticated) {
                    setUser(result?.user);
                    setIsAuthenticated(true);

                    connectSocket(result.user._id);
                } else {
                    await handleLogout();
                }
            } catch (error) {
                console.error("Đăng nhập thất bại", error);
                await handleLogout();
            } finally {
                setLoading(false);
            }
        };

        const handleLogout = async () => {
            clearUser();
            setIsAuthenticated(false);

            disconnectSocket();

            try {
                await logout();
            } catch (error) {
                console.log("Đăng xuất thất bại. Vui lòng thử lại sau", error);
            }
            if (!isPublicPage) {
                router.push("/user-login");
            }
        };

        if (!isPublicPage && !justRegistered) {
            checkAuth();
        } else {
            setLoading(false);
        }

        return () => {
            disconnectSocket();
        };
    }, [isPublicPage, justRegistered, router, setUser, clearUser]);

    useEffect(() => {
        if (user?._id && !socketRef.current) {
            connectSocket(user._id);
        }
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {isAuthenticated && !isPublicPage && <Header />}
            {children}
        </>
    );
}