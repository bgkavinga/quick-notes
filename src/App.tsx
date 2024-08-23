import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import HomePage from '@/pages/HomePage'
import NoteCreatePage from '@/pages/NoteCreatePage'
import NoteDetailPage from '@/pages/NoteDetailPage'
import NoteDeletePage from '@/pages/NoteDeletePage'
import NoRoutePage from '@/pages/NoRoutePage'
import TagListPage from './pages/TagListPage'
import SettingsPage from '@/pages/SettingsPage'
import useConfigManager from './hooks/useConfigManager'
import useStorageManager from './hooks/useStorageManager'
import Layout from './pages/Layout'
import TagEditPage from './pages/TagEditPage'
import ContextMenuItems from './pages/ContextMenuItems'
import HelpPage from './pages/HelpPage'
import TagDeletePage from './pages/TagDeletePage'

const App: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const { getConfig,isConfigLoading } = useConfigManager()
  const { setItem, getItem } = useStorageManager()

  // Navigate to the last visited route on initial load
  useEffect(() => {
    const loadLastVisit = async () => {
      const lastVisitedRoute = await getItem('lastVisitedRoute')
      if (lastVisitedRoute && location.pathname === '/') {
        const persistState = await getConfig('persistState')
        if (persistState) {
          navigate(lastVisitedRoute)
        }
      }
      setIsInitialLoad(false)
    }
    loadLastVisit()
  }, [isConfigLoading])

  useEffect(() => {
    if (isInitialLoad) {
      return
    }
    const saveLastVisitedRoute = async () => {
      await setItem('lastVisitedRoute', location.pathname)
    }
    saveLastVisitedRoute()
  }, [location, isInitialLoad])

  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<HomePage />} />
        <Route path='/note-update/:id?' element={<NoteCreatePage />} />
        <Route path='/note-detail/:id?' element={<NoteDetailPage />} />
        <Route path='/note-delete/:id' element={<NoteDeletePage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/tag-list' element={<TagListPage />} />
        <Route path='/tag-edit/:tagName' element={<TagEditPage />} />
        <Route path='/tag-edit/:tagName' element={<TagEditPage />} />
        <Route path='/context-menu' element={<ContextMenuItems />} />
        <Route path='/help' element={<HelpPage />} />
        <Route path='/tag-delete/:tagName' element={<TagDeletePage />} />
        <Route path='*' element={<NoRoutePage />} />
      </Route>
    </Routes>
  )
}

export default App
