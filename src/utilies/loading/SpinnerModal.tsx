import React, { useEffect, useState } from 'react';

type SpinnerModalProps = {
  show: boolean;
  message: string;
  type?: 'default' | 'warn' | 'alarm'; // Added type prop
};

const SpinnerModal: React.FC<SpinnerModalProps> = ({ show, message, type = 'default' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const getModalClasses = () => {
    switch (type) {
      case 'default':
        return 'text-4xl text-red-600'; // Large and red for default
      case 'warn':
        return 'text-lg text-yellow-600'; // Smaller and yellow for warn
      case 'alarm':
        return 'text-lg text-red-600'; // Smaller and red for alarm
      default:
        return 'text-4xl text-red-600'; // Default to large and red
    }
  };

  return (
    <div className={`fixed inset-0 ${isVisible ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mb-4 mx-auto"></div>
          <p className={`font-bold ${getModalClasses()} mb-2`}>{message}</p>
            <p className="text-sm text-gray-600">يرجى عدم مغادرة الصفحة أو قفل الهاتف حتى الانتهاء</p>
        </div>
      </div>
    </div>
  );
};

export default SpinnerModal;
