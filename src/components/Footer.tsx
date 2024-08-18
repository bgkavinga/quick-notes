import React from 'react'
import { useNoteContext } from '@/context/NoteContext'
import { FaDownload, FaUpload, FaCog, FaHome,FaTag } from 'react-icons/fa'
import useNotificationManager from '@/hooks/useNotificationManager'
import { useNavigate } from 'react-router-dom'
import useStorageManager,{NOTES_KEY} from '@/hooks/useStorageManager'

const Footer: React.FC = () => {
  const { notes, setNotes, setFilteredNotes } = useNoteContext()
  const { notification, setNotification } = useNotificationManager()
  const navigate = useNavigate()
  const {setItem} = useStorageManager()

  // Function to generate a timestamp string
  const generateTimestamp = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}_${hours}${minutes}${seconds}`
  }

  const handleExportClick = () => {
    const notesJson = JSON.stringify(notes, null, 2)
    const blob = new Blob([notesJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = generateTimestamp()
    link.href = url
    link.download = `notes_${timestamp}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setNotification('data exported successfully!')
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
          setItem(NOTES_KEY, importedNotes)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
    setNotification('data imported successfully!')
  }

  return (
    <footer className='fixed bottom-0 left-0 w-full bg-gray-800 text-white py-2 px-4'>
      <div className='container mx-auto flex justify-between items-center'>
        {notification && (
          <div className='text-white p-2 rounded '>
            <p>{notification}</p>
          </div>
        )}
        <div className='flex items-center ml-auto space-x-4'>
          <button onClick={() => navigate('/')}>
            <FaHome />
          </button>
          <button onClick={() => navigate('/tag-list')}>
            <FaTag />
          </button>
          <input
            type='file'
            accept='application/json'
            onChange={handleImportClick}
            className='hidden'
            id='import-file'
          />
          <label  htmlFor='import-file' className='btn'>
            <FaDownload/>
          </label>
          <button onClick={handleExportClick}>
            <FaUpload />
          </button>
          <button onClick={() => navigate('/settings')}>
            <FaCog />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
