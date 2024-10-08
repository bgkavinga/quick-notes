// Tags.tsx
import { useNoteContext } from '@/context/NoteContext'
import useSearchManager from '@/hooks/useSearchManager'
import React, { useEffect } from 'react'

const Tags: React.FC = () => {
  const { allTags, selectedTags,savedTags } = useNoteContext()
  const { handleTagClick, isSearchManagerLoading, generateTagStyles } = useSearchManager()
  const [localTags, setLocalTags] = React.useState(savedTags)

  useEffect(() => {
    if (!isSearchManagerLoading) {
      setLocalTags(savedTags)
    }
  }, [isSearchManagerLoading])

  if (isSearchManagerLoading) {
    return null
  }

  return (
    <div className='tags-container bg-gray-100 border-b border-gray-300'>
      {allTags.length > 0 && (
        <div className='tags-list p-2'>
          <ul className='flex flex-wrap space-x-2'>
            {localTags?.map(tag => (
              tag.name!='context' && !tag.hideFromSearch &&
              <li
                key={tag.name}
                className={`tag-item text-sm px-3 py-1 mt-1 cursor-pointer transition-colors text-gray-800 duration-300 ${
                  selectedTags.includes(tag.name)
                    ? generateTagStyles(tag, true)
                    : generateTagStyles(tag, false)
                } `}
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Tags
