import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Network from './pages/Network'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Reports from './pages/Reports'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://pmsystem-production.up.railway.app/api/auth/login', {
        username,
        password
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('Невірний логін або пароль')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '8px',
        width: '360px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Аптечна мережа</h2>
        <input
          type="text" placeholder="Логін" value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <input
          type="password" placeholder="Пароль" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        {error && <p style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
        <button onClick={handleLogin} style={{
          width: '100%', padding: '10px', background: '#1890ff',
          color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer'
        }}>
          Увійти
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute path="/dashboard">
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute path="/inventory">
          <Layout><Inventory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute path="/orders">
          <Layout><Orders /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/network" element={
        <ProtectedRoute path="/network">
          <Layout><Network /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute path="/analytics">
          <Layout><Analytics /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute path="/users">
         <Layout><Users /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute path="/reports">
         <Layout><Reports /></Layout>
      </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App