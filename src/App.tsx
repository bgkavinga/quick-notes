import { Route, Routes, useLocation, useNavigate, } from 'react-router-dom';
import React, { useEffect,useState } from 'react';
import HomePage from '@/pages/HomePage';
import NoteEditPage from '@/pages/NoteEditPage';
import NoteDetailPage from '@/pages/NoteDetailPage';
import NoteDeletePage from '@/pages/NoteDeletePage';
import NoRoutePage from '@/pages/NoRoutePage';
import TagListPage from './pages/TagListPage';
import SettingsPage from '@/pages/SettingsPage';
import useConfigManager from './hooks/useConfigManager';
import useStorageManager from './hooks/useStorageManager';


const App: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {getConfig} = useConfigManager()
  const {setItem,getItem} = useStorageManager()

  // Save the current route to localStorage whenever it changes, but not on initial load
  useEffect(() => {
    if (!isInitialLoad) {
      const saveLastVisitedRoute = async () => {
        await setItem('lastVisitedRoute', location.pathname);
      };
      saveLastVisitedRoute();
    }
  }, [location, isInitialLoad]);

  // Navigate to the last visited route on initial load
  useEffect(() => {
    const loadLastVisit = async () => {
      const lastVisitedRoute = await getItem('lastVisitedRoute');
      if (lastVisitedRoute && location.pathname === '/') {
        if(await getConfig('persistState')){
          navigate(lastVisitedRoute);
        }
      }
      setIsInitialLoad(false);
    };
    loadLastVisit();
  }, [navigate, location.pathname]);

  return (
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/note-update/:id?" element={<NoteEditPage />} />
        <Route path="/note-detail/:id?" element={<NoteDetailPage />} />
        <Route path="/note-delete/:id" element={<NoteDeletePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tag-list" element={<TagListPage />} />
        <Route path="*" element={<NoRoutePage />} />
    </Routes>
  );
};

export default App;
