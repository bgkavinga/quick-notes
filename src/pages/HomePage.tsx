import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import {FaTrash, FaEdit } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MarkdownRenderer from '@/components/MarkdownRenderer'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { notes, filteredNotes, allTags, setFilteredNotes } =
    useNoteContext()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleNoteClick = (id: string) => {
    navigate(`/note/${id}`)
  }

  const handleTagClick = (tag: string) => {
    let updatedSelectedTags
    if (selectedTags.includes(tag)) {
      updatedSelectedTags = selectedTags.filter(t => t !== tag)
    } else {
      updatedSelectedTags = [...selectedTags, tag]
    }
    setSelectedTags(updatedSelectedTags)

    if (updatedSelectedTags.length === 0) {
      setFilteredNotes(notes)
    } else {
      const filtered = notes.filter(note =>
        updatedSelectedTags.some(t => note.tags.includes(t))
      )
      setFilteredNotes(filtered)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    navigate(`/note-delete/${noteId}`)
  }

  const titleClickHandler = (id: string) => {
    navigate(`/note-detail/${id}`);
  };

  return (
    <>
      <Header />
      <div className='tags-container bg-gray-100 border-b border-gray-300 mt-12'>
        {allTags.length > 0 && (
          <div className='tags-list p-2'>
            <ul className='flex flex-wrap space-x-2'>
              {allTags.map(tag => (
                <li
                  key={tag}
                  className={`tag-item px-3 py-1 rounded cursor-pointer transition-colors duration-300 ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <main className='p-2 mb-12'>
        {filteredNotes.length === 0 ? (
          <p className='text-gray-600 text-lg'>No notes available</p>
        ) : (
          <ul className='space-y-2'>
            {filteredNotes.map(note => (
              <li
                key={note.id}
                className='note-item bg-white rounded-lg shadow '
              >
                <div className='relative group'>
                  <h1 onClick = {() => titleClickHandler(note.id)} className='text-lg font-bold bg-gray-200 text-gray-800 p-2 rounded cursor-pointer'>
                    {note.title ? note.title : 'Untitled'}
                  </h1>
                </div>
                <MarkdownRenderer content={note.content}/ >
                <div className='tags-list flex justify-between items-center mt-2'>
                  <ul className='flex flex-wrap p-2'>
                    {note.tags && note.tags.map(tag => (
                      <li
                        key={tag}
                        className='tag-item px-3 py-1 rounded bg-gray-200 text-gray-800'
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className='flex space-x-4 p-2'>
                    <FaEdit
                      className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 text-lg'
                      onClick={() => handleNoteClick(note.id)}
                    />
                    <FaTrash
                      className='cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-300 text-lg'
                      onClick={() => handleDeleteNote(note.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}

export default HomePage
