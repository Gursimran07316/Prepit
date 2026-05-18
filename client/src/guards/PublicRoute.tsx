
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const PublicRoute = () => {
  const { token } = useAuth()

  if (token) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default PublicRoute