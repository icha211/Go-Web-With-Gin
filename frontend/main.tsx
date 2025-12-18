import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StrictMode } from 'react'
import { AuthProvider } from './lib/AuthContext'
import AuthGuard from './app/components/AuthGuard'
import './app/globals.css'

// pages
import HomePage from './app/page'
import LoginPage from './app/login/page'
import SignupPage from './app/signup/page'
import AlbumsPage from './app/albums/page'
import CreateAlbumPage from './app/albums/create/page'
import EditAlbumPage from './app/albums/edit/[id]/page'
import TagsPage from './app/tags/page'
import ProfilePage from './app/profile/page'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AuthGuard>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/create" element={<CreateAlbumPage />} />
            <Route path="/albums/edit/:id" element={<EditAlbumPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
