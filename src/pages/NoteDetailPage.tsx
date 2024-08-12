import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNoteContext } from '@/context/NoteContext'
import StorageUtil from '@/utils/storageUtil'

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notes, setNotes,setFilteredNotes, allTags,setNotification,setAllTags } = useNoteContext()

  const note = notes.find(note => note.id === id)

  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setTags(note.tags)
    }
  }, [note])


  const handleCancel = () => {
    navigate('/')
  }

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

  const handleSave = () => {
    const newNote = { id: note?.id ? String(id) : String(Date.now()), title, content, tags };
    const updatedNotes = id
      ? notes.map((note) => (note.id === id ? newNote : note))
      : [...notes, newNote];
    const updatedTags = [...new Set([...allTags, ...newNote.tags])];
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    setAllTags(updatedTags);
    StorageUtil.setItem('notes',updatedNotes);
    setNotification('Note saved successfully!'); // Set notification
    navigate('/')
  }

  const handleDelete = () => {
    // const updatedNotes = notes.filter((note) => note.id !== id);
    // setNotes(updatedNotes);
    // setFilteredNotes(updatedNotes);
    // StorageUtil.setItem('notes',updatedNotes);
    // setNotification('Note deleted successfully!');
    navigate(`/delete-note/${note?.id}`);
  };
  

  const handleAddLink = async () => {
    // Get the current tab URL using the Chrome extension API
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = tab.url
    const title = tab.title
    const markdownLink = `[${title}](${url})\n`

    // Insert the markdown link at the cursor position in the text area
    const textarea = document.getElementById(
      'noteContent'
    ) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      textarea.value = text.slice(0, start) + markdownLink + text.slice(end)
      setContent(textarea.value)
      textarea.selectionStart = textarea.selectionEnd =
        start + markdownLink.length
    }
  }

return (
    <>
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50">
            <h1 className='text-xl'>{note ? 'Edit Note' : 'New Note'}</h1>
            <div>
                <button
                    onClick={handleCancel}
                    className='bg-gray-700 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded mr-2'
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded mr-2'
                >
                    Delete
                </button>
                <button
                    onClick={handleSave}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2'
                >
                    Save
                </button>
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
                <button
                    onClick={handleAddLink}
                    className='bg-green-500 text-white px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-green-700 mb-2'
                >
                    Add Current Page Link
                </button>
                <textarea
                    id='noteContent'
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className='w-full p-3 mb-2 border border-gray-300 rounded-lg text-lg font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
                    placeholder='Content'
                    rows={6} // Decreased the number of rows
                />
                <small className="block text-gray-600 mb-4">Supports Markdown</small>
            </div>

            <div className='mb-4'>
                <h2 className='text-xl font-bold mb-2'>Tags</h2>
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

export default NoteDetailPage
