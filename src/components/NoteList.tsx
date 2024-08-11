import React from 'react';
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface NoteListProps {
  notes: Note[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
  allTags: string[];
  onTagClick: (tag: string) => void;
  selectedTags: string[];
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete, onCopy, allTags, onTagClick, selectedTags }) => {
  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {notes.map((note) => (
        <div key={note.id} className="bg-white p-4 mb-2 shadow-md rounded">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold">{note.title}</h2>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(note.id)} className="text-blue-500 hover:underline">
                <FaEdit /> Edit
              </button>
              <button onClick={() => onDelete(note.id)} className="text-red-500 hover:underline">
                <FaTrash /> Delete
              </button>
              <button onClick={() => onCopy(note.content)} className="text-gray-500 hover:underline">
                <FaCopy /> Copy
              </button>
            </div>
          </div>
          <ReactMarkdown className="markdown mt-2 p-2 rounded" children={note.content} />
          <div className="mt-2">
            <div className="flex flex-wrap mt-1 space-x-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
