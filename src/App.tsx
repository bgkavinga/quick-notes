import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NoteDetailPage from '@/pages/NoteDetailPage';

const App: React.FC = () => {
  
  return (
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/note/:id?" element={<NoteDetailPage />} />
      </Routes>
  );
};

export default App;
