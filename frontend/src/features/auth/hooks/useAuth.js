import { useCallback } from "react";
import { setError, setLoading, setUser } from "../state/auth.slice.js"
import { login, register } from "../services/auth.api.js"
import { useDispatch } from "react-redux"

export const useAuth = () => {
    const dispatch = useDispatch()

    const handleRegister = useCallback(async ({ name, email, password }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await register({ name, email, password })
            dispatch(setUser(data.user))
            return data.user;
        } catch (error) {
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                "Registration failed";
            dispatch(setError(errorMsg));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data.user;
        } catch (error) {
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                "Login failed";
            dispatch(setError(errorMsg));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return { handleRegister, handleLogin };
}