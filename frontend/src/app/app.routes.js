import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Login from '../features/auth/pages/Login.jsx'
import Register from '../features/auth/pages/Register.jsx'

const Home = () => React.createElement('div', null, 'Home')
const Dashboard = () => React.createElement('div', null, 'Dashboard')
const VerifyEmail = () => React.createElement('div', null, 'Verify Email')

export const router = createBrowserRouter([
  { path: '/', element: React.createElement(Home) },
  { path: '/dashboard', element: React.createElement(Dashboard) },
  { path: '/register', element: React.createElement(Register) },
  { path: '/login', element: React.createElement(Login) },
  { path: '/verify-email', element: React.createElement(VerifyEmail) },
])