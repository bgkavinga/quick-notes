// DeleteNote.tsx
import  { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StorageUtil from '@/utils/storageUtil'
import { useNoteContext } from '@/context/NoteContext'

const DeleteNote = () => {
    const { notes, setNotes,setFilteredNotes,setNotification } = useNoteContext()
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    StorageUtil.setItem('notes', updatedNotes);
    setNotification('Note deleted successfully!');
    navigate('/');
  }, [id, notes, setNotes, setFilteredNotes, setNotification, navigate]);

  return null;
};

export default DeleteNote;