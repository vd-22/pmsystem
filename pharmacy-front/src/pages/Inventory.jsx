import { useState, useEffect } from 'react'
import axios from 'axios'

function Inventory() {
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filterLow, setFilterLow] = useState(false)
  const [filterExpiring, setFilterExpiring] = useState(false)
  const [loading, setLoading] = useState(true)
  const [branchId, setBranchId] = useState(1)
  const [branches, setBranches] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/inventory/branches')
      .then(res => setBranches(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:3000/api/inventory/branch/${branchId}`)
      .then(res => {
        setItems(res.data)
        setFiltered(res.data)
        setLoading(false)
      })
  }, [branchId])

  useEffect(() => {
    let result = items
    if (search) {
      result = result.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterLow) {
      result = result.filter(i => i.current_quantity <= i.min_level)
    }
    if (filterExpiring) {
      const soon = new Date()
      soon.setDate(soon.getDate() + 30)
      result = result.filter(i => new Date(i.expiration_date) <= soon)
    }
    setFiltered(result)
  }, [search, filterLow, filterExpiring, items])

  const getStatus = (item) => {
    const exp = new Date(item.expiration_date)
    const now = new Date()
    const soon = new Date()
    soon.setDate(soon.getDate() + 30)
    if (exp < now) return { label: 'Прострочено', color: '#f5222d', bg: '#fff2f0' }
    if (exp <= soon) return { label: 'Закінчується', color: '#fa8c16', bg: '#fff7e6' }
    if (item.current_quantity <= item.min_level) return { label: 'Мало', color: '#faad14', bg: '#fffbe6' }
    return { label: 'Норма', color: '#52c41a', bg: '#f6ffed' }
  }

  const expired = items.filter(i => new Date(i.expiration_date) < new Date())
  const low = items.filter(i => i.current_quantity <= i.min_level)

  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>Управління запасами</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        Перегляд та управління товарними запасами філіалу
      </p>

      {/* Вибір філіалу */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
          Філіал:
        </label>
        <select
          value={branchId}
          onChange={e => setBranchId(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ddd', fontSize: '14px', width: '300px'
          }}
        >
          {branches.map(b => (
            <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Попередження */}
      {expired.length > 0 && (
        <div style={{
          background: '#fff2f0', border: '1px solid #ffccc7',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#cf1322'
        }}>
          ⚠️ Увага! Прострочені препарати — є {expired.length} позицій з простроченим терміном придатності. Негайно вилучіть їх зі складу!
        </div>
      )}

      {/* Статистика */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          background: 'white', borderRadius: '8px', padding: '16px 24px',
          flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>{items.length}</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Всього препаратів</div>
        </div>
        <div style={{
          background: 'white', borderRadius: '8px', padding: '16px 24px',
          flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14' }}>{low.length}</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Низькі запаси</div>
        </div>
        <div style={{
          background: 'white', borderRadius: '8px', padding: '16px 24px',
          flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f5222d' }}>{expired.length}</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Наближається термін</div>
        </div>
      </div>

      {/* Пошук і фільтри */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input
          placeholder="Пошук препарату за назвою або категорією..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ddd', fontSize: '14px'
          }}
        />
        <button
          onClick={() => setFilterExpiring(!filterExpiring)}
          style={{
            padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
            border: '1px solid #ddd', fontSize: '13px',
            background: filterExpiring ? '#fa8c16' : 'white',
            color: filterExpiring ? 'white' : '#333'
          }}
        >
          Термін наближається
        </button>
        <button
          onClick={() => setFilterLow(!filterLow)}
          style={{
            padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
            border: '1px solid #ddd', fontSize: '13px',
            background: filterLow ? '#faad14' : 'white',
            color: filterLow ? 'white' : '#333'
          }}
        >
          Низька кількість
        </button>
      </div>

      {/* Таблиця */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Назва', 'Категорія', 'Кількість', 'Мін. рівень', 'Партія', 'Термін придатності', 'Статус'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '13px', color: '#888', fontWeight: '500'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Завантаження...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Нічого не знайдено</td></tr>
            ) : filtered.map(item => {
              const status = getStatus(item)
              return (
                <tr key={item.stock_id} style={{
                  borderBottom: '1px solid #f0f0f0',
                  background: status.label === 'Прострочено' ? '#fff2f0' : 'white'
                }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{item.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>{item.category}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{item.current_quantity}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>{item.min_level}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>{item.batch_number}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                    {new Date(item.expiration_date).toLocaleDateString('uk-UA')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: status.bg, color: status.color,
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory