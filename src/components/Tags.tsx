// Tags.tsx
import { useNoteContext } from '@/context/NoteContext'
import useSearchManager from '@/hooks/useSearchManager'
import React from 'react'

const Tags: React.FC = () => {
  const { allTags, selectedTags } = useNoteContext()
  const { handleTagClick,savedTags } = useSearchManager()

  return (
    <div className='tags-container bg-gray-100 border-b border-gray-300 mt-12'>
      {allTags.length > 0 && (
        <div className='tags-list p-2'>
          <ul className='flex flex-wrap space-x-2'>
            {savedTags?.map(tag => (
              <li
                key={tag.name}
                className={`tag-item px-3 py-1 mt-1 cursor-pointer transition-colors duration-300 ${
                  selectedTags.includes(tag.name)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                } ${tag.color}`}
                onClick={() => handleTagClick(tag.name)}
              >
                #{tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Tags
