// DeleteNote.tsx
import { useNavigate, useParams } from 'react-router-dom';
import StorageUtil from '@/utils/storageUtil'
import { useNoteContext } from '@/context/NoteContext'

const DeleteNote = () => {
    const { notes, setNotes,setFilteredNotes,setNotification } = useNoteContext()
  const { id } = useParams();
  const navigate = useNavigate();

  
  const handleDelete = ()=>{
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    StorageUtil.setItem('notes', updatedNotes);
    setNotification('Note deleted successfully!');
    navigate('/');
  } 

  const handleCancel = ()=>{
    navigate(`/note-edit/${id}`);
  }

  return (
    <>
     <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this note?</p>
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Yes, Delete
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteNote;