import { useNavigate, useLocation } from 'react-router-dom'
import { menuByRole } from '../utils/roles'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))
  const menuItems = menuByRole[user?.role] || []

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{
        width: '240px', background: '#001529',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', flexShrink: 0
      }}>
        <div>
          <div style={{
            padding: '20px 24px', color: 'white',
            fontSize: '16px', fontWeight: 'bold',
            borderBottom: '1px solid #002140'
          }}>
            Аптечна мережа
          </div>
          <nav>
            {menuItems.map(item => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '14px 24px',
                  color: location.pathname === item.path ? '#1890ff' : '#ffffffa6',
                  background: location.pathname === item.path ? '#002140' : 'transparent',
                  cursor: 'pointer',
                  borderLeft: location.pathname === item.path ? '3px solid #1890ff' : '3px solid transparent',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {item.label}
              </div>
            ))}
          </nav>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #002140' }}>
          <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>
            {user?.username}
          </div>
          <div style={{ color: '#ffffff73', fontSize: '12px', marginBottom: '12px' }}>
            {user?.role}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px',
              background: 'transparent', color: '#ffffff73',
              border: '1px solid #ffffff30', borderRadius: '4px',
              cursor: 'pointer', fontSize: '13px'
            }}
          >
            Вийти
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#f0f2f5', padding: '24px' }}>
        {children}
      </div>
    </div>
  )
}

export default Layout