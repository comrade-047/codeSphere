import React, { useContext, useState } from "react";
import Input from "../../components/Input";
import { UserContext } from "../../context/userContext";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSignUp = async(e) => {
    e.preventDefault();

    if(!form.username){
      setError("Please enter a valid name");
      return;
    }

    if(!validateEmail(form.email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!form.password){
      setError("Please enter a valid email address");
      return;
    }
    setError(""); // Clear previous errors

    // signUp api call

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        username : form.username,
        email : form.email,
        password : form.password
      });

      const {token, user} = response.data;

      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        // localStorage.setItem("user",JSON.stringify(user));
        navigate("/dashboard");
      }

    } catch (err) {
      if(err.response && err.response.data.message){
        setError(err.response.data.message);
      }else{
        setError("Something went wrong");
      }
    }

    console.log(form); // Demo purpose
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <form onSubmit={handleSignUp} className="space-y-6 mt-4">
          <Input
            label="Username"
            id="name"
            value={form.username}
            onChange={handleChange("username")}
            placeholder="Enter username"
            required
          />

          <Input
            label="Email Address"
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Create a password"
            required
          />

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Sign Up
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
