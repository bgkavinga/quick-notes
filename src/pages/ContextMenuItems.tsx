import React, { useEffect } from 'react'
import NotesListComponent from '@/components/NotesListComponent'
import useSearchManager from '@/hooks/useSearchManager'
import { useNoteContext } from '@/context/NoteContext'
import SearchBox from '@/components/SearchBox'

const ContextMenuItems: React.FC = () => {
  const { search } = useSearchManager()
  const { filteredNotes } = useNoteContext()
  const tagsToFilter = ['context']

  useEffect(() => {
    search('', tagsToFilter)
  }, [])

  return (
    <>
      <div className='flex flex-col h-full'>
        <header className='top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 space-x-4 shadow-md flex items-center z-50'>
          <div className='flex-grow'>
            <SearchBox tags={tagsToFilter} />
          </div>
        </header>
        {filteredNotes.length === 0 ? (
          <p className='text-gray-600 text-lg'>No context menus available</p>
        ) : (
          <NotesListComponent filteredNotes={filteredNotes} />
        )}
      </div>
    </>
  )
}

export default ContextMenuItems
