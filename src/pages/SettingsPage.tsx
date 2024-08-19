import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotificationManager from '@/hooks/useNotificationManager'
import useConfigManager, { Settings } from '@/hooks/useConfigManager'
import { FaArrowLeft } from 'react-icons/fa'
import LoadingSpinner from '@/components/LoadingSpinner'

const SettingsPage = () => {
  const notificationManager = useNotificationManager()
  const { getAllConfig, setConfig } = useConfigManager()
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
    notificationManager.setNotification('Settings saved successfully!')
  }

  return (
    <>
      <header className='fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
        <div className='flex items-center'>
          <FaArrowLeft
            className='mr-2 text-xl cursor-pointer'
            onClick={() => navigate('/')}
          />
          <h1 className='text-xl'>Settings</h1>
        </div>
      </header>
      <main className='mt-10 mb-8 p-4'>
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
      </main>
      <Footer />
    </>
  )
}

export default SettingsPage
