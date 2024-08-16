import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import ReactMarkdown from 'react-markdown'
import { FaArrowLeft,FaTrash,FaEye } from 'react-icons/fa'
import useNoteManager from '@/hooks/useNoteManager'
import { Note } from '@/context/NoteContext'

const NoteUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes, allTags } = useNoteContext()
  const { saveNote } = useNoteManager()

  const note = notes.find(note => note.id === id)

  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setTags(note.tags ? note.tags : [])
    }
  }, [note])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text)
  }

  useEffect(() => {
    const saveActionWrapper = async () => {
      const newNote = {
        id: note?.id ? String(id) : undefined,
        title,
        content,
        tags
      }
      return await saveNote(newNote)
    }
    saveActionWrapper().then((note?: Note) => {
      note ? navigate(`/note-update/${note.id}`) : ''
    })
  }, [title, content, tags])

  return (
    <>
      <header className='fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
        <div className='flex items-center'>
          <FaArrowLeft
            className='mr-2 cursor-pointer text-xl'
            onClick={() => navigate('/')}
          />
          <h1 className='text-xl'>{note ? 'Edit Note' : 'New Note'}</h1>
        </div>
        <div className='flex space-x-4 p-2 ml-2'>
          <FaEye
              className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-detail/${note?.id}`)}
          />
          <FaTrash
              className='cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/note-delete/${note?.id}`)}
            />
        </div>
      </header>

      <div className='container mx-auto p-4 mt-12'>
        <div className='mb-4'>
          <label
            htmlFor='noteTitle'
            className='block text-gray-700 font-bold mb-2'
          >
            Title
          </label>
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full p-3 mb-2 border border-gray-300 rounded-lg text-lg font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
            placeholder='Title'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='noteContent'
            className='block text-gray-700 font-bold mb-2'
          >
            Content
          </label>

          <MdEditor
            value={content}
            style={{ height: '300px', width: '100%' }} // Increased the height and set width to 100%
            onChange={handleEditorChange}
            renderHTML={(content: string | null | undefined) => (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
            view={{ menu: true, md: true, html: false }}
            markdownClass='!text-lg'
          />
          <small className='block text-gray-600 mb-4'>Supports Markdown</small>
        </div>

        <div className='mb-4'>
          <h2 className='text-l font-bold mb-2'>Tags</h2>
          <div className='flex flex-wrap mb-4'>
            {allTags.map((tag, index) => (
              <span
                key={index}
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer ${
                  tags.includes(tag) ? 'bg-blue-200' : 'bg-gray-200'
                }`}
                onClick={() => handleToggleTag(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <input
            type='text'
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            className='w-full p-3 mb-2 border border-gray-300 rounded-lg text-lg font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
            placeholder='New Tag'
          />
          <small className='text-gray-500'>Press Enter to add a tag</small>
          <div className='mt-2 flex flex-wrap'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer ${
                  tags.includes(tag) ? 'bg-blue-200' : 'bg-gray-200'
                }`}
                onClick={() => handleToggleTag(tag)}
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className='ml-2 text-red-500'
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default NoteUpdatePage
