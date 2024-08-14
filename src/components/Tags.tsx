// Tags.tsx
import { useNoteContext } from '@/context/NoteContext';
import React, { useState } from 'react'



const Tags: React.FC= () => {
    const { notes, allTags, setFilteredNotes } = useNoteContext()
    const [selectedTags, setSelectedTags] = useState<string[]>([])


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

      
  return (
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
  );
};

export default Tags;