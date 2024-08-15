import { useNavigate, useParams } from 'react-router-dom';
import useNoteManager from '@/hooks/useNoteManager';

const DeleteNote = () => {

  const {deleteNote} = useNoteManager()
  const { id } = useParams();
  const navigate = useNavigate();

  
  const handleDelete = ()=>{
    deleteNote(id)
    navigate('/');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this note?</p>
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 transition-colors duration-300"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
    </div>
  );
};

export default DeleteNote;