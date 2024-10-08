import React, { useCallback } from 'react'
import { FaPlus, FaLink } from 'react-icons/fa'
import SearchBox from './SearchBox' // Import the SearchBox component
import { useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import useNoteManager from '@/hooks/useNoteManager'

const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const { notes } = useNoteContext()
  const onAddClick = useCallback(() => {
    navigate(`/note-update`)
  }, [])
  const { saveNote } = useNoteManager()
  const excludeTags = ['context']

  const onAddLinkClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = tab.url
    const title = tab.title || ''

    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(title.toLowerCase())
    )
    if (filtered.length > 0) {
      const firstFilteredNote = filtered[0]
      navigate(`/note-update/${firstFilteredNote.id}`)
    } else {
      const contentHtml = `[${title}](${url})`
      const newNote = {
        title: title || '',
        content: contentHtml || '',
        tags: []
      }
      const savedNote = await saveNote(newNote)
      navigate(`/note-update/${savedNote?.id}`)
    }
  }

  return (
    <header className='top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 space-x-4 shadow-md flex items-center z-50'>
      <div className='flex-grow'>
        <SearchBox excludeTags={excludeTags} />
      </div>
      <button
        onClick={onAddClick}
        className='flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
        title="Click to add a new note"
      >
        <FaPlus />
      </button>
      <button
        onClick={onAddLinkClick}
        className='flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
        title="Click to create note with current tab link"
      >
        <FaLink  />
      </button>
    </header>
  )
}

export default SearchBar
