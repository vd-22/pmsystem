import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
  const [branches, setBranches] = useState([])
  const [allStats, setAllStats] = useState({})
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get('http://localhost:3000/api/inventory/branches')
      .then(async res => {
        setBranches(res.data)
        const statsData = {}
        for (const branch of res.data) {
          const s = await axios.get(`http://localhost:3000/api/inventory/stats/${branch.branch_id}`)
          statsData[branch.branch_id] = s.data
        }
        setAllStats(statsData)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '40px' }}>Завантаження...</div>

  const totalItems = Object.values(allStats).reduce((sum, s) => sum + (s.total || 0), 0)
  const totalLow = Object.values(allStats).reduce((sum, s) => sum + (s.low || 0), 0)
  const totalExpired = Object.values(allStats).reduce((sum, s) => sum + (s.expired || 0), 0)
  const totalExpiring = Object.values(allStats).reduce((sum, s) => sum + (s.expiring || 0), 0)
  const totalRevenue = branches.reduce((sum, b) => sum + (parseFloat(b.monthly_revenue) || 0), 0)

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Панель управління</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Вітаємо, {user?.username}! Ось зведена статистика мережі.
      </p>

      {totalExpired > 0 && (
        <div style={{
          background: '#fff2f0', border: '1px solid #ffccc7',
          borderRadius: '8px', padding: '12px 16px',
          marginBottom: '24px', color: '#cf1322'
        }}>
           По мережі є {totalExpired} препаратів з простроченим терміном придатності!
        </div>
      )}

      {/* Загальна статистика мережі */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Всього позицій', value: totalItems, color: '#1890ff' },
          { label: 'Низькі залишки', value: totalLow, color: '#faad14' },
          { label: 'Закінчується термін', value: totalExpiring, color: '#fa8c16' },
          { label: 'Прострочено', value: totalExpired, color: '#f5222d' },
          { label: 'Дохід мережі', value: `${(totalRevenue/1000).toFixed(0)}К грн`, color: '#52c41a' },
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, background: 'white', borderRadius: '8px',
            padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderTop: `3px solid ${card.color}`
          }}>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: card.color }}>
              {card.value}
            </div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Таблиця філіалів */}
      <div style={{
        background: 'white', borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>Стан запасів по філіалах</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Філіал', 'Тип', 'Всього', 'Низькі залишки', 'Закінчується', 'Прострочено', 'Статус'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '13px', color: '#888', fontWeight: '500'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => {
              const s = allStats[branch.branch_id] || {}
              return (
                <tr key={branch.branch_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{branch.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{branch.address}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: branch.branch_type === 'warehouse' ? '#e6f7ff' : '#f6ffed',
                      color: branch.branch_type === 'warehouse' ? '#1890ff' : '#52c41a',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>
                      {branch.branch_type === 'warehouse' ? 'Склад' : 'Аптека'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1890ff' }}>
                    {s.total || 0}
                  </td>
                  <td style={{ padding: '12px 16px', color: s.low > 0 ? '#faad14' : '#888' }}>
                    {s.low || 0}
                  </td>
                  <td style={{ padding: '12px 16px', color: s.expiring > 0 ? '#fa8c16' : '#888' }}>
                    {s.expiring || 0}
                  </td>
                  <td style={{ padding: '12px 16px', color: s.expired > 0 ? '#f5222d' : '#888' }}>
                    {s.expired || 0}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: branch.is_active ? '#f6ffed' : '#f5f5f5',
                      color: branch.is_active ? '#52c41a' : '#999',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>
                      {branch.is_active ? 'Активна' : 'Неактивна'}
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

export default Dashboard