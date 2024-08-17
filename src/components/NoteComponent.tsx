import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaEdit, FaCopy,FaEye } from 'react-icons/fa'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import truncate from '@/utils/truncate'
import { Note, useNoteContext } from '@/context/NoteContext'
import useSearchManager from '@/hooks/useSearchManager'
import useNotificationManager from '@/hooks/useNotificationManager'

const NoteComponent: React.FC<Note> = note => {
  const navigate = useNavigate()
  const { selectedTags } = useNoteContext()
  const { handleTagClick } = useSearchManager()
  const { setNotification } = useNotificationManager()

  const handleCopyNote = (content: string) => {
    navigator.clipboard.writeText(content)
    setNotification('content copied to the clipboard')
  }

  return (
    <>
      <div className='relative group'>
        <div className='flex items-center bg-slate-200 text-gray-800 justify-between'>
          <h1 className='text-lg font-bold p-2 cursor-pointer flex-grow'>
            {note.title ? truncate(note.title || '', 50) : 'Untitled'}
          </h1>
          <div className='flex space-x-4 p-2 ml-2'>
            <FaEdit
              className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-update/${note.id}`)}
            />
            <FaEye
              className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-detail/${note.id}`)}
            />
            <FaCopy
              className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 text-lg'
              onClick={() => handleCopyNote(note.content)}
            />
            <FaTrash
              className='cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-300 text-lg'
              onClick={() =>  navigate(`/note-delete/${note.id}`)}
            />
          </div>
        </div>
      </div>

      <MarkdownRenderer content={note.content} />
      <div className='tags-list flex justify-between items-center mt-2'>
        <ul className='flex flex-wrap p-2 space-x-2'>
          {note.tags &&
            note.tags.map(tag => (
              <li
                key={tag}
                className={`tag-item px-3 py-1 mt-1 cursor-pointer transition-colors duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default NoteComponent
