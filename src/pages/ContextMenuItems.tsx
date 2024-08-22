import React, { useEffect } from 'react'
import NotesListComponent from '@/components/NotesListComponent'
import useSearchManager from '@/hooks/useSearchManager'
import { useNoteContext } from '@/context/NoteContext'
import SearchBox from '@/components/SearchBox'

const ContextMenuItems: React.FC = () => {
  const { search } = useSearchManager()
  const {filteredNotes} = useNoteContext()
  const tagsToFilter = ['context']

  useEffect(() => {
    search('', tagsToFilter)
  }, [])


  return (
    <>
      <div className='flex flex-col h-full'>
      <SearchBox tags={tagsToFilter}/>
        {filteredNotes.length === 0 ? (
          <p className='text-gray-600 text-lg'>No notes available</p>
        ) : (
          <NotesListComponent filteredNotes={filteredNotes} />
        )}
      </div>
    </>
  )
}

export default ContextMenuItems
