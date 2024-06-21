import React, { useState, useEffect } from 'react';

interface LoadingProps {
  messages?: string[];
}

const Loading: React.FC<LoadingProps> = ({ messages = ['الرجاء الانتظار...', 'جاري طلب البيانات...', 'جاري تحضير البيانات...'] }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center animate-scale-up">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-700 animate-fade-in-up">{messages[currentMessageIndex]}</p>
      </div>
    </div>
  );
};

export default Loading;