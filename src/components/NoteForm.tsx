import React, { useState, useEffect, KeyboardEvent } from 'react';

interface NoteFormProps {
  note: { id: string; title: string; content: string; tags: string[] } | null;
  allTags: string[];
  onSave: (title: string, content: string, id: string | undefined, tags: string[]) => void;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, allTags, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [note]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagClick = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(title, content, note?.id, tags);
  };

  return (
    <div className="p-2 bg-white shadow-md rounded-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{note?.id ? 'Edit Note' : 'New Note'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            rows={6}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tags</label>
          <div className="flex flex-wrap mb-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mr-2 mb-2 flex items-center cursor-pointer hover:bg-blue-300" onClick={() => handleTagRemove(tag)}>
                {tag}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleTagRemove(tag); }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Press Enter or comma to add tags"
            className="w-full border border-gray-300 p-2 rounded"
          />
          <div className="flex flex-wrap mt-2">
            {allTags && allTags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full mr-2 mb-2 cursor-pointer hover:bg-gray-300" onClick={() => handleTagClick(tag)}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            {note?.id ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
