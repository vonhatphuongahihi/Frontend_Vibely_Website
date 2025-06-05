import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class OnlineStatusService {
    constructor() {
        this.stompClient = null;
        this.userId = null;
        this.API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.isConnected = false;
        this.onlineUsersCallbacks = new Set(); // Callback functions để thông báo khi online users thay đổi
        this.currentOnlineUsers = [];
    }

    // Kết nối và đánh dấu user online
    connect(userId) {
        if (this.stompClient && this.isConnected) {
            console.log('Already connected to STOMP');
            return;
        }

        this.userId = userId;
        const socketUrl = `${this.API_URL.replace(/\/$/, '')}/ws`;
        
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Online Status STOMP connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Đánh dấu user online
                this.addUserOnline(userId);
                
                // Subscribe để lắng nghe danh sách online users
                this.subscribeToOnlineUsers(userId);
                
                // Setup heartbeat để duy trì kết nối
                this.setupHeartbeat();
            },
            onStompError: (frame) => {
                console.error('Online Status STOMP error:', frame.headers['message'], frame.body);
                this.isConnected = false;
            },
            onDisconnect: () => {
                console.log('Online Status STOMP disconnected');
                this.isConnected = false;
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                this.isConnected = false;
                this.handleReconnect();
            }
        });

        this.stompClient.activate();
    }

    // Đánh dấu user online
    addUserOnline(userId) {
        if (this.stompClient && this.isConnected) {
            this.stompClient.publish({
                destination: '/app/chat.addUser',
                body: JSON.stringify({ userId: userId })
            });
            // console.log(`User ${userId} marked as online`);
        }
    }

    // Subscribe để lắng nghe danh sách online users
    subscribeToOnlineUsers(userId) {
        if (this.stompClient && this.isConnected) {
            this.stompClient.subscribe(`/user/${userId}/queue/users`, (message) => {
                const users = JSON.parse(message.body);
                // console.log("OnlineStatusService received online users:", users);
                
                // Chuyển đổi users thành array userId nếu cần
                let onlineUserIds = users;
                if (users.length > 0 && typeof users[0] === 'object' && users[0].userId) {
                    onlineUserIds = users.map(u => u.userId);
                }
                
                this.currentOnlineUsers = onlineUserIds;
                
                // Thông báo cho các callback functions
                this.onlineUsersCallbacks.forEach(callback => {
                    try {
                        callback(onlineUserIds);
                    } catch (error) {
                        console.error('Error calling online users callback:', error);
                    }
                });
            });
        }
    }

    // Đăng ký callback để nhận thông báo khi online users thay đổi
    onOnlineUsersChange(callback) {
        this.onlineUsersCallbacks.add(callback);
        
        // Gọi callback với dữ liệu hiện tại nếu có
        if (this.currentOnlineUsers.length > 0) {
            callback(this.currentOnlineUsers);
        }
        
        // Trả về function để hủy đăng ký
        return () => {
            this.onlineUsersCallbacks.delete(callback);
        };
    }

    // Lấy danh sách online users hiện tại
    getCurrentOnlineUsers() {
        return this.currentOnlineUsers;
    }

    // Ngắt kết nối và đánh dấu user offline
    disconnect() {
        if (this.stompClient) {
            try {
                console.log(`Disconnecting user ${this.userId} from online status`);
                this.isConnected = false;
                this.stompClient.deactivate();
                this.stompClient = null;
                this.currentOnlineUsers = [];
                // Clear tất cả callbacks
                this.onlineUsersCallbacks.clear();
            } catch (error) {
                console.error('Error disconnecting STOMP:', error);
            }
        }
    }

    // Xử lý reconnect
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect(this.userId);
            }, 5000 * this.reconnectAttempts);
        }
    }

    // Setup heartbeat để duy trì kết nối
    setupHeartbeat() {
        setInterval(() => {
            if (this.stompClient && this.isConnected && this.userId) {
                this.addUserOnline(this.userId);
            }
        }, 30000); // Ping mỗi 30 giây
    }

    // Kiểm tra trạng thái kết nối
    isConnectedToOnlineStatus() {
        return this.isConnected && this.stompClient;
    }
}

// Tạo instance singleton
const onlineStatusService = new OnlineStatusService();

export default onlineStatusService; 