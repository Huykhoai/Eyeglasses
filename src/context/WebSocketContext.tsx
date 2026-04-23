import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from "./AuthContext";
import { useNotification } from "@/components/ui/Notification/NotificationContext";
import { NotificationTitleEnum, StatusNotification, type NotificationEnumType } from "@/utils/NotificationEnum";
import { useQueryClient } from "@tanstack/react-query";
const url = import.meta.env.VITE_API_URL;
interface WebSocketContextType {
    client: Client | null;
    isConnected: boolean;
}
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    const queryClient = useQueryClient();
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
                setClient(null);
                setIsConnected(false);
            }
            return;
        }

        const token = localStorage.getItem("token");
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${url}/ws`),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = () => {
            setIsConnected(true);

            stompClient.subscribe('/topic/notifications', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    const title = NotificationTitleEnum[data.type as NotificationEnumType] || 'Thông báo hệ thống';
                    const status = StatusNotification[data.type as NotificationEnumType] || 'info';
                    showNotification(
                        status,
                        data.message || 'Bạn có thông báo mới',
                        title
                    );
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                } catch (error) {
                    showNotification('error', message.body, 'Thông báo');
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                }
            });

            stompClient.subscribe('/user/queue/notifications', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    const title = NotificationTitleEnum[data.type as NotificationEnumType] || 'Thông báo hệ thống';
                    const status = StatusNotification[data.type as NotificationEnumType] || 'info';
                    showNotification(
                        status,
                        data.message || 'Thông báo riêng cho bạn',
                        title
                    );
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                } catch (error) {
                    showNotification('error', message.body, 'Tin nhắn cá nhân');
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                }
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Lỗi STOMP Broker:', frame.headers['message']);
            console.error('Chi tiết lỗi:', frame.body);
        };

        stompClient.onWebSocketError = (event) => {
            console.error('Lỗi WebSocket cơ bản:', event);
        };

        stompClient.onDisconnect = () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        };

        stompClient.activate();
        clientRef.current = stompClient;
        setClient(stompClient);

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [isAuthenticated, showNotification, queryClient]);

    return (
        <WebSocketContext.Provider value={{ client, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
}