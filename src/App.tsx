import { Route, Routes, useLocation, useNavigate, } from 'react-router-dom';
import React, { useEffect,useState } from 'react';
import HomePage from '@/pages/HomePage';
import NoteEditPage from '@/pages/NoteEditPage';
import NoteDetailPage from '@/pages/NoteDetailPage';
import NoteDeletePage from '@/pages/NoteDeletePage';
import StorageUtil from '@/utils/storageUtil';
import NoRoutePage from '@/pages/NoRoutePage';
import SettingsPage from '@/pages/SettingsPage';
import useConfigManager from './hooks/useConfigManager';


const App: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {getConfig} = useConfigManager()

  // Save the current route to localStorage whenever it changes, but not on initial load
  useEffect(() => {
    if (!isInitialLoad) {
      const saveLastVisitedRoute = async () => {
        await StorageUtil.setItem('lastVisitedRoute', location.pathname);
      };
      saveLastVisitedRoute();
    }
  }, [location, isInitialLoad]);

  // Navigate to the last visited route on initial load
  useEffect(() => {
    const loadLastVisit = async () => {
      const lastVisitedRoute = await StorageUtil.getItem('lastVisitedRoute');
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
        <Route path="*" element={<NoRoutePage />} />
    </Routes>
  );
};

export default App;
