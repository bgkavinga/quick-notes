import { useNoteContext } from '@/context/NoteContext'
import useStorageManager, { TAGS_KEY } from './useStorageManager'
import { useEffect, useState } from 'react'

export type Tag = {
  name: string
  color?: string
  hideFromSearch?: boolean
  deletable?: boolean
}

const useSearchManager = () => {
  const {
    notes,
    allTags,
    selectedTags,
    searchQuery,
    setSelectedTags,
    setFilteredNotes,
    savedTags,
    setSavedTags,
  } = useNoteContext()
  const { setItem, getItem } = useStorageManager()
  const [isSearchManagerLoading, setIsSearchManagerLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      await loadSavedTags()
      setIsSearchManagerLoading(false)
    })()
  }, [])

  const handleTagClick = (tag: string) => {
    let updatedSelectedTags
    if (selectedTags.includes(tag)) {
      updatedSelectedTags = selectedTags.filter(t => t !== tag)
    } else {
      updatedSelectedTags = [...selectedTags, tag]
    }
    setSelectedTags(updatedSelectedTags)
    search(searchQuery, updatedSelectedTags, ['context'])
  }

  const search = (query: string, tags?: string[], excludeTags?: string[]) => {
    const queryLower = query.toLowerCase()
    const hasExcludeTags = excludeTags && excludeTags.length > 0
    const hasTags = tags && tags.length > 0

    const filteredNotes = notes.filter(note => {
      if (hasExcludeTags && excludeTags.some(t => note.tags.includes(t))) {
        return false
      }
      if (hasTags && !tags.some(t => note.tags.includes(t))) {
        return false
      }
      if (
        query &&
        !(
          note.title.toLowerCase().includes(queryLower) ||
          note.content.toLowerCase().includes(queryLower) ||
          note.tags.some(tag => tag.toLowerCase().includes(queryLower))
        )
      ) {
        return false
      }
      return true
    })

    setFilteredNotes(filteredNotes)
  }

  const saveTag = async (newTag: Tag) => {
    const tags = savedTags
    if (tags !== undefined) {
      const updatedTags = tags.map((tag: Tag) =>
        tag.name === newTag.name
          ? {
              ...tag,
              color: newTag.color,
              hideFromSearch: newTag.hideFromSearch
            }
          : tag
      )
      const uniqueTags = Array.from(
        new Map(updatedTags.map(tag => [tag.name, tag])).values()
      )

      await setItem(TAGS_KEY, uniqueTags)
      setSavedTags(updatedTags)
    } else {
      await setItem(TAGS_KEY, [newTag])
      setSavedTags([newTag])
    }
  }

  const getTag = async (name?: string) => {
    let tags = await loadSavedTags()
    const tag = tags.find((tag: Tag) => tag.name === name)
    return tag
  }

  const loadSavedTags = async () => {
    let tags = await getItem(TAGS_KEY)
    tags = tags || []
    tags = mergeTags(tags, allTags)
    setSavedTags(tags)
    return tags
  }

  const getTagColor = (name: string) => {
    const tag = savedTags?.find(tag => tag.name === name)
    return tag?.color
  }

  const mergeTags = (tags: Tag[], names: string[]): Tag[] => {
    // Convert the array of tags to a Map for efficient lookup
    const tagMap = new Map(tags.map(tag => [tag.name, {...tag, deletable: true}]))

    // Process the names array
    names.forEach(name => {
      if (tagMap.has(name)) {
        // Update existing entry
        const existingEntry = tagMap.get(name);
        if (existingEntry){
          tagMap.set(name, { ...existingEntry, deletable: false });
        }
      } else {
        // Add new entry
        tagMap.set(name, { name, color: '', deletable: false });
      }
    })
    return Array.from(tagMap.values())
  }

  const generateTagStyles = (tag: Tag, isSelected: boolean) => {
    if (!tag.color) tag.color = getTagColor(tag.name)
    if (isSelected) {
      return `border-2 border-blue-500 ${
        tag.color ? tag.color : 'bg-gray-200 text-gray-800'
      }`
    }
    return tag.color ? tag.color : 'bg-gray-200 text-gray-800'
  }

  const getAllSavedTags = async () => {
    return await loadSavedTags()
  }

  const deleteTag = async (name?: string) => {
    let tags = await getItem(TAGS_KEY)
    if (tags) {
      // Find the tag to delete
      const updatedTags = tags.filter((tag:Tag) => tag.name !== name);
      
      // Update the storage with the modified list of tags
      await setItem(TAGS_KEY, updatedTags);
      await loadSavedTags();
    }
  }

  return {
    handleTagClick,
    search,
    saveTag,
    getTagColor,
    generateTagStyles,
    getTag,
    getAllSavedTags,
    deleteTag,
    isSearchManagerLoading
  }
}

export default useSearchManager
