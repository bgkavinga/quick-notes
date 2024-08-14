import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import { FaEdit } from 'react-icons/fa'
import MarkdownRenderer from '@/components/MarkdownRenderer'

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes } = useNoteContext()

  const note = notes.find(note => note.id === id)

  return (
    <>
      <header className='fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
        <h1 className='text-xl flex items-center'>
          {note?.title}
          {note && (
            <FaEdit
              className='ml-2 cursor-pointer'
              onClick={() => navigate(`/note/${note.id}`)}
            />
          )}
        </h1>
        <div>
          <button
            onClick={() => navigate('/')}
            className='bg-gray-700 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded mr-2'
          >
            Back
          </button>
        </div>
      </header>
      <main className='mt-16 p-4'>
        {note ? (
          <div>
            <MarkdownRenderer content={note.content} />
          </div>
        ) : (
          <div>
            <h2 className='text-2xl font-bold mb-4'>New Note</h2>
            <p>No note selected.</p>
          </div>
        )}
      </main>
    </>
  )
}

export default NoteDetailPage
