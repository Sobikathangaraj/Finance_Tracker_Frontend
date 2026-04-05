import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>💰 FinTracker</div>
        <nav style={styles.nav}>
          <NavLink to="/" end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
            📊 Dashboard
          </NavLink>
          {/* viewer cannot see transactions */}
          {(user.role === 'admin' || user.role === 'analyst') && (
            <NavLink to="/transactions" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
              💸 Transactions
            </NavLink>
          )}
          {/* only admin sees users */}
          {user.role === 'admin' && (
            <NavLink to="/users" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
              👥 Users
            </NavLink>
          )}
        </nav>
        <div style={styles.userBox}>
          <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>{user.role}</div>
          </div>
          <button onClick={logout} style={styles.logout}>↩</button>
        </div>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: '240px', background: '#1e293b', display: 'flex',
    flexDirection: 'column', padding: '24px 16px',
    borderRight: '1px solid #334155', position: 'fixed', height: '100vh'
  },
  brand: { fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '32px', paddingLeft: '8px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  link: {
    padding: '12px 16px', borderRadius: '8px', color: '#94a3b8',
    textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s'
  },
  active: { background: '#4f46e5', color: '#fff' },
  userBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px', background: '#0f172a', borderRadius: '10px'
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px'
  },
  userName: { fontSize: '14px', fontWeight: '600', color: '#f1f5f9' },
  userRole: { fontSize: '12px', color: '#64748b', textTransform: 'capitalize' },
  logout: { marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px' },
  main: { flex: 1 }
}