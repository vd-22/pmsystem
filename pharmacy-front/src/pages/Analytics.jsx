import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']

function Analytics() {
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_URL}/api/inventory/branches')
      .then(res => {
        setBranches(res.data.filter(b => b.branch_type === 'pharmacy'))
        setLoading(false)
      })
  }, [])

  // Дані для порівняння доходів філіалів
  const revenueData = branches.map(b => ({
    name: b.name.replace('Філіал ', 'Аптека '),
    дохід: parseFloat(b.monthly_revenue) || 0
  }))

  // Дані динаміки продажів по місяцях (тестові)
  const salesData = [
    { month: 'Січ', продажі: 320000, прибуток: 89600 },
    { month: 'Лют', продажі: 298000, прибуток: 83440 },
    { month: 'Бер', продажі: 356000, прибуток: 99680 },
    { month: 'Кві', продажі: 412000, прибуток: 115360 },
    { month: 'Тра', продажі: 389000, прибуток: 108920 },
    { month: 'Чер', продажі: 445000, прибуток: 124600 },
    { month: 'Лип', продажі: 467000, прибуток: 130760 },
    { month: 'Сер', продажі: 423000, прибуток: 118440 },
    { month: 'Вер', продажі: 398000, прибуток: 111440 },
    { month: 'Жов', продажі: 478000, прибуток: 133840 },
    { month: 'Лис', продажі: 512000, прибуток: 143360 },
    { month: 'Гру', продажі: 534000, прибуток: 149520 },
  ]

  // Дані по категоріях
  const categoryData = [
    { name: 'Знеболювальні', value: 28 },
    { name: 'Антибіотики', value: 18 },
    { name: 'Вітаміни', value: 15 },
    { name: 'Антисептики', value: 12 },
    { name: 'Ліки від нежитю', value: 10 },
    { name: 'Інші', value: 17 },
  ]

  const totalRevenue = branches.reduce((sum, b) => sum + (parseFloat(b.monthly_revenue) || 0), 0)
  const totalProfit = totalRevenue * 0.28
  const totalSold = 24350
  const totalStock = 13630

  if (loading) return <div style={{ padding: '40px' }}>Завантаження...</div>

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Аналітика та статистика</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Дашборд з ключовими показниками ефективності мережі аптек
      </p>

      {/* Вибір філіалу */}
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

      {/* KPI картки */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Загальний дохід', value: `${totalRevenue.toLocaleString('uk-UA')} грн`, change: '+13.8%', color: '#1890ff', up: true },
          { label: 'Прибуток', value: `${totalProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} грн`, change: '+11.2%', color: '#52c41a', up: true },
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
        /* Зведений режим — порівняння філіалів */
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
        /* Режим окремого філіалу */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'white', borderRadius: '8px',
            padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Динаміка продажів і прибутку</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesData}>
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