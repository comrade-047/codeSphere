import React, { useContext, useState } from "react";
import Input from "../../components/Input"; 
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleLogin = async(e) => {
    e.preventDefault();

    if(!form.username){
      setError("Please enter your username");
      return;
    }
    if(!form.password){
      setError("Please enter your password");
      return;
    }
    setError(""); 

    // Handle login logic here
    
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        username : form.username,
        password : form.password
      });

      const {token,user} = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/problems"); // here after loginPage
      }

    }
    catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6 mt-4">
          <Input
            label="Username"
            id="username"
            value={form.username}
            onChange={handleChange("username")}
            placeholder="Enter your username"
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Enter your password"
            required
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Login
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
