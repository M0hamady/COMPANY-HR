import React, { useEffect, useState } from 'react';

interface Notification {
    title: string;
    description: string;
}

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        checkPermissionAndShowNotification();
    }, []);

    const checkPermissionAndShowNotification = async () => {
        let permission = Notification.permission;
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted') {
            if (firstTime) {
                showWelcomeNotification();
                setFirstTime(false);
            } else {
                showRegularNotification();
            }
        } else {
            console.log('Permission not granted for notifications.');
        }
    };

    const showWelcomeNotification = () => {
        const welcomeNotification: Notification = {
            title: 'Welcome to Support Constructions!',
            description: 'We are excited to have you on board. Feel free to explore our services.',
        };

        const updatedNotifications = [...notifications, welcomeNotification];
        setNotifications(updatedNotifications);

        displayNotification(welcomeNotification.title, welcomeNotification.description);
    };

    const showRegularNotification = () => {
        const regularNotification: Notification = {
            title: 'New Notification',
            description: 'This is a regular notification message.',
        };

        const updatedNotifications = [...notifications, regularNotification];
        setNotifications(updatedNotifications);

        displayNotification(regularNotification.title, regularNotification.description);
    };

    const displayNotification = (title: string, body: string) => {
        if ('Notification' in window) {
            new Notification(title, { body });
        }
    };

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
