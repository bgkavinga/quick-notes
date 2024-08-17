import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import { useNoteContext } from '@/context/NoteContext';
import useSearchManager from '@/hooks/useSearchManager';


const SearchBox: React.FC = () => {
  const { searchQuery,setSearchQuery } = useNoteContext();
  const {search} = useSearchManager()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    search(e.target.value)
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      <FaSearch className="text-xl text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search notes..."
        className="border border-gray-300 rounded px-2 py-1 w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBox;
