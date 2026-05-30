import { useState, useEffect } from 'react'
import axios from 'axios'

const roleLabels = {
  pharmacist: 'Фармацевт',
  branch_manager: 'Завідувач аптеки',
  purchase_manager: 'Менеджер закупівель',
  warehouse_manager: 'Завідувач складу',
  admin: 'Адміністратор'
}

function Users() {
  const [users, setUsers] = useState([])
  const [branches, setBranches] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    username: '', password: '', role: 'pharmacist', branchId: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadUsers()
    axios.get('http://localhost:3000/api/inventory/branches')
      .then(r => setBranches(r.data))
  }, [])

  const loadUsers = () => {
    axios.get('http://localhost:3000/api/users').then(r => setUsers(r.data))
  }

  const handleCreate = async () => {
    if (!form.username || !form.password) {
      setError('Заповніть логін і пароль')
      return
    }
    try {
      await axios.post('http://localhost:3000/api/users/create', form)
      setSuccess('Користувача створено!')
      setError('')
      setForm({ username: '', password: '', role: 'pharmacist', branchId: '' })
      setShowForm(false)
      loadUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка')
    }
  }

  const handleDelete = async (userId, username) => {
    if (!confirm(`Видалити користувача ${username}?`)) return
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`)
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const needsBranch = ['pharmacist', 'branch_manager'].includes(form.role)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ marginBottom: '4px' }}>Користувачі</h2>
          <p style={{ color: '#888' }}>Управління обліковими записами системи</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px', background: '#1890ff',
            color: 'white', border: 'none', borderRadius: '6px',
            fontSize: '14px', cursor: 'pointer'
          }}
        >
          + Додати користувача
        </button>
      </div>

      {success && (
        <div style={{
          background: '#f6ffed', border: '1px solid #b7eb8f',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#389e0d'
        }}>
          ✅ {success}
        </div>
      )}

      {/* Форма створення */}
      {showForm && (
        <div style={{
          background: 'white', borderRadius: '8px',
          padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px' }}>Новий користувач</h3>

          {error && (
            <div style={{ color: '#f5222d', marginBottom: '12px', fontSize: '14px' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
                Логін
              </label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Введіть логін"
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '6px',
                  border: '1px solid #ddd', fontSize: '14px'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
                Пароль
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Введіть пароль"
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '6px',
                  border: '1px solid #ddd', fontSize: '14px'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
                Роль
              </label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value, branchId: '' })}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '6px',
                  border: '1px solid #ddd', fontSize: '14px'
                }}
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {needsBranch && (
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
                  Філіал
                </label>
                <select
                  value={form.branchId}
                  onChange={e => setForm({ ...form, branchId: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: '6px',
                    border: '1px solid #ddd', fontSize: '14px'
                  }}
                >
                  <option value="">Оберіть філіал</option>
                  {branches.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleCreate}
              style={{
                padding: '10px 24px', background: '#52c41a',
                color: 'white', border: 'none', borderRadius: '6px',
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              Створити
            </button>
            <button
              onClick={() => { setShowForm(false); setError('') }}
              style={{
                padding: '10px 24px', background: 'white',
                color: '#333', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      {/* Таблиця користувачів */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['ID', 'Логін', 'Роль', 'Філіал', 'Дії'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '13px', color: '#888', fontWeight: '500'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: '13px' }}>#{user.user_id}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{user.username}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: '#f0f0f0', color: '#333',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                  }}>
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>
                  {user.branch_name || '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => handleDelete(user.user_id, user.username)}
                    style={{
                      padding: '4px 12px', background: '#fff2f0',
                      color: '#f5222d', border: '1px solid #ffccc7',
                      borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users