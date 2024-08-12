import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import { useNoteContext } from '@/context/NoteContext';


const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const { notes, setFilteredNotes } = useNoteContext();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);

    const filteredNotes = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery) ||
      note.content.toLowerCase().includes(searchQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
    setFilteredNotes(filteredNotes);
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
