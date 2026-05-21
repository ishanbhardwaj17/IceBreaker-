import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register } from '../services/auth.api.js'
import { setError, setLoading, setUser } from '../state/auth.slice.js'

const normalizeAuthError = (error, fallbackMessage) => {
    return error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        fallbackMessage
}

export const useAuth = () => {
    const dispatch = useDispatch()
    const { loading, error, user } = useSelector((state) => state.auth)

    const handleRegister = useCallback(async ({ name, email, password }) => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await register({ name, email, password })
            return data
        } catch (error) {
            const errorMessage = normalizeAuthError(error, 'Registration failed')
            dispatch(setError(errorMessage))
            throw new Error(errorMessage, { cause: error })
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleLogin = useCallback(async ({ email, password }) => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user ?? null))
            return data
        } catch (error) {
            const errorMessage = normalizeAuthError(error, 'Login failed')
            dispatch(setError(errorMessage))
            throw new Error(errorMessage, { cause: error })
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    return { handleRegister, handleLogin, loading, error, user }
}