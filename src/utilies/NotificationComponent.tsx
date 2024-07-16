// NotificationComponent.tsx
import React, { useEffect, useState } from 'react';

interface Notification {
    title: string;
    description: string;
}

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const userId = 'YOUR_USER_ID'; // Replace with the actual user ID

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${1}/`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newNotification: Notification = {
                title: data.title,
                description: data.description,
            };
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
            // Use device notification API to present the notification
            new Notification(newNotification.title, { body: newNotification.description });
        };

        return () => {
            socket.close();
        };
    }, [userId]);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        <h3>{notification.title}</h3>
                        <p>{notification.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
