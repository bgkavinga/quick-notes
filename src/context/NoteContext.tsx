import StorageUtil from '@/utils/storageUtil'
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext
} from 'react'

type Note = {
  id: string
  title: string
  content: string
  tags: string[],
  timestamp: string
}

type NoteContextType = {
  notes: Note[]
  filteredNotes: Note[]
  currentNote: Note | null
  notification: string | null
  selectedTags: string[]
  allTags: string[]
  setNotes: (note: Note[] | []) => void
  setFilteredNotes: (note: Note[] | []) => void
  setCurrentNote: (note: Note) => void
  setNotification: (notification: string | null) => void
  setSelectedTags: (tags: string[]) => void
  clearNotification: () => void // Add clearNotification function
  setAllTags: (tags: string[]) => void
}

export const NoteContext = createContext<NoteContextType | undefined>(undefined)

export const NoteProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [notes, setNotesState] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotesState] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const savedNotes = await StorageUtil.getItem('notes')
        const notes = savedNotes || []
        setNotes(notes)
        setFilteredNotes(notes)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }

    fetchNotes()
  }, [])


  const clearNotification = () => {
    setNotification(null)
  }

  const setNotes = (newNotes: Note[]) => {
    const sortedNotes = newNotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAllTags([
        ...new Set<string>(sortedNotes.flatMap((note: Note) => note.tags))
      ])
    setNotesState(sortedNotes);
  };

  const setFilteredNotes = (newNotes: Note[]) => {
    const sortedNotes = newNotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setFilteredNotesState(sortedNotes);
  };

  


  return (
    <NoteContext.Provider
      value={{
        notes,
        filteredNotes,
        currentNote,
        notification,
        selectedTags,
        setNotes,
        setFilteredNotes,
        setCurrentNote,
        setNotification,
        setSelectedTags,
        allTags,
        setAllTags,
        clearNotification
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}

export const useNoteContext = () => {
  const context = useContext(NoteContext)
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider')
  }
  return context
}
