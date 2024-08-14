import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import { FaEdit,FaArrowLeft } from 'react-icons/fa'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import truncate from '@/utils/truncate'

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes } = useNoteContext()

  const note = notes.find(note => note.id === id)

  return (
    <>
     <header className='fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
        <div className='flex items-center'>
          <FaArrowLeft className='mr-2 text-xl cursor-pointer' onClick={() => navigate('/')}/>
          <h1 className='text-xl'>
            {truncate(note?.title || '', 50)}
          </h1>
        </div>
        {note && (
          <FaEdit
            className='cursor-pointer text-xl'
            onClick={() => navigate(`/note/${note.id}`)}
          />
        )}
      </header>
      <main className='mt-8 p-4'>
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
