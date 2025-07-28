import React, { useContext, useState } from "react";
import Input from "../../components/Input";
import { UserContext } from "../../context/userContext";
import { handleSignUp } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const onSignUpSubmit = async (e) => {
    e.preventDefault();
    await handleSignUp(form, setError, updateUser, navigate);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <form onSubmit={onSignUpSubmit} className="space-y-6 mt-4">
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
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            Sign Up
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
