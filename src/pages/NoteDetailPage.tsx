import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import { FaCopy,FaEdit } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes } = useNoteContext()

  const note = notes.find(note => note.id === id)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
    //   setNotification('Code copied to clipboard!')
    })
  }

  const renderers: {
    [key: string]: React.FC<{
      node: React.ReactNode
      inline?: boolean
      className?: string
      children?: React.ReactNode
    }>
  } = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const code = String(children).replace(/\n$/, '')
      return !inline && match ? (
        <div className='relative'>
          <code>{code}</code>
          <button
            onClick={() => handleCopy(code)}
            className='copy-button absolute right-2 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300 hover:bg-blue-700'
          >
            <FaCopy className='inline-block' />
          </button>
        </div>
      ) : (
        <code className={`${className} p-4 rounded`} {...props}>
          {code}
        </code>
      )
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50">
        <h1 className="text-xl flex items-center">
          {note?.title}
          {note && (
            <FaEdit className="ml-2 cursor-pointer" onClick={() => navigate(`/note/${note.id}`)} />
          )}
        </h1>
        <div>
          <button
            onClick={() => navigate('/')} 
            className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded mr-2"
          >
            Back
          </button>
        </div>
      </header>
      <main className="mt-16 p-4">
        {note ? (
          <div>
            {note.tags.includes('html') ? (
                  <div
                    className='p-2 prose prose-lg'
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                ) : (
                  <ReactMarkdown
                    className='note-content mt-2 prose prose-lg max-w-none p-2'
                    components={renderers}
                  >
                    {note.content}
                  </ReactMarkdown>
                )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">New Note</h2>
            <p>No note selected.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default NoteDetailPage
