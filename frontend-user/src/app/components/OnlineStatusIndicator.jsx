"use client";
import { useEffect, useState } from 'react';
import onlineStatusService from '@/service/onlineStatus.service';
import userStore from '@/store/userStore';

const OnlineStatusIndicator = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [onlineUsersCount, setOnlineUsersCount] = useState(0);
    const { user } = userStore();

    useEffect(() => {
        if (!user?.id) return;

        // Kiểm tra trạng thái kết nối
        setIsOnline(onlineStatusService.isConnectedToOnlineStatus());

        // Lắng nghe thay đổi online users
        const unsubscribe = onlineStatusService.onOnlineUsersChange((onlineUsers) => {
            setOnlineUsersCount(onlineUsers.length);
            setIsOnline(onlineStatusService.isConnectedToOnlineStatus());
        });

        // Cập nhật trạng thái ban đầu
        const currentOnlineUsers = onlineStatusService.getCurrentOnlineUsers();
        setOnlineUsersCount(currentOnlineUsers.length);

        return unsubscribe;
    }, [user]);

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border">
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
                {isOnline && (
                    <span className="text-xs text-gray-500">
                        ({onlineUsersCount} người đang online)
                    </span>
                )}
            </div>
        </div>
    );
};

export default OnlineStatusIndicator; 