import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NoteUpdatePage from '@/pages/NoteUpdatePage';
import NoteDetailPage from '@/pages/NoteDetailPage';
import DeleteNote from '@/pages/DeleteNote';

const App: React.FC = () => {
  
  return (
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/note/:id?" element={<NoteUpdatePage />} />
        <Route path="/note-detail/:id?" element={<NoteDetailPage />} />
        <Route path="/note-delete/:id" element={<DeleteNote />} />
      </Routes>
  );
};

export default App;
