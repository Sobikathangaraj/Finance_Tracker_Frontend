import { useEffect, useState } from 'react'
import API from '../api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editRole, setEditRole] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await API.get('/user/getdata')
      setUsers(res.data.result)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await API.put(`/user/updatedata/${id}`, {
        status: currentStatus === 'active' ? 'inactive' : 'active'
      })
      fetchUsers()
    } catch (err) {
      alert('Error updating user')
    }
  }

  const handleRoleUpdate = async (id) => {
    try {
      await API.put(`/user/updatedata/${id}`, { role: editRole })
      setEditingId(null)
      fetchUsers()
    } catch (err) {
      alert('Error updating role')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await API.delete(`/user/deletedata/${id}`)
      fetchUsers()
    } catch (err) {
      alert('Error deleting user')
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Users 👥</h1>
      <p style={styles.subtitle}>Manage user roles and access</p>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {loading ? <div style={styles.empty}>Loading...</div> :
          users.map((u, i) => (
            <div key={i} style={styles.tableRow}>
              <span style={styles.name}>
                <div style={styles.avatar}>{u.name?.[0]?.toUpperCase()}</div>
                {u.name}
              </span>
              <span style={styles.email}>{u.email}</span>
              <span>
                {editingId === u._id ? (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <select style={styles.roleSelect} value={editRole}
                      onChange={e => setEditRole(e.target.value)}>
                      <option value="admin">admin</option>
                      <option value="analyst">analyst</option>
                      <option value="viewer">viewer</option>
                    </select>
                    <button style={styles.saveBtn} onClick={() => handleRoleUpdate(u._id)}>✓</button>
                    <button style={styles.cancelBtn} onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <span style={{ ...styles.role, ...roleColors[u.role] }}
                    onClick={() => { setEditingId(u._id); setEditRole(u.role) }}>
                    {u.role} ✏️
                  </span>
                )}
              </span>
              <span>
                <span style={{
                  ...styles.status,
                  background: u.status === 'active' ? '#16a34a22' : '#dc262622',
                  color: u.status === 'active' ? '#22c55e' : '#ef4444'
                }}>
                  {u.status}
                </span>
              </span>
              <span style={styles.actions}>
                <button style={styles.toggleBtn} onClick={() => handleStatusToggle(u._id, u.status)}>
                  {u.status === 'active' ? '🔒 Deactivate' : '🔓 Activate'}
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(u._id)}>🗑</button>
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

const roleColors = {
  admin: { background: '#4f46e522', color: '#818cf8' },
  analyst: { background: '#0ea5e922', color: '#38bdf8' },
  viewer: { background: '#64748b22', color: '#94a3b8' }
}

const styles = {
  page: { padding: '32px', marginLeft: '240px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#f1f5f9' },
  subtitle: { color: '#94a3b8', marginTop: '4px', marginBottom: '28px' },
  table: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 2fr',
    padding: '14px 20px', background: '#0f172a', color: '#64748b', fontSize: '13px', fontWeight: '600'
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 2fr',
    padding: '14px 20px', borderTop: '1px solid #334155', alignItems: 'center', fontSize: '14px'
  },
  name: { display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', fontWeight: '500' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px'
  },
  email: { color: '#94a3b8' },
  role: {
    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
    width: 'fit-content', textTransform: 'capitalize', cursor: 'pointer'
  },
  roleSelect: {
    padding: '4px 8px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: '6px', color: '#f1f5f9', fontSize: '12px'
  },
  saveBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'
  },
  cancelBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#ef4444'
  },
  status: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  toggleBtn: {
    padding: '6px 12px', background: '#334155', border: 'none',
    borderRadius: '6px', color: '#94a3b8', cursor: 'pointer', fontSize: '12px'
  },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  empty: { padding: '32px', textAlign: 'center', color: '#64748b' }
}