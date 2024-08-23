import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import LoadingSpinner from '../components/LoadingSpinner'
import useSearchManager from '@/hooks/useSearchManager'
import useNotificationManager from '@/hooks/useNotificationManager'

// Define available colors for tags
const tagColors = [
  'bg-red-500',
  'bg-green-500',
  'bg-cyan-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-slate-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-pink-500',
]

const TagEditPage = () => {
  const { tagName } = useParams()
  const navigate = useNavigate()
  const [tag, setTag] = useState({ name: '', color: tagColors[0],hideFromSearch:false,deletable:false })
  const [isLoading, setIsLoading] = useState(true)
  const { saveTag, getTag } = useSearchManager()
  const { setNotification } = useNotificationManager()

  useEffect(() => {
    const fetchTag = async () => {
      const fetchedTag = await getTag(tagName)
      setTag(fetchedTag)
      setIsLoading(false)
    }
    fetchTag()
  }, [tagName])

  const handleSave = async () => {
    await saveTag(tag)
    navigate('/tag-list')
    setNotification('Tag updated successfully!')
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className='flex flex-col h-full'>
      <header className='top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
          <div className='flex items-center'>
            <div className='p-4 cursor-pointer' onClick={() => navigate(-1)}>
              <FaArrowLeft className='mr-2 cursor-pointer text-xl' />
            </div>
            <h1 className='text-xl'>Edit Tag</h1>
          </div>
          <div className='flex space-x-4 p-2 ml-2'>
            { tag.deletable && <FaTrash
              className='cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-300 text-lg'
              onClick={() => navigate(`/tag-delete/${tag.name}`)}
            /> }
          </div>
        </header>
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='max-w-lg mx-auto space-y-8'>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Tag Name
            </label>
            <input
              type='text'
              value={tag.name}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Tag Color
            </label>
            <div className='flex space-x-2 mt-1'>
              {tagColors.map(color => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer ${color === tag.color ? 'ring-2 ring-blue-500' : ''} ${color}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setTag({ ...tag, color })}
                />
              ))}
            </div>
          </div>
          <div className='mb-4 space-x-4 flex'>
              <label className='block text-sm font-medium text-gray-700'>
                Exclude from search
              </label>
              <input
                type='checkbox'
                checked={tag.hideFromSearch}
                onChange={e => setTag({ ...tag, hideFromSearch: e.target.checked })}
                className='mt-1 block h-5 w-5'
              />
          </div>
          <div className='flex justify-end'>
            <button
              onClick={handleSave}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TagEditPage
