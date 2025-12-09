import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Client } from '@stomp/stompjs'; // Dùng thư viện mới
import SockJS from 'sockjs-client';       // Dùng SockJS để tương thích BE
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated, user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Dùng useRef để giữ kết nối không bị reset mỗi lần render
    const clientRef = useRef(null);

    // 1. Load thông báo cũ từ API
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated, token]);

    // 2. Kết nối WebSocket (Sử dụng @stomp/stompjs + SockJS)
    useEffect(() => {
        if (isAuthenticated && user?.email && token) {

            // Tạo client Stomp
            const stompClient = new Client({
                // ⭐ QUAN TRỌNG: Dùng webSocketFactory để nhúng SockJS
                // Không dùng brokerURL ở đây vì SockJS dùng HTTP URL
                webSocketFactory: () => {
                    return new SockJS(`${API_BASE_URL}/ws?token=${token}`);
                },

                // Cấu hình tự động kết nối lại
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,

                // Callback khi kết nối thành công
                onConnect: (frame) => {
                    console.log('✅ Connected to WebSocket via SockJS!');

                    // Subscribe kênh riêng tư
                    stompClient.subscribe('/user/queue/notifications', (message) => {
                        if (message.body) {
                            const newNoti = JSON.parse(message.body);
                            handleNewNotification(newNoti);
                        }
                    });
                },

                // Callback khi có lỗi
                onStompError: (frame) => {
                    console.error('❌ Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },

                // Debug log (tùy chọn, tắt đi cho gọn console)
                // debug: (str) => { console.log(str); },
            });

            // Kích hoạt kết nối
            stompClient.activate();
            clientRef.current = stompClient;

            // Cleanup khi unmount hoặc token thay đổi
            return () => {
                if (stompClient) {
                    stompClient.deactivate();
                }
            };
        }
    }, [isAuthenticated, user, token]); // Chạy lại khi token thay đổi

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNewNotification = (newNoti) => {
        setNotifications(prev => [newNoti, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        // Prevent API call if there's nothing to mark
        if (unreadCount === 0) return;

        try {
            // Call the new backend endpoint
            await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the UI state
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);