import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../features/auth/pages/Login.jsx'
import Register from '../features/auth/pages/Register.jsx'
import Dashboard from '../features/auth/pages/Dashboard.jsx'
import VerifyEmail from '../features/auth/pages/VerifyEmail.jsx'
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx'
import AuthenticatedRoute from '../features/auth/components/AuthenticatedRoute.jsx'

export const router = createBrowserRouter([
  { 
    path: '/', 
    element: <Navigate to="/dashboard" replace /> 
  },
  { 
    path: '/dashboard', 
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/register', 
    element: (
      <AuthenticatedRoute>
        <Register />
      </AuthenticatedRoute>
    ) 
  },
  { 
    path: '/login', 
    element: (
      <AuthenticatedRoute>
        <Login />
      </AuthenticatedRoute>
    ) 
  },
  { 
    path: '/verify-email', 
    element: (
      <AuthenticatedRoute>
        <VerifyEmail />
      </AuthenticatedRoute>
    ) 
  },
])
