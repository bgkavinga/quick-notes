import React, { useCallback } from 'react';
import { MdEditNote,MdLink } from "react-icons/md";
import SearchBox from './SearchBox'; // Import the SearchBox component
import { useNavigate } from 'react-router-dom';
import { useNoteContext } from '@/context/NoteContext';
import StorageUtil from '@/utils/storageUtil';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { notes, setNotes,setFilteredNotes, allTags,setNotification,setAllTags } = useNoteContext()
  const onAddClick = useCallback(() => {
    navigate(`/note`);
  },[]);

  const onAddLinkClick = async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = tab.url
    const title = tab.title || '';
    const contentHtml = `<a href='${url}' target='_blank' >${title}</a>`;
    const newNote = { id:String(Date.now()), title:title || '', content:contentHtml || '', tags:['html'] };
    const updatedNotes =  [...notes, newNote];

    const updatedTags = [...new Set([...allTags, ...newNote.tags])];
    setNotes(updatedNotes);

    setFilteredNotes(updatedNotes);
    setAllTags(updatedTags);
    StorageUtil.setItem('notes',updatedNotes);
    setNotification('Link saved successfully!'); // Set notification
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center z-50">
      <div className="flex-grow">
        <SearchBox />
      </div>
      <button
        onClick={onAddClick}
        className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1 ml-4"
      >
        <MdEditNote  />
      </button>
      <button
        onClick={onAddLinkClick}
        className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1 ml-4"
      >
        <MdLink />
      </button>
    </header>
  );
};

export default Header;
