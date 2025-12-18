'use client'

import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

interface ShellProps {
  title: string
  description?: string
  searchPlaceholder?: string
  children: React.ReactNode
  rightSlot?: React.ReactNode
}

export default function Shell({ title, description, searchPlaceholder, children, rightSlot }: ShellProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const nav = [
    { label: 'Albums', to: '/albums', icon: '🎵' },
    { label: 'Tags', to: '/tags', icon: '🏷️' },
    { label: 'Profile', to: '/profile', icon: '👤' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-gray-100">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-white/40 shadow-sm p-6 flex flex-col gap-6">
          <div>
            <div className="text-2xl font-bold text-gray-900">Album Library</div>
            <p className="text-sm text-gray-500">Browse and manage your albums</p>
          </div>
          <nav className="flex flex-col gap-2">
            {nav.map((item) => {
              const active = location.pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                    active
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-700 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Box and Logout */}
          <div className="mt-auto pt-6 border-t border-white/40 space-y-3">
            {user && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-white/60">
                <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Current User</div>
                <div className="text-sm font-bold text-gray-900 mb-1">{user.name || user.email}</div>
                <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-colors text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {description && <p className="text-gray-600 mt-1">{description}</p>}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                {searchPlaceholder && (
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full md:w-80 px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                )}
                {rightSlot}
              </div>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
