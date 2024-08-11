import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import Notification from './components/Notification';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const [currentNote, setCurrentNote] = useState<{ id: string; title: string; content: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get('notes', (result) => {
      const savedNotes = result.notes || [];
      setNotes(savedNotes);
      setFilteredNotes(savedNotes); // Initialize filtered notes
    });
  }, []);

  const saveNote = (title: string, content: string, id: string | undefined) => {
    let updatedNotes;

    if (id) {
      // Update the existing note
      updatedNotes = notes.map(note =>
        note.id === id ? { ...note, title, content } : note
      );
    } else {
      // Create a new note
      const newNote = { id: Date.now().toString(), title, content };
      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    chrome.storage.local.set({ notes: updatedNotes });
    setIsFormVisible(false);
    setCurrentNote(null);
    const message = id ? 'Note updated successfully!' : 'Note saved successfully!';
    showNotification(message);
  };

  const editNote = (id: string) => {
    const note = notes.find((n) => n.id === id) || null;
    setCurrentNote(note);
    setIsFormVisible(true);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes); // Update filtered notes
    chrome.storage.local.set({ notes: updatedNotes });
    showNotification('Note deleted successfully!');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showNotification('Note copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy note:', err);
    });
  };

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(lowercasedQuery) ||
      note.content.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredNotes(filtered);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const handleExportClick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "notes.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const importedNotes = JSON.parse(result) as Note[];
          setNotes(importedNotes);
          setFilteredNotes(importedNotes);
          chrome.storage.local.set({ notes: importedNotes });
          showNotification('Notes imported successfully!');
        }
      } catch (error) {
        console.error('Failed to import notes:', error);
        showNotification('Failed to import notes.');
      }
    };
    reader.readAsText(file);
  };
  return (
    <div className="flex flex-col h-screen">
      <Header
        onAddClick={() => setIsFormVisible(true)}
        onSearch={handleSearch} // Pass handleSearch to Header
      />
      <main className="flex-1 p-4 overflow-auto">
        <NoteList
          notes={filteredNotes} // Use filtered notes
          onEdit={editNote}
          onDelete={deleteNote}
          onCopy={handleCopy}
        />
        {isFormVisible && (
          <NoteForm
            note={currentNote}
            onSave={saveNote}
            onClose={() => setIsFormVisible(false)}
          />
        )}
      </main>
      <Footer
        message={notification}
        onNotificationClose={() => setNotification(null)}
        onExportClick={handleExportClick} // Pass the export function
        onImportClick={handleImport} // Pass handleImport to Footer
      />
    </div>
  );
};

export default App;
