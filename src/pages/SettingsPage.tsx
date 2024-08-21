import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotificationManager from '@/hooks/useNotificationManager'
import useConfigManager, { Settings } from '@/hooks/useConfigManager'
import { FaArrowLeft, FaFileImport, FaFileExport } from 'react-icons/fa'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useNoteContext } from '@/context/NoteContext'
import useStorageManager, { NOTES_KEY } from '@/hooks/useStorageManager'

const SettingsPage = () => {
  const { getAllConfig, setConfig } = useConfigManager()
  const { setItem } = useStorageManager()
  const { notes, setNotes, setFilteredNotes } = useNoteContext()
  const { setNotification } = useNotificationManager()
  const [settings, setSettings] = useState<Settings>({
    persistState: false,
    notesPerPage: 10
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      setSettings(await getAllConfig())
      setIsLoading(false)
    })()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const saveSettings = async () => {
    await setConfig(settings)
    setNotification('Settings saved successfully!')
  }

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
    <>
      <header className='top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
        <div className='flex items-center'>
          <FaArrowLeft
            className='mr-2 text-xl cursor-pointer'
            onClick={() => navigate('/')}
          />
          <h1 className='text-xl'>Settings</h1>
        </div>
      </header>
      <div className='mt-10 mb-8 p-4'>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4 mb-4'>
            <label className='block text-sm font-medium text-gray-700 w-40'>
              Persist State
            </label>
            <input
              type='checkbox'
              className='form-checkbox h-5 w-5 text-blue-600'
              checked={settings.persistState}
              onChange={e =>
                setSettings({
                  ...settings,
                  persistState: e.target.checked
                })
              }
            />
          </div>
          <div className='flex items-center space-x-4 mb-4'>
            <label className='block text-sm font-medium text-gray-700 w-40'>
              Notes per Page
            </label>
            <input
              type='number'
              min='1'
              max='99'
              className='form-input mt-1 h-5 w-10 block border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
              value={settings?.notesPerPage}
              onChange={e => {
                setSettings({
                  ...settings,
                  notesPerPage: parseInt(e.target.value, 10) || 10
                })
              }}
            />
          </div>
        </div>
        <div className='flex justify-end mt-4'>
          <button onClick={saveSettings}>Save Settings</button>
        </div>
        <div className='flex space-x-4'>
          <button 
          onClick={() => document.getElementById('import-file')?.click()}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center'>
            <FaFileImport className='mr-2' />
            Import
          </button>
          <input
              type='file'
              accept='application/json'
              onChange={handleImportClick}
              className='hidden'
              id='import-file'
            />
          <button
            onClick={handleExportClick}
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300 flex items-center'
          >
            <FaFileExport className='mr-2' />
            Export
          </button>
        </div>
      </div>
    </>
  )
}

export default SettingsPage
