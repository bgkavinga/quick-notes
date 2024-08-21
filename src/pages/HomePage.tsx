import React from 'react'
import { useNoteContext } from '@/context/NoteContext'
import SearchBar from '@/components/SearchBar'
import Tags from '@/components/Tags'
import NotesListComponent from '@/components/NotesListComponent'

const HomePage: React.FC = () => {
  const { filteredNotes } = useNoteContext()

  return (
    <>
    <div className='flex flex-col h-full'>
    <SearchBar />
      <Tags/>
      {filteredNotes.length === 0 ? (
          <p className='text-gray-600 text-lg'>No notes available</p>
        ) : (
          <NotesListComponent filteredNotes={filteredNotes} />
        )}
    </div>
     
    </>
  )
}

export default HomePage
