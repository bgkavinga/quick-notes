// Tags.tsx
import { useNoteContext } from '@/context/NoteContext';
import React from 'react'



const Tags: React.FC= () => {
  const { allTags, selectedTags, handleTagClick } = useNoteContext()


  return (
    <div className='tags-container bg-gray-100 border-b border-gray-300 mt-12'>
      {allTags.length > 0 && (
        <div className='tags-list p-2'>
          <ul className='flex flex-wrap space-x-2'>
            {allTags.map(tag => (
              <li
                key={tag}
                className={`tag-item px-3 py-1 cursor-pointer transition-colors duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Tags;