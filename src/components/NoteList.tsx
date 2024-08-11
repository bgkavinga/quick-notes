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
  showNotification: (message: string) => void; // Add showNotification as a prop
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onEdit,
  onDelete,
  onCopy,
  allTags,
  onTagClick,
  selectedTags,
  showNotification, // Destructure showNotification
}) => {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      showNotification('Code copied to clipboard!'); // Use showNotification instead of alert
    }).catch((err) => {
      console.error('Failed to copy code:', err);
    });
  };

  return (
    <div>
      <div className="mb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`text-xs font-medium px-1 py-0.5 rounded-full ${
                selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {notes.map((note) => (
        <div key={note.id} className="bg-white p-2 mb-2 shadow-md rounded">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xs font-semibold text-gray-800">{note.title}</h2>
            <div className="flex space-x-1">
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
          <ReactMarkdown
            className="markdown mt-1 p-1 rounded text-xs"
            components={{
              code({ node, inline, className, children, ...props }) {
                const codeString = String(children).trim();

                return !inline ? (
                  <div className="relative bg-gray-900 text-green-400 p-2 rounded border border-gray-600">
                    <button
                      onClick={() => handleCopyCode(codeString)}
                      className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                    <pre>
                      <code className="font-mono text-sm" {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className="bg-gray-100 text-red-500 p-1 rounded font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
            children={note.content}
          />
          <div className="mt-1">
            <div className="flex flex-wrap mt-1 space-x-1">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs font-medium px-1 py-0.5 rounded-full ${
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
