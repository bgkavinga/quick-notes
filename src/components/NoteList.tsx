import React from 'react';
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete, onCopy }) => {
  return (
    <div>
      {notes.map((note) => (
        <div key={note.id} className="bg-white p-4 mb-2 shadow-md rounded">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">{note.title}</h2>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(note.id)} className="text-blue-500 hover:underline flex items-center">
                <FaEdit className="mr-1" /> Edit
              </button>
              <button onClick={() => onDelete(note.id)} className="text-red-500 hover:underline flex items-center">
                <FaTrash className="mr-1" /> Delete
              </button>
              <button onClick={() => onCopy(note.content)} className="text-gray-500 hover:underline flex items-center">
                <FaCopy className="mr-1" /> Copy
              </button>
            </div>
          </div>
          <ReactMarkdown
            className="markdown mt-2 p-3 bg-gray-100 rounded-md border border-gray-300 text-sm leading-relaxed"
            children={note.content}
          />
        </div>
      ))}
    </div>
  );
};

export default NoteList;
