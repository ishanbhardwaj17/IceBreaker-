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