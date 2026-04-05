import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>💰</div>
        <h1 style={styles.title}>Finance Tracker</h1>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="admin@finance.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div style={styles.hint}>
          <p style={{ marginBottom: '6px', color: '#475569' }}>Demo accounts:</p>
          <p>👑 admin@finance.com / password123</p>
          <p>🔍 analyst@finance.com / password123</p>
          <p>👁 viewer@finance.com / password123</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
  },
  card: {
    background: '#1e293b', borderRadius: '16px', padding: '40px',
    width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    border: '1px solid #334155'
  },
  logo: { fontSize: '48px', textAlign: 'center', marginBottom: '12px' },
  title: { textAlign: 'center', fontSize: '24px', fontWeight: '700', color: '#f1f5f9' },
  subtitle: { textAlign: 'center', color: '#94a3b8', marginBottom: '32px', marginTop: '4px' },
  error: {
    background: '#fee2e222', color: '#ef4444', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #ef444433'
  },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '14px' },
  input: {
    width: '100%', padding: '12px 16px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9',
    fontSize: '15px', outline: 'none'
  },
  button: {
    width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer', marginTop: '8px'
  },
  hint: {
    marginTop: '24px', padding: '16px', background: '#0f172a', borderRadius: '8px',
    fontSize: '13px', color: '#64748b', lineHeight: '2'
  }
}