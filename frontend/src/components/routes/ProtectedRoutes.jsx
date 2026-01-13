import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user)

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ✅ Logged in
  return children
}

export default ProtectedRoute
