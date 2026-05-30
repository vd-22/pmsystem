import { Navigate } from 'react-router-dom'
import { canAccess } from '../utils/roles'

function ProtectedRoute({ children, path }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (!token) return <Navigate to="/" />
  if (!canAccess(user?.role, path)) return <Navigate to="/dashboard" />

  return children
}

export default ProtectedRoute