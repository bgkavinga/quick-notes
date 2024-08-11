import React from 'react';
import { FaPlus } from 'react-icons/fa'; // Import the FaPlus icon
import SearchBox from './SearchBox'; // Import the SearchBox component

interface HeaderProps {
  onAddClick: () => void;
  onSearch: (query: string) => void; // Add onSearch prop
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onSearch }) => {
  return (
    <header className="bg-gray-800 text-white py-2 px-4 shadow-md flex items-center">
      <div className="flex-grow">
        <SearchBox onSearch={onSearch} /> {/* Add SearchBox */}
      </div>
      <button
        onClick={onAddClick}
        className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1 ml-4"
      >
        <FaPlus className="text-lg" />
        <span className="text-sm">Add</span>
      </button>
    </header>
  );
};

export default Header;
