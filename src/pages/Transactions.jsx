import { useEffect, useState } from 'react'
import API from '../api'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', notes: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 5 }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      const res = await API.get('/transaction/getdata', { params })
      setTransactions(res.data.result)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchTransactions() }, [search, typeFilter, page])

  // reset to page 1 when filter changes
  useEffect(() => { setPage(1) }, [search, typeFilter])

  const handleCreate = async () => {
    try {
      await API.post('/transaction/postdata', form)
      setShowForm(false)
      setForm({ amount: '', type: 'income', category: '', notes: '' })
      fetchTransactions()
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating transaction')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await API.delete(`/transaction/deletedata/${id}`)
      fetchTransactions()
    } catch (err) {
      alert('Error deleting transaction')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Transactions 💸</h1>
        {user.role === 'admin' && (
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Transaction'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={{ color: '#f1f5f9', marginBottom: '16px' }}>New Transaction</h3>
          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="Amount" type="number"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <select style={styles.input} value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input style={styles.input} placeholder="Category"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input style={styles.input} placeholder="Notes"
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button style={styles.addBtn} onClick={handleCreate}>💾 Save</button>
        </div>
      )}

      <div style={styles.filters}>
        <input style={styles.search} placeholder="🔍 Search notes..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.select} value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Category</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Notes</span>
          {user.role === 'admin' && <span>Action</span>}
        </div>
        {loading ? <div style={styles.empty}>Loading...</div> :
          transactions.length === 0 ? <div style={styles.empty}>No transactions found</div> :
            transactions.map((t, i) => (
              <div key={i} style={styles.tableRow}>
                <span style={styles.category}>{t.category}</span>
                <span style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444', textTransform: 'capitalize' }}>
                  {t.type}
                </span>
                <span style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount?.toLocaleString()}
                </span>
                <span style={styles.date}>{new Date(t.date).toLocaleDateString()}</span>
                <span style={styles.notes}>{t.notes || '-'}</span>
                {user.role === 'admin' && (
                  <button style={styles.deleteBtn} onClick={() => handleDelete(t._id)}>🗑</button>
                )}
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.totalText}>Total: {total} transactions</span>
        <div style={styles.pageButtons}>
          <button
            style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}>
            ← Prev
          </button>
          <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
          <button
            style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', marginLeft: '240px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#f1f5f9' },
  addBtn: {
    padding: '10px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
  },
  form: { background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #334155' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  input: {
    padding: '10px 14px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none'
  },
  filters: { display: 'flex', gap: '12px', marginBottom: '20px' },
  search: {
    flex: 1, padding: '10px 16px', background: '#1e293b', border: '1px solid #334155',
    borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none'
  },
  select: {
    padding: '10px 16px', background: '#1e293b', border: '1px solid #334155',
    borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none'
  },
  table: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr 0.5fr',
    padding: '14px 20px', background: '#0f172a', color: '#64748b', fontSize: '13px', fontWeight: '600'
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr 0.5fr',
    padding: '14px 20px', borderTop: '1px solid #334155', alignItems: 'center', fontSize: '14px'
  },
  category: { color: '#f1f5f9', fontWeight: '500' },
  date: { color: '#64748b' },
  notes: { color: '#94a3b8' },
  empty: { padding: '32px', textAlign: 'center', color: '#64748b' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  pagination: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: '20px', padding: '16px', background: '#1e293b',
    borderRadius: '12px', border: '1px solid #334155'
  },
  totalText: { color: '#64748b', fontSize: '14px' },
  pageButtons: { display: 'flex', alignItems: 'center', gap: '12px' },
  pageBtn: {
    padding: '8px 16px', background: '#334155', border: 'none',
    borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontWeight: '600'
  },
  pageInfo: { color: '#94a3b8', fontSize: '14px' }
}