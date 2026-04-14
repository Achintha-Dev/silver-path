import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  
  if (!token) {
    return <Navigate to="/" replace />  // redirect to home not login (security)
  }

  return children
}

export default ProtectedRoute