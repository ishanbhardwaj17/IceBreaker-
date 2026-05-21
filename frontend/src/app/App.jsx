import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes.jsx'
import { useAuth } from '../features/auth/hooks/useAuth.js'

const App = () => {
  const { handleCheckSession } = useAuth()

  useEffect(() => {
    handleCheckSession()
  }, [handleCheckSession])

  return <RouterProvider router={router} />
}

export default App
