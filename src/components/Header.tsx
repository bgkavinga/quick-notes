import React, { useCallback } from 'react'
import { FaPlus, FaLink } from 'react-icons/fa'
import SearchBox from './SearchBox' // Import the SearchBox component
import { useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import useNoteManager from '@/hooks/useNoteManager'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { notes } = useNoteContext()
  const onAddClick = useCallback(() => {
    navigate(`/note-update`)
  }, [])
  const { saveNote } = useNoteManager()

  const onAddLinkClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = tab.url
    const title = tab.title || ''

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(title.toLowerCase())
    )
    if (filtered.length > 0) {
      const firstFilteredNote = filtered[0]
      navigate(`/note-detail/${firstFilteredNote.id}`)
    } else {
      const contentHtml = `[${title}](${url})`
      const newNote = {
        title: title || '',
        content: contentHtml || '',
        tags: []
      }
      saveNote(newNote)
      navigate('/')
    }
  }

  return (
    <header className='fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center z-50'>
      <div className='flex-grow'>
        <SearchBox />
      </div>
      <button
        onClick={onAddClick}
        className='bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1 ml-4'
      >
        <FaPlus className='text-xl cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 ' />
      </button>
      <button
        onClick={onAddLinkClick}
        className='bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1 ml-4'
      >
        <FaLink className='text-xl cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 ' />
      </button>
    </header>
  )
}

export default Header
