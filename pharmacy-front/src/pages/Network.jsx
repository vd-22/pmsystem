import { useState, useEffect } from 'react'
import axios from 'axios'

function Network() {
  const [branches, setBranches] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  const totalRevenue = Object.values(branches).reduce((sum, b) => sum + (parseFloat(b.monthly_revenue) || 0), 0)
  const activeBranches = branches.filter(b => b.is_active).length
  const totalEmployees = branches.reduce((sum, b) => sum + (b.employee_count || 0), 0)

  useEffect(() => {
    axios.get('https://pmsystem-production.up.railway.app/api/inventory/branches')
      .then(async res => {
        setBranches(res.data)
        const statsData = {}
        for (const branch of res.data) {
          const s = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory/stats/${branch.branch_id}`)
          statsData[branch.branch_id] = s.data
        }
        setStats(statsData)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Завантаження...</div>

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Мережа філіалів</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>Управління та моніторинг всіх аптек мережі</p>

      {/* Загальна статистика */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Всього філіалів', value: branches.length, color: '#1890ff' },
          { label: 'Активні філіали', value: activeBranches, color: '#52c41a' },
          { label: 'Співробітників', value: totalEmployees, color: '#722ed1' },
          { label: 'Загальний дохід', value: `${(totalRevenue/1000).toFixed(0)}К грн`, color: '#fa8c16' },
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, background: 'white', borderRadius: '8px',
            padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderTop: `3px solid ${card.color}`
          }}>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: card.color }}>
              {card.value}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Список філіалів */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {branches.map(branch => {
          const s = stats[branch.branch_id] || {}
          return (
            <div key={branch.branch_id} style={{
              background: 'white', borderRadius: '8px',
              padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${branch.is_active ? '#52c41a' : '#d9d9d9'}`
            }}>
              {/* Заголовок */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0 }}>{branch.name}</h3>
                    <span style={{
                      background: branch.is_active ? '#f6ffed' : '#f5f5f5',
                      color: branch.is_active ? '#52c41a' : '#999',
                      padding: '2px 10px', borderRadius: '4px', fontSize: '12px'
                    }}>
                      {branch.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>
                  <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                    📍 {branch.address}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#888' }}>Дохід (місяць)</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {parseFloat(branch.monthly_revenue || 0).toLocaleString('uk-UA')} грн
                  </div>
                </div>
              </div>

              {/* Деталі */}
              <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  📞 {branch.phone}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  🕐 {branch.work_hours}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  👥 Співробітників: {branch.employee_count}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  🏷️ {branch.branch_type === 'warehouse' ? 'Склад' : 'Аптека'}
                </div>
              </div>

              {/* Керівник */}
              <div style={{
                fontSize: '13px', color: '#666', marginBottom: '16px',
                paddingBottom: '16px', borderBottom: '1px solid #f0f0f0'
              }}>
                👤 Керівник філіалу: <strong>{branch.manager_name}</strong>
              </div>

              {/* Статистика запасів */}
              <div style={{ display: 'flex', gap: '24px' }}>
                {[
                  { label: 'Товарів', value: s.total || 0, color: '#1890ff' },
                  { label: 'Низькі залишки', value: s.low || 0, color: '#faad14' },
                  { label: 'Термін закінчується', value: s.expiring || 0, color: '#fa8c16' },
                  { label: 'Прострочено', value: s.expired || 0, color: '#f5222d' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: item.color }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Network