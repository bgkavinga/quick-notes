import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setQuery(newValue);
    onSearch(newValue);
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      <FaSearch className="text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search notes..."
        className="border border-gray-300 rounded px-2 py-1 w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBox;
