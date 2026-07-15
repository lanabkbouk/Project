import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from './paths'
import { selectAccountType, selectIsAuthenticated } from '../redux/authSekector'

export default function ProtectedRoute({ allowedAccountTypes = [] }) {
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const accountType = useSelector(selectAccountType)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  if (allowedAccountTypes.length > 0 && !allowedAccountTypes.includes(accountType)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
