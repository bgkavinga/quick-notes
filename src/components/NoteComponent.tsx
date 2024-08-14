import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaEdit } from 'react-icons/fa'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import truncate from '@/utils/truncate'
import { Note } from '@/context/NoteContext'

const NoteComponent: React.FC<Note> = note => {
  const navigate = useNavigate()

  const handleNoteClick = (id: string) => {
    navigate(`/note/${id}`)
  }

  const handleDeleteNote = (noteId: string) => {
    navigate(`/note-delete/${noteId}`)
  }

  const titleClickHandler = (id: string) => {
    navigate(`/note-detail/${id}`)
  }

  return (
    <>
      <div className='relative group'>
        <div className='flex items-center bg-slate-200 text-gray-800 justify-between'>
          <h1
            onClick={() => titleClickHandler(note.id)}
            className='text-lg font-bold p-2 cursor-pointer flex-grow'
          >
            {note.title ? truncate(note.title || '', 50) : 'Untitled'}
          </h1>
          <div className='flex space-x-2 p-2 ml-2'>
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
      </div>

      <MarkdownRenderer content={note.content} />
      <div className='tags-list flex justify-between items-center mt-2'>
        <ul className='flex flex-wrap p-2'>
          {note.tags &&
            note.tags.map(tag => (
              <li
                key={tag}
                className='tag-item px-3 py-1 rounded bg-gray-200 text-gray-800'
              >
                {tag}
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default NoteComponent
