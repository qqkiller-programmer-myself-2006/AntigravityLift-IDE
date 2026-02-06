// Graviton IDE - Notifications System
// Toast notifications and progress indicators

import { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { Icons } from "../icons";

export interface Notification {
    id: string;
    type: "info" | "success" | "warning" | "error";
    title: string;
    message?: string;
    duration?: number; // 0 = persistent
    progress?: number; // 0-100 for progress bar
    actions?: { label: string; onClick: () => void }[];
}

interface NotificationContextValue {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id">) => string;
    removeNotification: (id: string) => void;
    updateNotification: (id: string, updates: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, "id">) => {
        const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification = { ...notification, id };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto-remove after duration
        if (notification.duration !== 0) {
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, notification.duration || 5000);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
        );
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification, updateNotification }}
        >
            {children}
            <NotificationContainer notifications={notifications} onDismiss={removeNotification} />
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
}

// Toast Container Component
function NotificationContainer({
    notifications,
    onDismiss,
}: {
    notifications: Notification[];
    onDismiss: (id: string) => void;
}) {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-16 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {notifications.map((notification) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => onDismiss(notification.id)}
                />
            ))}
        </div>
    );
}

// Individual Toast Component
function NotificationToast({
    notification,
    onDismiss,
}: {
    notification: Notification;
    onDismiss: () => void;
}) {
    const iconMap = {
        info: <Icons.info className="w-5 h-5 text-blue-400" />,
        success: <Icons.check className="w-5 h-5 text-green-400" />,
        warning: <Icons.warning className="w-5 h-5 text-yellow-400" />,
        error: <Icons.close className="w-5 h-5 text-red-400" />,
    };

    const bgMap = {
        info: "border-blue-500/30",
        success: "border-green-500/30",
        warning: "border-yellow-500/30",
        error: "border-red-500/30",
    };

    return (
        <div
            className={`bg-graviton-bg-secondary border ${bgMap[notification.type]} rounded-lg shadow-xl p-4 animate-slide-in`}
        >
            <div className="flex items-start gap-3">
                {iconMap[notification.type]}
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-graviton-text-primary">
                        {notification.title}
                    </div>
                    {notification.message && (
                        <div className="text-[12px] text-graviton-text-muted mt-1">
                            {notification.message}
                        </div>
                    )}
                    {notification.progress !== undefined && (
                        <div className="mt-2 h-1.5 bg-graviton-bg-tertiary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-graviton-accent-primary transition-all duration-300"
                                style={{ width: `${notification.progress}%` }}
                            />
                        </div>
                    )}
                    {notification.actions && notification.actions.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {notification.actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className="px-3 py-1 text-[11px] bg-graviton-accent-primary text-white rounded hover:brightness-110"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                >
                    <Icons.close className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default NotificationProvider;
