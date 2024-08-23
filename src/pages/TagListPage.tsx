import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'
import { useNoteContext } from '@/context/NoteContext'
import { Tag } from '@/hooks/useSearchManager'

const TagListPage: React.FC = () => {
  const navigate = useNavigate()
  const { savedTags } = useNoteContext()

  return (
    <>
      <div className='flex flex-col h-full'>
        <header className=' top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
          <div className='flex items-center'>
            <FaArrowLeft
              className='mr-2 text-xl cursor-pointer'
              onClick={() => navigate('/')}
            />
            <h1 className='text-xl'>Tags</h1>
          </div>
        </header>

        <div className='scrollable-content flex-1 overflow-y-auto pb-4'>
          <ul className='space-y-2'>
            {savedTags.length === 0 ?
            (
              <p className='text-gray-600 text-lg'>No tags available</p>
            )  : savedTags.map((tag: Tag) => (
              <li
                key={tag.name}
                className={`flex justify-between items-center p-4 text-sm ${tag.color}`}
              >
                <span>{tag.name}</span>
                <div className='flex items-center space-x-2'>
                <FaEdit
                  className='text-xl cursor-pointer hover:text-blue-500 transition-colors duration-200'
                  onClick={() => navigate(`/tag-edit/${tag.name}`)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default TagListPage
