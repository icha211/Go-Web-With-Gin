'use client'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tagsAPI } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import Shell from '../components/Shell'

export default function TagsPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [tags, setTags] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadTags()
  }, [isAuthenticated, navigate])

  const loadTags = async () => {
    try {
      setLoading(true)
      const data = await tagsAPI.getAll()
      setTags(data)
      setError('')
    } catch (err) {
      setError('Error loading tags')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      setCreating(true)
      const newTag = await tagsAPI.create(name.trim())
      setTags((prev) => [...prev, newTag])
      setName('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating tag')
    } finally {
      setCreating(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <Shell
      title="Tags"
      description="Organize your albums by tags"
      searchPlaceholder="Search tags..."
      rightSlot={
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New tag name"
            className="px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {creating ? 'Adding...' : 'Add'}
          </button>
        </form>
      }
    >
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tags...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{tag.name}</p>
                  <p className="text-xs text-gray-500">ID: {tag.ID}</p>
                </div>
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">TAG</span>
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-xs text-gray-600 mb-1">Associated Albums:</p>
                {tag.albums && tag.albums.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {tag.albums.map((album: any) => (
                      <span
                        key={album.ID}
                        className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
                      >
                        {album.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No albums yet</p>
                )}
              </div>
            </div>
          ))}
          {tags.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
              No tags yet. Create one to get started.
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}
