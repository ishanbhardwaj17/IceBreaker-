import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, register, verifyEmail, getMe } from '../services/auth.api.js'
import { setError, setInitialized, setLoading, setUser } from '../state/auth.slice.js'

const normalizeAuthError = (error, fallbackMessage) => {
    return error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        fallbackMessage
}

export const useAuth = () => {
    const dispatch = useDispatch()
    const { initialized, loading, error, user } = useSelector((state) => state.auth)

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

    const handleVerifyEmail = useCallback(async ({ userId, otp }) => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await verifyEmail({ userId, otp })
            dispatch(setUser(data.user ?? null))
            return data
        } catch (error) {
            const errorMessage = normalizeAuthError(error, 'Verification failed')
            dispatch(setError(errorMessage))
            throw new Error(errorMessage, { cause: error })
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleCheckSession = useCallback(async () => {
        dispatch(setLoading(true))
        try {
            const data = await getMe()
            dispatch(setUser(data.user ?? null))
            return data.user
        } catch {
            dispatch(setUser(null))
        } finally {
            dispatch(setInitialized(true))
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleLogout = useCallback(async () => {
        dispatch(setLoading(true))
        try {
            await logout()
        } catch {
            // Clear local auth state even if the server is temporarily unreachable.
        } finally {
            dispatch(setUser(null))
            dispatch(setInitialized(true))
            dispatch(setLoading(false))
        }
    }, [dispatch])

    return { handleRegister, handleLogin, handleVerifyEmail, handleCheckSession, handleLogout, initialized, loading, error, user }
}
