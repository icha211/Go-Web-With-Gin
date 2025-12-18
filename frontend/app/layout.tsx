import React from 'react'
import { AuthProvider } from '../lib/AuthContext'
import './globals.css'

// Note: Using Google Fonts via CSS import in globals.css
// Font variable: --font-plus-jakarta

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Album Management</title>
      </head>
      <body style={{ fontFamily: 'var(--font-plus-jakarta)' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
