import React from 'react'
import { useNoteContext } from '@/context/NoteContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tags from '@/components/Tags'
import NoteComponent from '@/components/NoteComponent'

const HomePage: React.FC = () => {
  const { filteredNotes } = useNoteContext()

  return (
    <>
      <Header />
      <Tags/>
      <main className='mb-12'>
        {filteredNotes.length === 0 ? (
          <p className='text-gray-600 text-lg'>No notes available</p>
        ) : (
          <ul className='space-y-2'>
            {filteredNotes.map(note => (
              <li
                key={note.id}
                className='note-item bg-white'
              >
                <NoteComponent {...note} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}

export default HomePage
