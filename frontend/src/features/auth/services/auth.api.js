import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
});

export const login = async ({ email, password }) => {
    const response = await authApiInstance.post("/login", { email, password });
    return response.data;
}

export const register = async ({ name, email, password }) => {
    const response = await authApiInstance.post("/register", { name, email, password });
    return response.data;
}

export const verifyEmail = async ({ userId, otp }) => {
    const response = await authApiInstance.post("/verify-email", { userId, otp });
    return response.data;
}

export const getMe = async () => {
    const response = await authApiInstance.get("/me");
    return response.data;
}

export const logout = async () => {
    const response = await authApiInstance.post("/logout");
    return response.data;
}
