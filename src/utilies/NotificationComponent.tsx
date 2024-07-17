// NotificationComponent.tsx
import React, { useEffect, useState } from 'react';

interface Notification {
    title: string;
    description: string;
}

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);


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
