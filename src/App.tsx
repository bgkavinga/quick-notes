import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NoteDetailPage from '@/pages/NoteDetailPage';
import DeleteNote from '@/pages/DeleteNote';

const App: React.FC = () => {
  
  return (
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/note/:id?" element={<NoteDetailPage />} />
        <Route path="/delete-note/:id" element={<DeleteNote />} />
      </Routes>
  );
};

export default App;
