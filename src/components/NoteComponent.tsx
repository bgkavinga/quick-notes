import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaEdit, FaCopy, FaEye, FaTimes } from 'react-icons/fa'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { Note, useNoteContext } from '@/context/NoteContext'
import useSearchManager from '@/hooks/useSearchManager'
import useNotificationManager from '@/hooks/useNotificationManager'
import useNoteManager from '@/hooks/useNoteManager'

const NoteComponent: React.FC<Note> = note => {
  const navigate = useNavigate()
  const { selectedTags } = useNoteContext()
  const { handleTagClick, generateTagStyles } = useSearchManager()
  const { setNotification } = useNotificationManager()
  const { saveNote } = useNoteManager()

  const handleCopyNote = (content: string) => {
    navigator.clipboard.writeText(content)
    setNotification('content copied to the clipboard')
  }

  const handleRemoveTag = (tagName: string) => {
    saveNote({ ...note, tags: note.tags.filter(tag => tag !== tagName) })
    setNotification(`Tag "${tagName}" removed successfully!`)
  }

  return (
    <>
      <div className='relative group'>
        <div className='flex w-full items-center bg-slate-200 text-gray-800 justify-between'>
          <div className='w-4/5'>
            <h1
              className='text-sm font-bold p-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
              onClick={() => navigate(`/note-detail/${note.id}`)}
            >
              {note.title ? note.title : 'Untitled'}
            </h1>
          </div>
          <div className='flex space-x-4 p-2 mr-2 w-1/5'>
            <FaEdit
              className='cursor-pointer text-yellow-400 hover:text-yellow-600 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-update/${note.id}`)}
            />
            <FaEye
              className='cursor-pointer text-blue-400 hover:text-blue-600 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-detail/${note.id}`)}
            />
            <FaCopy
              className='cursor-pointer text-teal-400 hover:text-teal-600 transition-colors duration-300 text-lg'
              onClick={() => handleCopyNote(note.content)}
            />
            <FaTrash
              className='cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-delete/${note.id}`)}
            />
          </div>
        </div>
      </div>

      <MarkdownRenderer content={note.content} />
      <div className='tags-list flex justify-between items-center mt-2'>
        <ul className='flex flex-wrap p-2 space-x-2'>
          {note.tags &&
            note.tags.map(
              tag =>
                tag != 'context' && (
                  <li
                    key={tag}
                    className={`text-sm tag-item px-3 py-1 mt-1 cursor-pointer transition-colors duration-300 ${
                      selectedTags.includes(tag)
                        ? generateTagStyles({ name: tag }, true)
                        : generateTagStyles({ name: tag }, false)
                    }`}
                  >
                    <span
                      className='inline-flex items-center text-sm font-medium'
                      key={tag}
                    >
                      <a onClick={() => handleTagClick(tag)}> {tag} </a>
                      <FaTimes
                        className='ml-2 cursor-pointer text-red-500 bg-gray-200 hover:text-red-700 transition-colors duration-300'
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </span>
                  </li>
                )
            )}
        </ul>
      </div>
    </>
  )
}

export default NoteComponent
