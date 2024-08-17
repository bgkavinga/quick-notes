import { useNoteContext } from '@/context/NoteContext'

const useSearchManager = () => {
    const { notes, selectedTags, searchQuery, setSelectedTags, setFilteredNotes } =
        useNoteContext()

    const handleTagClick = (tag: string) => {
        let updatedSelectedTags
        if (selectedTags.includes(tag)) {
            updatedSelectedTags = selectedTags.filter(t => t !== tag)
        } else {
            updatedSelectedTags = [...selectedTags, tag]
        }
        setSelectedTags(updatedSelectedTags)
        search(searchQuery, updatedSelectedTags)
    }

    const search = (query: string, tags?: string[]) => {
        const queryLower = query.toLowerCase()
        let filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(queryLower) ||
            note.content.toLowerCase().includes(queryLower) ||
            note.tags.some(tag => tag.toLowerCase().includes(queryLower))
        );
        if (tags) {
            if (tags.length > 0){
                filteredNotes = filteredNotes.filter(note =>
                    tags.some(t => note.tags.includes(t))
                )
            }
        } else if (selectedTags.length > 0) {
            filteredNotes = filteredNotes.filter(note =>
                selectedTags.some(t => note.tags.includes(t))
            )
        }
        setFilteredNotes(filteredNotes);
    }

    return {
        handleTagClick,
        search
    }
}

export default useSearchManager
