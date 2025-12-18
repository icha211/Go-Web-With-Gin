'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../../lib/AuthContext'
import { albumsAPI, tagsAPI } from '../../../../lib/api'

export default function EditAlbumPage() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [price, setPrice] = useState('')
  const [cover, setCover] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [showNewTagInput, setShowNewTagInput] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [loadingTags, setLoadingTags] = useState(true)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadAlbum()
    loadTags()
  }, [isAuthenticated, navigate, id])

  const loadAlbum = async () => {
    try {
      setLoadingData(true)
      const album = await albumsAPI.getById(id!)
      
      // Check if user has permission to edit
      const isAdmin = user?.role === 'admin'
      const isOwner = album.user_id === user?.id
      
      if (!isAdmin && !isOwner) {
        setError('You do not have permission to edit this album')
        setTimeout(() => navigate('/albums'), 2000)
        return
      }

      setTitle(album.title)
      setArtist(album.artist)
      setPrice(album.price.toString())
      setCover(album.cover || '')
      setCoverPreview(album.cover || '')
      
      if (album.tags) {
        setSelectedTags(album.tags.map((tag: any) => tag.ID || tag.id))
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading album')
    } finally {
      setLoadingData(false)
    }
  }

  const loadTags = async () => {
    try {
      setLoadingTags(true)
      const data = await tagsAPI.getAll()
      setTags(data)
    } catch (err) {
      console.error('Error loading tags:', err)
    } finally {
      setLoadingTags(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tagId)
      if (isSelected) {
        return prev.filter(id => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) {
      setError('Tag name cannot be empty')
      return
    }

    try {
      const newTag = await tagsAPI.create(newTagName.trim())
      setTags([...tags, newTag])
      setSelectedTags([...selectedTags, newTag.id])
      setNewTagName('')
      setShowNewTagInput(false)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating tag')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a positive number')
      return
    }

    setLoading(true)

    try {
      const albumData: any = {
        title,
        artist,
        price: priceNum,
        cover: cover || '',
      }

      if (selectedTags.length > 0) {
        albumData.tag_ids = selectedTags
      }

      await albumsAPI.update(id!, albumData)
      setSuccess('Album updated successfully!')
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error updating album')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading album...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Edit Album</h1>
          <nav className="flex items-center space-x-4">
            <a href="/albums" className="text-gray-700 hover:text-blue-600 font-medium">
              Albums
            </a>
            {user && (
              <span className="px-4 py-2 text-gray-600">
                {user.name || user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Update Album</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Album title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group mb-6">
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
                  Artist *
                </label>
                <input
                  type="text"
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                  placeholder="Artist name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group mb-6">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group mb-6">
                <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  id="cover"
                  value={cover}
                  onChange={(e) => {
                    setCover(e.target.value)
                    setCoverPreview(e.target.value)
                  }}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {coverPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-48 h-64 object-cover rounded-md border border-gray-300"
                      onError={() => setCoverPreview('')}
                    />
                  </div>
                )}
              </div>

              <div className="form-group mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                {loadingTags ? (
                  <div className="py-4 text-gray-600">Loading tags...</div>
                ) : (
                  <>
                    <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto bg-gray-50">
                      {tags.length === 0 ? (
                        <div className="text-gray-500 italic">No tags available</div>
                      ) : (
                        tags.map((tag: any) => {
                          const tagId = tag.ID || tag.id
                          return (
                            <div
                              key={tagId}
                              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer mb-2"
                            >
                              <input
                                type="checkbox"
                                id={`tag-${tagId}`}
                                checked={selectedTags.includes(tagId)}
                                onChange={() => handleTagToggle(tagId)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                              />
                              <label
                                htmlFor={`tag-${tagId}`}
                                className="ml-3 text-gray-700 cursor-pointer flex-1"
                              >
                                {tag.name}
                              </label>
                            </div>
                          )
                        })
                      )}
                    </div>
                    
                    {!showNewTagInput ? (
                      <button
                        type="button"
                        className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => setShowNewTagInput(true)}
                      >
                        + Create New Tag
                      </button>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="New tag name"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleCreateTag(e)
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={handleCreateTag}
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                          onClick={() => {
                            setShowNewTagInput(false)
                            setNewTagName('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {error && (
                <div className="error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="success bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Album'}
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => navigate('/profile')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
