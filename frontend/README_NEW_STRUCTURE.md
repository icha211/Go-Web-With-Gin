# Album Management Frontend

Modern React + TypeScript frontend with app directory structure.

## 📁 Project Structure

```
frontend/
├── app/                    # Pages (each folder = route)
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page (redirects to login/albums)
│   ├── login/
│   │   └── page.tsx       # Login page with integrated header
│   ├── signup/
│   │   └── page.tsx       # Signup page with integrated header
│   └── albums/
│       ├── page.tsx       # Albums list page with header
│       └── create/
│           └── page.tsx   # Create album page with header
├── lib/                   # Shared utilities
│   ├── AuthContext.tsx    # Authentication context & hooks
│   └── api.ts             # API client with axios interceptors
├── src/
│   └── index.css          # Global styles + Tailwind
├── main.tsx               # App entry point with routing
├── index.html             # HTML template
└── package.json           # Dependencies & scripts
```

## 🎨 Design Pattern

Each page is **self-contained** with:
- ✅ Integrated header (no separate Header component)
- ✅ Authentication check
- ✅ User info display
- ✅ Logout functionality
- ✅ Responsive Tailwind CSS styling

## 🚀 Getting Started

### Install Dependencies

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output in `dist/` folder

### Type Checking

```bash
npm run lint
```

## 🔐 Authentication Flow

1. **Login** → Saves JWT token + user to localStorage
2. **Protected Routes** → Check `isAuthenticated` from `useAuth()`
3. **API Calls** → Auto-attach Bearer token via axios interceptor
4. **401 Response** → Auto-redirect to `/login`

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool

## 📄 Pages Overview

### `/login` - Login Page
- Email + password form
- Error handling
- Redirect to `/albums` on success
- Link to signup

### `/signup` - Signup Page
- Email + password + name + role form
- Password validation (min 6 chars)
- Error handling
- Link to login

### `/albums` - Albums List
- Protected route (requires auth)
- Display all albums in grid
- Search/filter (future)
- Link to create album
- User info in header

### `/albums/create` - Create Album
- Protected route
- Form: title, artist, price, tags
- Tag selection with checkboxes
- Create new tags inline
- Success redirect to albums list

## 🔧 Configuration

### API Base URL

Edit `lib/api.ts`:
```typescript
const API_URL = 'http://localhost:8082'
```

### Port

Edit `vite.config.js`:
```javascript
server: {
  port: 3000
}
```

## 📝 Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8082
```

Use in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082'
```

## 🎯 Key Features

- ✅ App directory structure (Next.js style)
- ✅ Self-contained pages with headers
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ JWT authentication with auto-refresh
- ✅ Protected routes
- ✅ API error handling with interceptors
- ✅ Responsive design

## 📦 Adding New Pages

1. Create folder: `app/your-route/`
2. Add file: `page.tsx`
3. Add route in `main.tsx`:
   ```typescript
   <Route path="/your-route" element={<YourPage />} />
   ```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### TypeScript errors
```bash
npm run lint
```

### Port already in use
Change port in `vite.config.js` or:
```bash
PORT=3001 npm run dev
```

## 🔗 Backend API

Ensure Go backend is running:
```bash
cd ..
go run main.go
```

Backend runs on `http://localhost:8082`
