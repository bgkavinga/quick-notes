import { useEffect } from 'react'
import { useNoteContext } from '@/context/NoteContext'

const useNotificationManager = () => {
  const {notification, setNotification} = useNoteContext()

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('')
      }, 3000) // Hide notification after 3 seconds

      return () => clearTimeout(timer) // Cleanup the timer on component unmount
    }
  }, [notification])

  return {
    notification,
    setNotification
  }
}

export default useNotificationManager
