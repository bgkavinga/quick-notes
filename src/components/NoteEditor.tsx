import React, { useState } from 'react';

interface NoteEditorProps {
  note: { id: string; title: string; content: string } | null;
  onSave: (title: string, content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave }) => {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');

  const handleSave = () => {
    debugger
    onSave(title, content);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Content"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-1 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default NoteEditor;
