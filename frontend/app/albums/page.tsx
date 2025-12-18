"use client"

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../components/Shell'
import { useAuth } from '../../lib/AuthContext'
import { albumsAPI } from '../../lib/api'

interface Album {
    id: string | number
    title: string
    artist: string
    price?: number
    cover?: string
    user?: {
      name?: string
      email?: string
    }
    tags?: Array<{
      id: string | number
      name: string
    }>
  }

  const fallbackCover = (id: number | string) => `https://picsum.photos/seed/album-${id}/480/640`

  export default function AlbumsPage() {
    const [albums, setAlbums] = useState<Album[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      loadAlbums()
    }, [isAuthenticated, navigate])

    const loadAlbums = async () => {
      try {
        setLoading(true)
        const data = await albumsAPI.getAll()
        setAlbums(data)
        setError('')
      } catch (err) {
        setError('Error loading albums')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const handleDelete = async (albumId: string | number) => {
      if (!confirm('Are you sure you want to delete this album?')) return

      try {
        await albumsAPI.delete(albumId)
        setAlbums(albums.filter(album => album.id !== albumId))
      } catch (err: any) {
        alert(err.response?.data?.error || 'Error deleting album')
      }
    }

    const isAdmin = user?.role === 'admin'
    const canManageAlbum = (album: Album) => {
      return isAdmin || album.user?.email === user?.email
    }

    if (!isAuthenticated) {
      return null
    }

    return (
      <Shell
        title="Album Catalogue"
        description="Browse and manage your album collection"
        searchPlaceholder="Search title, artist, genre..."
        rightSlot={
          <a
            href="/albums/create"
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
          >
            + New Album
          </a>
        }
      >
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading albums...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        {!loading && !error && albums.length === 0 && (
          <div className="bg-white/70 rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-600 mb-4">No albums available. Create your first album!</p>
            <a
              href="/albums/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Create Album
            </a>
          </div>
        )}

        {!loading && !error && albums.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-white/60"
              >
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={album.cover || fallbackCover(album.id)}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 text-xs px-3 py-1 bg-blue-600 text-white rounded-full shadow">
                    AVAILABLE
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{album.title}</h3>
                  <p className="text-sm text-gray-600">{album.artist}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    €{album.price ? album.price.toFixed(2) : '0.00'}
                  </p>

                  {album.tags && album.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {album.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {album.user && (
                    <p className="text-xs text-gray-500 mt-1">By {album.user.name || album.user.email}</p>
                  )}

                  {canManageAlbum(album) && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/albums/edit/${album.id}`)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(album.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Shell>
    )
  }

