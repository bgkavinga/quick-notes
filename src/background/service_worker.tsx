import { Note } from '@/context/NoteContext'
import truncate from '@/utils/truncate'
import useStorageManager from '@/hooks/useStorageManager'

const { getItem, NOTES_KEY } = useStorageManager()

// Handle context menu item clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId) {
    const notes = await getItem(NOTES_KEY)
    const note = notes.find((note: Note) => note.id === info.menuItemId)
    if (note) {
      chrome.scripting.executeScript({
        target: { tabId: tab?.id || 0 },
        func: (content: string) => {
          const activeElement = document.activeElement as
            | HTMLInputElement
            | HTMLTextAreaElement
          if (
            activeElement &&
            (activeElement.tagName === 'INPUT' ||
              activeElement.tagName === 'TEXTAREA')
          ) {
            activeElement.value += content
            // Dispatch input event to ensure the change is recognized
            const event = new Event('input', { bubbles: true })
            activeElement.dispatchEvent(event)
          }
        },
        args: [note.content]
      })
    }
  }
})

// Initial context menu creation
chrome.runtime.onInstalled.addListener(() => {
  createContextMenuItems()
})

// Function to create context menu items
const createContextMenuItems = async () => {
  const notes = await getItem(NOTES_KEY)

  // Create context menu item for creating or updating note
  chrome.contextMenus.create({
    id: 'createOrUpdateNote',
    title: 'Create or Update Note',
    contexts: ['selection']
  })

  if (!notes) {
    return
  }

  const contextMenuItems = notes.filter((note: Note) =>
    note.tags.includes('context')
  )

  if(contextMenuItems.length === 0){
    return
  }

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'parent',
      title: 'QNote',
      contexts: ['editable']
    })
    
    const createdIds = new Set<string>()

    contextMenuItems.forEach((note: Note) => {
      const titleParts = note.title.split('>')
      let parentId = 'parent'

      titleParts.forEach((part, index) => {
        const id = `${parentId}-${part.trim()}`
        if (!createdIds.has(id)) {
          if (index === titleParts.length - 1) {
            // Create the final note item
            chrome.contextMenus.create({
              id: note.id,
              title: truncate(part.trim(), 30),
              contexts: ['editable'],
              parentId: parentId
            })
          } else {
            // Create a submenu if it doesn't already exist
            chrome.contextMenus.create({
              id: id,
              title: part.trim(),
              contexts: ['editable'],
              parentId: parentId
            })
            parentId = id
          }
          createdIds.add(id)
        } else {
          parentId = id
        }
      })
    })
  })
}

// Create or update note using the selected text content
const createOrUpdateNote = (selectedText: string, pageTitle: string) => {
  chrome.storage.local.get(['notes'], result => {
    const notes = result.notes || {}
    if (notes[pageTitle]) {
      // Update existing note
      notes[pageTitle].content += `\n${selectedText}`
    } else {
      // Create new note
      notes[pageTitle] = {
        title: pageTitle,
        content: selectedText
      }
    }
    chrome.storage.local.set({ notes })
  })
}



// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'createOrUpdateNote' && info.selectionText) {
    const selectedText = info.selectionText
    const pageTitle = tab?.title || 'Untitled'
    createOrUpdateNote(selectedText, pageTitle)
  }
})

// Listen for changes to notes and update context menu
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.context_version) {
    createContextMenuItems()
  }
})
