import React from 'react'
import { useNoteContext } from '@/context/NoteContext'

const Notification: React.FC = () => {
  const { notification } = useNoteContext()

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 ${
        notification ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {notification}
    </div>
  )
}

export default Notification