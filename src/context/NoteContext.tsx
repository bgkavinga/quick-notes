import useStorageManager, {
  NOTES_KEY,
  SAVED_TAGS_KEY
} from '@/hooks/useStorageManager'
import useConfigManager, {
  CONFIG_PERSIST_STATE
} from '@/hooks/useConfigManager'
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext
} from 'react'
import { Tag } from '@/hooks/useSearchManager'
import LoadingSpinner from '@/components/LoadingSpinner'

export type Note = {
  id?: string
  title: string
  content: string
  tags: string[]
  timestamp?: string
}

type NoteContextType = {
  notes: Note[]
  filteredNotes: Note[]
  currentNote: Note | null
  notification: string | null
  selectedTags: string[]
  allTags: string[]
  searchQuery: string
  savedTags: Tag[]
  isContextLoading: boolean
  setNotes: (note: Note[] | []) => void
  setFilteredNotes: (note: Note[] | []) => void
  setCurrentNote: (note: Note) => void
  setNotification: (notification: string | null) => void
  setSelectedTags: (tags: string[]) => void
  setAllTags: (tags: string[]) => void
  setSearchQuery: (query: string) => void
  setSavedTags: (tags: Tag[]) => void
}

export const NoteContext = createContext<NoteContextType | undefined>(undefined)

export const NoteProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [notes, setNotesState] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotesState] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [selectedTags, setSelectedTagsState] = useState<string[]>([])
  const [allTags, setAllTagsState] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [savedTags, setSavedTags] = useState<Tag[]>([])
  const { setItem, getItem } = useStorageManager()
  const { getConfig,isConfigLoading } = useConfigManager()
  const [isContextLoading, setIsContextLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const savedNotes = await getItem(NOTES_KEY)
        const savedTags = await getItem(SAVED_TAGS_KEY)
        const persistState = await getConfig(CONFIG_PERSIST_STATE)
        const notes = savedNotes || []
        setNotes(notes)
        setFilteredNotes(notes)
        console.log('savedTags',savedTags,persistState)
        if (
          savedTags &&
          savedTags.length > 0 &&
          persistState
        ) {
          const filtered = notes.filter((note: Note) =>
            savedTags.some((t: string) => note.tags.includes(t))
          )
          setFilteredNotes(filtered)
          setSelectedTagsState(savedTags || [])
        }
        setIsContextLoading(false)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }

    fetchNotes()
  }, [])


  const setNotes = (newNotes: Note[]) => {
    const sortedNotes = newNotes.sort(
      (a, b) =>
        new Date(b.timestamp || '2019-07-04').getTime() -
        new Date(a.timestamp || '').getTime()
    )
    const tags = sortedNotes
      .flatMap(note => note.tags) // Extract tags
      .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
      .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
    setAllTags(tags)
    setNotesState(sortedNotes)
  }

  const setAllTags = (tags: string[]) => {
    setAllTagsState(tags.sort((a, b) => a.localeCompare(b)))
  }

  const setFilteredNotes = (newNotes: Note[]) => {
    const sortedNotes = newNotes.sort(
      (a, b) =>
        new Date(b.timestamp || '2019-07-04').getTime() -
        new Date(a.timestamp || '').getTime()
    )
    setFilteredNotesState(sortedNotes)
  }

  const setSelectedTags = async (tags: string[]) => {
    setSelectedTagsState(tags)
    await setItem(SAVED_TAGS_KEY, tags)
  }

  if (isContextLoading || isConfigLoading) {
    return <LoadingSpinner />
  }
  
  return (
    <NoteContext.Provider
      value={{
        notes,
        filteredNotes,
        currentNote,
        notification,
        selectedTags,
        allTags,
        searchQuery,
        savedTags,
        setNotes,
        setFilteredNotes,
        setCurrentNote,
        setNotification,
        setSelectedTags,
        setAllTags,
        setSearchQuery,
        setSavedTags,
        isContextLoading
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
