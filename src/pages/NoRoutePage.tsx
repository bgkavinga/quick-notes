// NoRoutePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const NoRoutePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Page Not Found</h1>
      <button
        onClick={() => navigate('/')}
        className="flex items-center bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </button>
    </div>
  );
};

export default NoRoutePage;