import { useNoteContext } from '@/context/NoteContext'

const useTagManager = () => {
  const { notes, selectedTags, setSelectedTags, setFilteredNotes } =
    useNoteContext()

  const handleTagClick = (tag: string) => {
    let updatedSelectedTags
    if (selectedTags.includes(tag)) {
      updatedSelectedTags = selectedTags.filter(t => t !== tag)
    } else {
      updatedSelectedTags = [...selectedTags, tag]
    }
    setSelectedTags(updatedSelectedTags)

    if (updatedSelectedTags.length === 0) {
      setFilteredNotes(notes)
    } else {
      const filtered = notes.filter(note =>
        updatedSelectedTags.some(t => note.tags.includes(t))
      )
      setFilteredNotes(filtered)
    }
  }

  return {
    handleTagClick
  }
}

export default useTagManager
