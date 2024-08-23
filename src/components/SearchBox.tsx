import React,{useRef,useEffect} from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import { useNoteContext } from '@/context/NoteContext';
import useSearchManager from '@/hooks/useSearchManager';
interface SearchBoxProps {
  query?: string
  tags?: string[]
  excludeTags?:string[]
}


const SearchBox: React.FC<SearchBoxProps> = ({ query, tags,excludeTags }) => {
  const { searchQuery,setSearchQuery,selectedTags } = useNoteContext();
  const {search} = useSearchManager()
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    const mergedTags = tags ? [...tags, ...selectedTags] : selectedTags
    if (query){
      return search(e.target.value + query, mergedTags, excludeTags)
    }
    search(e.target.value, mergedTags, excludeTags)
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex items-center space-x-2 w-full">
      <FaSearch className="text-xl text-gray-400" />
      <input
        ref={inputRef}
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
