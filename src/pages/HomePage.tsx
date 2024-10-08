import React, { useEffect } from 'react'
import { useNoteContext } from '@/context/NoteContext'
import SearchBar from '@/components/SearchBar'
import Tags from '@/components/Tags'
import NotesListComponent from '@/components/NotesListComponent'
import useSearchManager from '@/hooks/useSearchManager'

const HomePage: React.FC = () => {
  const { filteredNotes,searchQuery,selectedTags } = useNoteContext()
  const {search} = useSearchManager()

  useEffect(() => {
    search(searchQuery, selectedTags, ['context'])
  }, [])

  return (
    <>
      <div className='flex flex-col h-full'>
        <SearchBar />
        <Tags />
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
