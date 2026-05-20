import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

const Home = () => <div>Home</div>
const Dashboard = () => <div>Dashboard</div>
const Register = () => <div>Register</div>
const Login = () => <div>Login</div>
const VerifyEmail = () => <div>Verify Email</div>

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/verify-email', element: <VerifyEmail /> },
])