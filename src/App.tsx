import React, { useState, useEffect, useCallback } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import Header from './components/Header';
import Footer from './components/Footer';

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.local.get('notes', (result) => {
      const savedNotes = result.notes || [];
      setNotes(savedNotes);
      setFilteredNotes(savedNotes);
    });
  }, []);

  const saveNote = useCallback((title: string, content: string, id: string | undefined, tags: string[]) => {
    let updatedNotes: Note[];

    if (id) {
      updatedNotes = notes.map(note =>
        note.id === id ? { ...note, title, content, tags } : note
      );
    } else {
      const newNote: Note = { id: Date.now().toString(), title, content, tags };
      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      showNotification(id ? 'Note updated successfully!' : 'Note saved successfully!');
    });
    setCurrentNote(null);
  }, [notes]);

  const editNote = useCallback((id: string) => {
    const note = notes.find((n) => n.id === id) || null;
    setCurrentNote(note);
  }, [notes]);

  const deleteNote = useCallback((id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      showNotification('Note deleted successfully!');
    });
  }, [notes]);

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showNotification('Note copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy note:', err);
    });
  }, []);

  const handleSearch = useCallback((query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(lowercasedQuery) ||
      note.content.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredNotes(filtered);
  }, [notes]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportClick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "notes.json");
    document.body.appendChild(downloadAnchorNode);
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
          chrome.storage.local.set({ notes: importedNotes }, () => {
            showNotification('Notes imported successfully!');
          });
        }
      } catch (error) {
        console.error('Failed to import notes:', error);
        showNotification('Failed to import notes.');
      }
    };
    reader.readAsText(file);
  };

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const filteredByTags = filteredNotes.filter(note =>
    selectedTags.length === 0 || note.tags.some(tag => selectedTags.includes(tag))
  );

  return (
    <div className="flex flex-col h-screen">
      <Header
        onAddClick={() => setCurrentNote({ id: '', title: '', content: '', tags: [] })} // Open NoteForm for new note
        onSearch={handleSearch}
      />
      <main className="flex-1 p-4 overflow-auto">
        {currentNote ? (
          <NoteForm
            note={currentNote}
            allTags={allTags}
            onSave={saveNote}
            onClose={() => setCurrentNote(null)}
          />
        ) : (
          <NoteList
            notes={filteredByTags}
            onEdit={editNote}
            onDelete={deleteNote}
            onCopy={handleCopy}
            allTags={allTags}
            onTagClick={handleTagClick}
            selectedTags={selectedTags}
            showNotification={showNotification}
          />
        )}
      </main>
      <Footer
        message={notification||''}
        onExportClick={handleExportClick}
        onImportClick={handleImport}
      />
    </div>
  );
};

export default App;
