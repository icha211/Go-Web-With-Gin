import axios from 'axios'

const API_URL = 'http://localhost:8082'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: async (email: string, password: string, name: string, role: string = 'user') => {
    const response = await api.post('/register', { email, password, name, role })
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/profile')
    return response.data
  },
}

export const albumsAPI = {
  getAll: async () => {
    const response = await api.get('/albums')
    return response.data
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/albums/${id}`)
    return response.data
  },

  create: async (albumData: any) => {
    const response = await api.post('/albums', albumData)
    return response.data
  },

  update: async (id: string | number, albumData: any) => {
    const response = await api.put(`/albums/${id}`, albumData)
    return response.data
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/albums/${id}`)
    return response.data
  },
}

export const tagsAPI = {
  getAll: async () => {
    const response = await api.get('/tags')
    return response.data
  },

  create: async (name: string) => {
    const response = await api.post('/tags', { name })
    return response.data
  },
}

export default api
