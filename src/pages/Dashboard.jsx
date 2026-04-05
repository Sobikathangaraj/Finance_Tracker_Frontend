import { useEffect, useState } from 'react'
import API from '../api'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c, r] = await Promise.all([
          API.get('/dashboard/summary'),
          API.get('/dashboard/category-totals'),
          API.get('/dashboard/recent-activity')
        ])
        setSummary(s.data.result)
        setCategories(c.data.result)
        setRecent(r.data.result)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Dashboard 📊</h1>
      <p style={styles.subtitle}>Welcome back, {user.name}!</p>

      <div style={styles.cards}>
        <div style={{ ...styles.card, borderTop: '3px solid #22c55e' }}>
          <div style={styles.cardLabel}>💚 Total Income</div>
          <div style={{ ...styles.cardValue, color: '#22c55e' }}>₹{summary?.totalIncome?.toLocaleString()}</div>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #ef4444' }}>
          <div style={styles.cardLabel}>❤️ Total Expenses</div>
          <div style={{ ...styles.cardValue, color: '#ef4444' }}>₹{summary?.totalExpense?.toLocaleString()}</div>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #4f46e5' }}>
          <div style={styles.cardLabel}>💜 Net Balance</div>
          <div style={{ ...styles.cardValue, color: '#4f46e5' }}>₹{summary?.netBalance?.toLocaleString()}</div>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📂 Category Totals</h2>
          {categories.map((cat, i) => (
            <div key={i} style={styles.catRow}>
              <span style={styles.catName}>{cat._id}</span>
              <span style={styles.catAmount}>₹{cat.total?.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🕐 Recent Activity</h2>
          {recent.slice(0, 5).map((t, i) => (
            <div key={i} style={styles.recentRow}>
              <div>
                <div style={styles.recentCat}>{t.category}</div>
                <div style={styles.recentNote}>{t.notes}</div>
              </div>
              <div style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', marginLeft: '240px' },
  loading: { padding: '32px', marginLeft: '240px', color: '#94a3b8' },
  title: { fontSize: '28px', fontWeight: '700', color: '#f1f5f9' },
  subtitle: { color: '#94a3b8', marginTop: '4px', marginBottom: '28px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' },
  cardLabel: { color: '#94a3b8', fontSize: '14px', marginBottom: '8px' },
  cardValue: { fontSize: '32px', fontWeight: '700' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  section: { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' },
  catRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155' },
  catName: { color: '#94a3b8' },
  catAmount: { color: '#f1f5f9', fontWeight: '600' },
  recentRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #334155' },
  recentCat: { color: '#f1f5f9', fontSize: '14px', fontWeight: '500' },
  recentNote: { color: '#64748b', fontSize: '12px' },
}