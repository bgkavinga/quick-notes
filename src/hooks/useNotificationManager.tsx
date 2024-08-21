import { useNoteContext } from '@/context/NoteContext'

const useNotificationManager = () => {
  const {notification, setNotification} = useNoteContext()
  return {
    notification,
    setNotification
  }
}

export default useNotificationManager
