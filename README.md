# Album Library - Go Web API with React Frontend

**A modern full-stack music album management application built with Go, Gin, and React**

**Team:** Group 14 - Khairunnnisa Rahmahdani Danang (5025231081) & Gabin Joussot-Dubien


---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**Album Library** is a comprehensive music album management system that allows users to create, browse, and manage their album collections. The application features role-based access control with distinct permissions for regular users and administrators, complete with modern authentication using JWT tokens.

### Key Capabilities
- 🎵 Browse and manage music albums with detailed information
- 🏷️ Organize albums with custom tags and categories
- 👥 User authentication with JWT tokens
- 👨‍💼 Admin panel for system-wide album management
- 🎨 Modern, responsive UI built with React and Tailwind CSS
- 📱 Mobile-friendly design

---

## ✨ Features

### 🔐 Authentication & Authorization

**User Roles:**
- **Regular User**: Create, update, and delete their own albums; browse all albums
- **Admin**: Full control - create, update, and delete any album in the system

**Security Features:**
- JWT-based authentication with 24-hour token expiry
- Bcrypt password hashing
- Protected API endpoints with role-based access control
- CORS configured for secure frontend communication

### 📚 Album Management

- **Create Albums** - Add new albums with title, artist, price, cover image, and tags
- **Read Albums** - View all albums or specific album details
- **Update Albums** - Modify album information (users: own only, admins: any)
- **Delete Albums** - Remove albums from library (users: own only, admins: any)
- **Album Cover Images** - Store and display album cover images via URLs
- **Tag Association** - Organize albums with custom tags

### 👤 User Management

- User registration with email and password
- Role assignment (user or admin)
- Profile viewing with personal album collection
- Personal album management dashboard

### 🏷️ Tag System

- Create and manage tags/categories
- Associate multiple tags with albums
- View all albums associated with specific tags
- Display album count per tag

---

## 🛠 Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Go** | Programming language |
| **Gin** | Web framework & router |
| **GORM** | ORM for database operations |
| **SQLite** | Database (albums.db) |
| **JWT** | JSON Web Tokens for authentication |
| **Bcrypt** | Password hashing & security |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **React Router** | Client-side routing |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | HTTP client with interceptors |

### Database
- **SQLite3** - Lightweight, file-based database
- **Automatic Migrations** - Schema management via GORM

---

## 📁 Project Structure

```
Go-Web-with-Gin/
├── controllers/                    # API request handlers
│   ├── albumsController.go        # Album CRUD operations
│   ├── authController.go          # Authentication (register/login)
│   ├── tagsController.go          # Tag management
│   └── userController.go          # User operations
├── models/                         # Data models
│   ├── album.go                   # Album model with relations
│   ├── user.go                    # User model with auth
│   ├── tag.go                     # Tag model
│   └── album_tag.go               # Join table for many-to-many
├── middleware/                     # Middleware functions
│   ├── auth.go                    # JWT authentication
│   ├── authMiddleware.go          # Route protection
│   └── roles.go                   # Role-based access control
├── initializers/                   # Initialization code
│   ├── database.go                # DB connection & migration
│   └── loadEnv.go                 # Environment variables
├── utils/                          # Utility functions
│   └── jwt.go                     # JWT token generation
├── frontend/                       # React frontend (TypeScript)
│   ├── app/                       # App directory structure
│   │   ├── albums/                # Album pages
│   │   ├── login/                 # Login page
│   │   ├── signup/                # Registration page
│   │   ├── profile/               # User profile
│   │   ├── tags/                  # Tags management
│   │   └── components/            # Reusable components
│   ├── lib/                       # Utilities & contexts
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── api.ts                 # API client
│   ├── main.tsx                   # React entry point
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   └── package.json               # Frontend dependencies
├── postman_collection/             # API testing
│   ├── Go-Web-Gin-API.postman_collection.json
│   ├── Local.postman_environment.json
│   └── Production.postman_environment.json
├── main.go                         # Application entry point
├── go.mod                          # Go module definition
├── go.sum                          # Go dependencies checksums
├── .env                            # Environment variables
└── albums.db                       # SQLite database file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Go** 1.20 or newer
- **Node.js** 16+ and npm
- **SQLite3** (usually pre-installed)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/icha211/Go-Web-With-Gin.git
   cd Go-Web-with-Gin
   ```

2. **Install Go dependencies**
   ```bash
   go mod download
   ```

