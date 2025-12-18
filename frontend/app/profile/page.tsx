'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { authAPI, albumsAPI } from '../../lib/api'
import Shell from '../components/Shell'

interface Album {
  id: number
  title: string
  artist: string
  price: number
  cover?: string
  user_id?: number
  tags?: Array<{ id: number; name: string }>
}

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(user)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState('')
  const [albums, setAlbums] = useState<Album[]>([])
  const [albumsLoading, setAlbumsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!user) {
      loadProfile()
    }
    loadUserAlbums()
  }, [isAuthenticated, navigate, user])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await authAPI.getProfile()
      setProfile(data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const loadUserAlbums = async () => {
    try {
      setAlbumsLoading(true)
      const allAlbums = await albumsAPI.getAll()
      // Filter albums owned by current user
      const userAlbums = allAlbums.filter((album: any) => album.user_id === user?.id)
      setAlbums(userAlbums)
    } catch (err) {
      console.error('Error loading albums:', err)
    } finally {
      setAlbumsLoading(false)
    }
  }

  const handleDelete = async (albumId: number) => {
    if (!confirm('Are you sure you want to delete this album?')) return

    try {
      await albumsAPI.delete(albumId)
      setAlbums(albums.filter(album => album.id !== albumId))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error deleting album')
    }
  }

  const fallbackCover = (id: number) => `https://picsum.photos/seed/album-${id}/480/640`

  if (!isAuthenticated) return null

  return (
    <Shell
      title="Profile"
      description="Your account details"
      searchPlaceholder={undefined}
    >
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">{error}</div>
      )}

      {!loading && !error && profile && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-white/60 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Account</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <div><span className="font-semibold">Name:</span> {profile.name || '—'}</div>
                <div><span className="font-semibold">Email:</span> {profile.email}</div>
                <div><span className="font-semibold">Role:</span> {profile.role || 'user'}</div>
                <div><span className="font-semibold">ID:</span> {profile.id}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-white/60 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Security</h2>
              <p className="text-sm text-gray-600 mb-4">Keep your account secure. Rotate your password regularly.</p>
              <button
                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                onClick={() => alert('Password change flow not implemented yet.')}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Your Albums Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Albums</h2>
              <a
                href="/albums/create"
                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
              >
                + New Album
              </a>
            </div>

            {albumsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-gray-600">Loading your albums...</p>
              </div>
            ) : albums.length === 0 ? (
              <div className="bg-white/70 rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-600 mb-4">You haven't created any albums yet.</p>
                <a
                  href="/albums/create"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Create Your First Album
                </a>
              </div>
            ) : (
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

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => navigate(`/albums/edit/${album.id}`)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(album.id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Shell>
  )
}
