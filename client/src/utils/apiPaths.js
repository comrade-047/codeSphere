export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
// console.log(BASE_URL);

export const API_PATHS = {
    AUTH : {
        LOGIN : `${BASE_URL}/auth/login`,
        REGISTER : `${BASE_URL}/auth/register`,
        FORGOT_PASSWORD : `${BASE_URL}/auth/forgot-password`,
        RESET_PASSWORD :   `${BASE_URL}/auth/reset-password`
    },
    USER : {
        PROFILE : (username) => `${BASE_URL}/${username}`,
        UPDATE : (username) => `${BASE_URL}/${username}/update`,
        UPLOAD_IMAGE : (username) => `${BASE_URL}/${username}/upload`
    },
    PROBLEM : {
        ALLPROBLEMS : `${BASE_URL}/problems`,
        PROBLEMBYSLUG : (slug) => `${BASE_URL}/problems/${slug}`
    },
    JUDGE : {
        JUDGE : (exec) => `${BASE_URL}/judge/${exec}`,
        RUN_STATUS : (pollingId) => `${BASE_URL}/judge/run/status/${pollingId}`,
        SUBMIT_STATUS : (pollingId) => `${BASE_URL}/submissions/status/${pollingId}`
    },
    AI_REVIEW : `${BASE_URL}/ai-review`,
    SUBMISSIONS  : {
        USERSUBMISSIONSBYPROBLEM : (problemId) => `${BASE_URL}/submissions/${problemId}`
    },
    CONTESTS : {
        GET_ALL : `${BASE_URL}/contests`,
        GET_CONTEST : (contestSlug) => `${BASE_URL}/contests/${contestSlug}`,
        REGISTER : (contestSlug) => `${BASE_URL}/contests/${contestSlug}/register`,
        LEADERBOARD : (contestSlug) => `${BASE_URL}/contests/${contestSlug}/leaderboard`,
        SUBMIT : (contestSlug) => `${BASE_URL}/contests/${contestSlug}/submit`
    }
}