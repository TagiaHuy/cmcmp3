// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthToken } from '../utils/auth';
import http from '../utils/http';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

// The backend's STOMP endpoint is at /ws
const BASE_SOCKET_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/ws` : 'http://localhost:8080/ws';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);

  const unreadCount = React.useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      stompClientRef.current?.deactivate();
      setNotifications([]);
      return;
    }

    const fetchInitialNotifications = async () => {
      try {
        const response = await http.get('/api/me/notifications');
        setNotifications(response || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      }
    };

    fetchInitialNotifications();

    // Append token as a query parameter for the SockJS handshake
    const socketUrlWithToken = `${BASE_SOCKET_URL}?token=${token}`;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrlWithToken),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        setIsConnected(true);
        console.log('STOMP connected');
        client.subscribe('/user/queue/notifications', (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications(prev => [newNotification, ...prev]);
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('STOMP disconnected');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [getAuthToken]);


  // --- 3. Actions ---
  const markAsRead = useCallback(async (notificationIdsToMark) => {
    const originalNotifications = [...notifications];
    setNotifications(prev =>
      prev.map(n =>
        notificationIdsToMark.includes(n.id) ? { ...n, read: true } : n
      )
    );

    try {
      await http.post('/api/notifications/read', {
        notificationIds: notificationIdsToMark
      });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      setNotifications(originalNotifications); // Revert on failure
    }
  }, [notifications]);
  
  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [notifications, markAsRead]);


  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
