export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const API_PATHS = {
    AUTH : {
        LOGIN : `${BASE_URL}/auth/login`,
        REGISTER : `${BASE_URL}/auth/register`,
    },
    USER : {
        PROFILE : (username) => `${BASE_URL}/${username}`,
        UPDATE : (username) => `${BASE_URL}/${username}/update`
    },
    PROBLEM : {
        ALLPROBLEMS : `${BASE_URL}/problems`,
        PROBLEMBYSLUG : (slug) => `${BASE_URL}/problems/${slug}`
    },
    JUDGE : (exec) => `${BASE_URL}/judge/${exec}`
}