3. **Create `.env` file** (optional - default values will be used)
   ```env
   JWT_SECRET=your-super-secret-key-change-in-production
   PORT=8082
   FRONTEND_ORIGIN=http://localhost:3000
   ```

4. **Run the backend server**
   ```bash
   go run main.go
   ```
   Backend will start at `http://localhost:8082`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will start at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📖 Usage

### Quick Start

1. Start the backend: `go run main.go`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000` in your browser
4. Register a new account or use test credentials

### Test Accounts

**Regular User:**
- Email: `test@example.com`
- Password: `password123`

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

*(Create these accounts via signup if they don't exist)*

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/profile` | Get authenticated user's profile | ✅ |

### Album Endpoints

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|-----------|
| GET | `/albums` | Get all albums | ✅ | All |
| GET | `/albums/:id` | Get album by ID | ✅ | All |
| POST | `/albums` | Create new album | ✅ | User/Admin |
| PUT | `/albums/:id` | Update album | ✅ | Owner/Admin |
| DELETE | `/albums/:id` | Delete album | ✅ | Owner/Admin |

### Tag Endpoints

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|-----------|
| GET | `/tags` | Get all tags | ✅ | All |
| POST | `/tags` | Create new tag | ✅ | All |

---

## 📊 Database Models

### User Model
```go
type User struct {
    ID       uint      // Primary key
    Email    string    // Unique email
    Password string    // Bcrypt hashed
    Name     string    // Display name
    Role     string    // "user" or "admin"
    Albums   []Album   // One-to-many relation
}
```

### Album Model
```go
type Album struct {
    ID     uint      // Primary key
    Title  string    // Album title
    Artist string    // Artist name
    Price  float64   // Album price
    Cover  string    // Cover image URL
    UserID *uint     // Foreign key (nullable)
    User   User      // One-to-many relation
    Tags   []Tag     // Many-to-many relation
}
```

### Tag Model
```go
type Tag struct {
    ID     uint      // Primary key
    Name   string    // Tag name (unique)
    Albums []Album   // Many-to-many relation
}
```

---

## 🔐 Authentication & Authorization

### How It Works

1. **Registration** → User creates account with email & password
2. **Login** → Credentials validated, JWT token issued
3. **Token Storage** → Token stored in browser localStorage
4. **Protected Requests** → Token sent in `Authorization: Bearer <token>` header
5. **Token Validation** → Backend validates & extracts user info
6. **Role Check** → Access control based on user role

### Permission Rules

**Regular Users:**
- ✅ Can create albums
- ✅ Can view all albums
- ✅ Can update/delete their own albums
- ❌ Cannot manage other users' albums
- ❌ Cannot access admin functions

**Admins:**
- ✅ Can perform all actions
- ✅ Can update/delete any album
- ✅ Can manage all tags
- ✅ Full system access

---

## 🧪 Testing with Postman

1. Import `postman_collection/Go-Web-Gin-API.postman_collection.json`
2. Select environment (Local or Production)
3. Run "Register" or "Login" request to get token
4. Token auto-saves to collection variables
5. Other requests automatically include token

---

## 📝 Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Server Configuration
PORT=8082

# CORS Configuration
FRONTEND_ORIGIN=http://localhost:3000

# Database (optional - default: albums.db)
# DB_PATH=./albums.db
```

---

## 🔄 Data Relations

### One-to-Many
A **User** can have multiple **Albums**. When an album is created, it's associated with the creating user.

### Many-to-Many
An **Album** can have multiple **Tags**, and a **Tag** can be associated with multiple **Albums**. A join table `album_tags` manages this relation.

---

## ✅ Notable Features

- ⚡ **Fast API** - Built with Gin for high performance
- 🔒 **Secure** - JWT tokens + bcrypt password hashing
- 📱 **Responsive UI** - Mobile-first design with Tailwind CSS
- 🎯 **Type-Safe** - Frontend written in TypeScript
- 🔄 **Auto-Migrations** - Database schema auto-updates with GORM
- 🖼️ **Cover Images** - Support for album cover images via URLs
- 🎨 **Modern Styling** - Beautiful gradient background and responsive layout
- 👤 **User Dashboard** - Personal album management view

---

## 📄 License

This project is part of Framework Programming 2025 course work.

---

## 👨‍💻 Author

**Khairunnnisa Rahmahdani Danang**  
Student ID: 5025231081  
**Gabin Joussot-Dubien**
Group: 14

---

## 🎓 Course

Framework Programming 2025
