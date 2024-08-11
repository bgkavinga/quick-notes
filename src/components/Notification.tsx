import React from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 rounded-t-lg shadow-lg z-50">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
};

export default Notification;
