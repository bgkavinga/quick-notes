import React, { useState, useEffect } from 'react'
import NoteComponent from './NoteComponent'
import { Note } from '@/context/NoteContext'
import useConfigManager, {
  CONFIG_NOTES_PER_PAGE
} from '@/hooks/useConfigManager'
import LoadingSpinner from './LoadingSpinner'

const NotesListComponent: React.FC<{ filteredNotes: Note[] }> = ({
  filteredNotes
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [notesPerPage, setNotesPerPage] = useState(10)
  const { getConfig } = useConfigManager()

  const pagesToShow = 5

  const indexOfLastNote = currentPage * notesPerPage
  const indexOfFirstNote = indexOfLastNote - notesPerPage

  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote)

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)

  // Determine the range of pages to show
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  useEffect(() => {
    ;(async () => {
      const configNotesPerPage = await getConfig(CONFIG_NOTES_PER_PAGE)
      // Ensure that configNotesPerPage is a number before setting the state
      if (typeof configNotesPerPage === 'number') {
        setNotesPerPage(configNotesPerPage)
      } else {
        setNotesPerPage(10) // Default value
      }
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
       <div className='scrollable-content flex-1 overflow-y-auto pb-4'>
           <ul className='space-y-2'>
              {currentNotes.map(note => (
                <li key={note.id} className='note-item bg-white'>
                  <NoteComponent {...note} />
                </li>
              ))}
            </ul>
          <div className='flex justify-center items-center space-x-2'>
            {/* Previous Arrow */}
            {startPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className='px-3 py-1 rounded bg-gray-300 hover:bg-gray-400'
              >
                &lt;
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
              <button
                key={startPage + index}
                onClick={() => paginate(startPage + index)}
                className={`px-3 py-1 rounded ${
                  currentPage === startPage + index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {startPage + index}
              </button>
            ))}

            {/* Next Arrow */}
            {endPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className='px-3 py-1 rounded bg-gray-300 hover:bg-gray-400'
              >
                &gt;
              </button>
            )}
          </div>
        </div>
    </>
  )
}

export default NotesListComponent
