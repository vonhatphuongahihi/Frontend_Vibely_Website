'use client'
import Loader from "@/lib/Loader";
import { checkUserAuth, handleSocialCallback, logout } from "@/service/auth.service";
import onlineStatusService from "@/service/onlineStatus.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import Header from "./components/Header";
import OnlineStatusIndicator from "./components/OnlineStatusIndicator";

export default function AuthWrapper({ children }) {
    const { setUser, clearUser, user } = userStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const socketRef = useRef(null);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    const publicPages = ["/user-login", "/forgot-password", "/reset-password"];
    const isPublicPage = publicPages.some((publicPath) => pathname.startsWith(publicPath));

    // Xử lý callback từ social login
    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const username = searchParams.get('username');
        const error = searchParams.get('error');

        if (token && userId && email && username) {
            handleSocialCallback(token, userId, email, username)
                .then(() => {
                    router.push('/');
                })
                .catch((error) => {
                    console.error('Lỗi xử lý callback:', error);
                    toast.error('Đăng nhập thất bại: ' + (error.message || 'Lỗi không xác định'));
                    router.push('/user-login');
                });
        } else if (error) {
            console.error('Lỗi đăng nhập:', error);
            toast.error('Đăng nhập thất bại: ' + error);
            router.push('/user-login');
        }
    }, [searchParams, router]);

    const connectSocket = (userId) => {
        if (userId && !socketRef.current) {
            socketRef.current = io(API_URL);
            window.socket = socketRef.current;

            socketRef.current.emit("addUser", userId);

            socketRef.current.on("getUsers", (users) => {
                console.log("Received online users:", users);
            });

        }
    };

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
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error("Không tìm thấy token");
                }

                const result = await checkUserAuth();

                if (result.isAuthenticated) {
                    setUser(result.user);
                    setIsAuthenticated(true);
                    
                    // Tự động kết nối online status khi user đã xác thực
                    if (result.user?.id && !onlineStatusService.isConnectedToOnlineStatus()) {
                        onlineStatusService.connect(result.user.id);
                    }
                    
                    // connectSocket(result.user.id);
                } else {
                    throw new Error("Không xác thực được");
                }
            } catch (error) {
                console.error("Lỗi xác thực:", error);
                await handleLogout();
            } finally {
                setLoading(false);
            }
        };

        const handleLogout = async () => {
            try {
                await logout();
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                clearUser();
                setIsAuthenticated(false);
                disconnectSocket();
                onlineStatusService.disconnect(); // Ngắt kết nối online status
                localStorage.removeItem("auth_token");
                if (!isPublicPage) {
                    router.push("/user-login");
                }
            }
        };

        if (!isPublicPage) {
            checkAuth();
        } else {
            setLoading(false);
        }

        return () => {
            disconnectSocket();
        };
    }, [isPublicPage, router, setUser, clearUser]);

    useEffect(() => {
        if (user?.id && !socketRef.current) {
            // connectSocket(user.id);
        }
    }, [user]);

    // Xử lý sự kiện khi user thoát khỏi trang/đóng tab
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Ngắt kết nối online status khi user đóng tab/thoát trang
            onlineStatusService.disconnect();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && user?.id) {
                // Trang bị ẩn (user chuyển tab khác hoặc minimize)
                // Có thể xem xét ngắt kết nối sau một khoảng thời gian
            } else if (document.visibilityState === 'visible' && user?.id) {
                // Trang được hiển thị lại, kết nối lại nếu chưa kết nối
                if (!onlineStatusService.isConnectedToOnlineStatus()) {
                    onlineStatusService.connect(user.id);
                }
            }
        };

        // Lắng nghe sự kiện beforeunload để ngắt kết nối khi đóng trang
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Lắng nghe sự kiện visibilitychange để xử lý khi user chuyển tab
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            onlineStatusService.disconnect();
        };
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {isAuthenticated && !isPublicPage && <Header />}
            {children}
            {/* Hiển thị indicator online status cho development/testing */}
            {/* {isAuthenticated && !isPublicPage && <OnlineStatusIndicator />} */}
        </>
    );
}
