// src/components/WelcomePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import image from './robot-with-helmet-clipboard.png'
import Layout from '../utilies/Layout';
import NotificationComponent from '../utilies/NotificationComponent';

interface WeatherResponse {
  weather: { description: string }[];
}

const WelcomePage: React.FC = () => {
  const [weather, setWeather] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);

  const messages: string[] = [
    'support constructions!',
    'استمتع باستخدام النظام!',
    'تذكر تسجيل الحضور عند دخولك!',
  ];

  return (
    <Layout>
      <div className="flex flex-col mx-2 h-screen p-4">
        <NotificationComponent />
        <div className="mt-10">
          <img src={image} alt="Animated Robot" className="w-62 h-64" />
        </div>
        <div className="text-3xl font-bold text-atrule">
          <p>{currentMessage}</p>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;
