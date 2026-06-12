import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']
const MONTHS = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру']

function Analytics() {
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [revenueSummary, setRevenueSummary] = useState([])
  const [branchRevenue, setBranchRevenue] = useState([])
  const [loading, setLoading] = useState(true)
  const totalSold = 24350
  const totalStock = 13630

  useEffect(() => {
    Promise.all([
      axios.get('https://pmsystem-production.up.railway.app/api/inventory/branches'),
      axios.get('https://pmsystem-production.up.railway.app/api/inventory/revenue-summary')
    ]).then(([branchRes, revenueRes]) => {
      setBranches(branchRes.data.filter(b => b.branch_type === 'pharmacy'))
      setRevenueSummary(Array.isArray(revenueRes.data) ? revenueRes.data : [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selectedBranch !== 'all') {
      axios.get(`https://pmsystem-production.up.railway.app/api/inventory/revenue/${selectedBranch}`)
        .then(res => {
          const data = res.data.map(r => ({
            month: MONTHS[r.month - 1],
            продажі: parseFloat(r.revenue),
            прибуток: parseFloat(r.revenue) * 0.28
          }))
          setBranchRevenue(data)
        })
    }
  }, [selectedBranch])

  const revenueData = revenueSummary.map(b => ({
    name: b.name.replace('Філіал ', 'Аптека '),
    дохід: parseFloat(b.total_revenue || 0)
  }))

  const categoryData = [
    { name: 'Знеболювальні', value: 28 },
    { name: 'Антибіотики', value: 18 },
    { name: 'Вітаміни', value: 15 },
    { name: 'Антисептики', value: 12 },
    { name: 'Ліки від нежитю', value: 10 },
    { name: 'Інші', value: 17 },
  ]

  const totalRevenue = revenueSummary.reduce((sum, b) => sum + parseFloat(b.total_revenue || 0), 0)
  const totalProfit = totalRevenue * 0.28

  if (loading) return <div style={{ padding: '40px' }}>Завантаження...</div>

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Аналітика та статистика</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Дашборд з ключовими показниками ефективності мережі аптек
      </p>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
          Філіал для аналізу:
        </label>
        <select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ddd', fontSize: '14px', width: '300px'
          }}
        >
          <option value="all">Всі філіали</option>
          {branches.map(b => (
            <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Загальний дохід', value: `${(totalRevenue/1000).toFixed(0)}К грн`, change: '+13.8%', color: '#1890ff', up: true },
          { label: 'Прибуток', value: `${(totalProfit/1000).toFixed(0)}К грн`, change: '+11.2%', color: '#52c41a', up: true },
          { label: 'Продано товарів', value: `${totalSold.toLocaleString('uk-UA')} шт`, change: '+16.3%', color: '#722ed1', up: true },
          { label: 'Товарів на складі', value: `${totalStock.toLocaleString('uk-UA')} шт`, change: '-4.2%', color: '#fa8c16', up: false },
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, background: 'white', borderRadius: '8px',
            padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>{card.value}</div>
            <div style={{ fontSize: '13px', color: card.up ? '#52c41a' : '#f5222d' }}>
              {card.up ? '↑' : '↓'} {card.change}
            </div>
          </div>
        ))}
      </div>

      {selectedBranch === 'all' ? (
        <div style={{
          background: 'white', borderRadius: '8px',
          padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Порівняння філіалів за доходом</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `₴${v.toLocaleString('uk-UA')}`} />
              <Bar dataKey="дохід" fill="#52c41a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'white', borderRadius: '8px',
            padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Динаміка доходів по місяцях</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={branchRevenue}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={v => `₴${v.toLocaleString('uk-UA')}`} />
                <Legend />
                <Line type="monotone" dataKey="продажі" stroke="#1890ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="прибуток" stroke="#52c41a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            background: 'white', borderRadius: '8px',
            padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Розподіл продажів за категоріями</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics