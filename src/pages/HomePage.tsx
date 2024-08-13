import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import ReactMarkdown from 'react-markdown'
import { FaCopy,FaTrash } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaEdit } from 'react-icons/fa'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { notes, filteredNotes, allTags, setFilteredNotes, setNotification } =
    useNoteContext()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleNoteClick = (id: string) => {
    navigate(`/note/${id}`)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setNotification('Code copied to clipboard!')
    })
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
    navigate(`/delete-note/${noteId}`);
  };

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
                  <h1 className='text-lg font-bold bg-gray-200 text-gray-800 p-2 rounded'>
                    {note.title ? note.title : 'Untitled'}
                  </h1>
                </div>
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
                <div className='tags-list flex justify-between items-center mt-2'>
                  <ul className='flex flex-wrap p-2'>
                    {note.tags.map(tag => (
                      <li
                        key={tag}
                        className='tag-item px-3 py-1 rounded bg-gray-200 text-gray-800'
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-4 p-2">
                    <FaEdit
                      className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 text-lg"
                      onClick={() => handleNoteClick(note.id)}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-300 text-lg"
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
