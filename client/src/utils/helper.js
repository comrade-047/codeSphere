import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// for fetching the problmes from backend
export const fetchProblems = async( params = {}) => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROBLEM.ALLPROBLEMS,{
            params
        });
        return response.data;
    }
    catch(error){
        console.error('Failed to fetch the problems',error);
        throw(error);
    }
}

// login handler
export const handleLogin = async (form, setError, updateUser, navigate) => {
  if (!form.username) {
    setError("Please enter your username");
    return;
  }
  if (!form.password) {
    setError("Please enter your password");
    return;
  }
  setError(""); 

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      username: form.username,
      password: form.password,
    });

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/problems");
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Something went wrong");
    }
  }
};


// signup handler
export const handleSignUp = async (form, setError, updateUser, navigate) => {
  if (!form.username) {
    setError("Please enter a valid name");
    return;
  }

  if (!validateEmail(form.email)) {
    setError("Please enter a valid email address");
    return;
  }

  if (!form.password) {
    setError("Please enter a valid password");
    return;
  }

  setError(""); // Clear previous errors

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      username: form.username,
      email: form.email,
      password: form.password,
    });

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/problems");
    }
  } catch (err) {
    if (err.response && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError("Something went wrong");
    }
  }
};

