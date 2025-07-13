export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const API_PATHS = {
    AUTH : {
        LOGIN : `${BASE_URL}/auth/login`,
        REGISTER : `${BASE_URL}/auth/register`,
    }
}