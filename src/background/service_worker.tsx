import StorageUtil from '@/utils/storageUtil'
import { Note } from '@/context/NoteContext'
import truncate from '@/utils/truncate'

// Handle context menu item clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId) {
      const notes = await StorageUtil.getItem('notes')
      const note = notes.find((note: Note) => note.id === info.menuItemId)
      if (note) {
        chrome.scripting.executeScript({
          target: { tabId: tab?.id || 0},
          func: (content:string) => {
            const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
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
    const notes = await StorageUtil.getItem('notes')
  
    const contextMenuItems = notes.filter((note: Note) =>
      note.tags.includes('context')
    )
  
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

// Listen for changes to notes and update context menu
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.context_version) {
    createContextMenuItems()
  }
})
