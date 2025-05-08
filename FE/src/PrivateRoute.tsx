import React, { JSX } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  element: JSX.Element
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  return isAuthenticated ? element : <Navigate to='/login' replace />
}

export default PrivateRoute
