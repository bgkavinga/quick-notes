import StorageUtil from '@/utils/storageUtil'
import { Note, useNoteContext } from '@/context/NoteContext'

const useNoteManager = () => {
  const {
    notes,
    allTags,
    setNotes,
    setAllTags,
    setNotification,
    setFilteredNotes
  } = useNoteContext()

  const saveNote = async (newNote: Note) => {
    const { id, title, content} = newNote
    if (!title.trim() || !content.trim()) {
      setNotification('Title and content cannot be empty.')
      return
    }

    if (!newNote.id) {
      newNote.id = String(Date.now())
    }
    // Add or update the timestamp
    newNote.timestamp = new Date().toISOString()

    const updatedNotes = id
      ? notes.map(note => (note.id === id ? newNote : note))
      : [...notes, newNote]
    const updatedTags = [...new Set([...allTags, ...newNote.tags])]
    setNotes(updatedNotes)
    setFilteredNotes(updatedNotes)
    setAllTags(updatedTags)
    await StorageUtil.setItem('notes', updatedNotes)
    setNotification('Note saved successfully!')
    return newNote
  }

  return {
    saveNote
  }
}

export default useNoteManager
