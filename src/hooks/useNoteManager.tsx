import { Note, useNoteContext } from '@/context/NoteContext'
import useStorageManager from './useStorageManager'

const useNoteManager = () => {
  const {
    notes,
    allTags,
    selectedTags,
    setNotes,
    setAllTags,
    setNotification,
    setFilteredNotes
  } = useNoteContext()

  const { setItem } = useStorageManager()

  const saveNote = async (newNote: Note) => {
    const { id, title, content } = newNote
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
    const newFilteredNotes = updatedNotes.filter(note =>
      selectedTags.every(tag => note.tags.includes(tag))
    )
    const updatedTags = [...new Set([...allTags, ...newNote.tags])]
    setNotes(updatedNotes)
    setFilteredNotes(newFilteredNotes)
    setAllTags(updatedTags)
    await setItem('notes', updatedNotes)
    if (newNote.tags.includes('context')) {
      await setItem('context_version', newNote.timestamp)
    }
    setNotification('Note saved successfully!')
    return newNote
  }

  const deleteNote = (id: string | undefined) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    setFilteredNotes(updatedNotes)
    setItem('notes', updatedNotes)
    setNotification('Note deleted successfully!')
  }

  return {
    saveNote,
    deleteNote
  }
}

export default useNoteManager
