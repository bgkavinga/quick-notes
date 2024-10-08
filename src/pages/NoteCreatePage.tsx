import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import ReactMarkdown from 'react-markdown'
import { FaArrowLeft, FaTrash, FaEye } from 'react-icons/fa'
import useNoteManager from '@/hooks/useNoteManager'
import { Note } from '@/context/NoteContext'
import useSearchManager, { Tag } from '@/hooks/useSearchManager'

const NoteCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes } = useNoteContext()
  const { saveNote } = useNoteManager()
  const { getAllSavedTags } = useSearchManager()
  const [allSavedTagsState, setAllSavedTagsState] = useState<Tag[]>()

  const note = notes.find(note => note.id === id)

  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [newTags, setNewTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const allSavedTags = await getAllSavedTags()
      setAllSavedTagsState(allSavedTags)
      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setTags(note.tags ? note.tags : [])
    }
  }, [note])

  useEffect(() => {
    if (isLoading) {
      return
    }
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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTags([...newTags, newTag.trim()])
      setNewTag('')
    }
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

  return (
    <>
      <div className='flex flex-col h-full'>
        <header className='top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
          <div className='flex items-center'>
            <div className='p-4 cursor-pointer' onClick={() => navigate(-1)}>
              <FaArrowLeft className='mr-2 cursor-pointer text-xl' />
            </div>
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

        <div className='mx-auto p-4 scrollable-content'>
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
              className='w-full p-2 mb-2 border border-gray-300 rounded-lg text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
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
            <small className='block text-gray-600 mb-4'>
              Supports Markdown
            </small>
          </div>

          <div className='mb-4'>
            <h2 className='text-l font-bold mb-2'>Tags</h2>
            <div className='flex flex-wrap mb-4'>
              {allSavedTagsState?.map((tag: Tag, index) => (
                <span
                  key={index}
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer ${
                    tags.includes(tag.name) ? 'bg-blue-200' : 'bg-gray-200'
                  }`}
                  onClick={() => handleToggleTag(tag.name)}
                >
                  {tag.name}
                </span>
              ))}
              {newTags?.map((tag: string, index) => (
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
              className='w-full p-2 mb-2 border border-gray-300 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-base'
              placeholder='New Tag'
            />
            <small className='text-gray-500'>Press Enter to add a tag</small>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoteCreatePage
