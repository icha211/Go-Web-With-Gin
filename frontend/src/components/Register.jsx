import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
<<<<<<< HEAD
      setError('Password must contain at least 6 characters')
=======
      setError('The password must contain at least 6 characters')
>>>>>>> 73d7158 (role-based authentication)
      return
    }

    setLoading(true)

    const payload = { name, email, password, role }
    const result = await register(payload)
    
    if (result.success) {
      navigate('/albums')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div className="card">
<<<<<<< HEAD
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Sign Up</h2>
=======
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Register</h2>
>>>>>>> 73d7158 (role-based authentication)
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="artist">Artist</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
<<<<<<< HEAD
              {loading ? 'Signing up...' : "Sign up"}
=======
              {loading ? ' Registering...' : "Register"}
>>>>>>> 73d7158 (role-based authentication)
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#007bff' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

