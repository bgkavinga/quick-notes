import React, { useEffect } from 'react'
import { useNoteContext } from '@/context/NoteContext'
import { FiDownload, FiUpload } from 'react-icons/fi'
import StorageUtil from '@/utils/storageUtil'

const Footer: React.FC = () => {
  const { notes, notification, setNotes, setFilteredNotes, clearNotification } =
    useNoteContext()
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification()
      }, 3000) // Hide notification after 3 seconds

      return () => clearTimeout(timer) // Cleanup the timer on component unmount
    }
  }, [notification, clearNotification])

  const handleExportClick = () => {
    const notesJson = JSON.stringify(notes, null, 2)
    const blob = new Blob([notesJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'notes.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result as string
        try {
          const importedNotes = JSON.parse(content)
          setNotes(importedNotes)
          setFilteredNotes(importedNotes)
          StorageUtil.setItem('notes', importedNotes)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <footer className='fixed bottom-0 left-0 w-full bg-gray-800 text-white py-2 px-4'>
      <div className='container mx-auto flex justify-between items-center'>
        {notification && (
          <div className='text-white p-2 rounded bg-gray-700'>
            <p>{notification}</p>
          </div>
        )}
        <div className='flex items-center ml-auto'>
          <input
            type='file'
            accept='application/json'
            onChange={handleImportClick}
            className='hidden'
            id='import-file'
          />
          <label
            htmlFor='import-file'
            className='flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer mr-4'
          >
            <FiDownload className='mr-2' />
            Import
          </label>
          <button
            onClick={handleExportClick}
            className='flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
          >
            <FiUpload className='mr-2' />
            Export
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
