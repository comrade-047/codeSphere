import React, { useContext, useState } from "react";
import Input from "../../components/Input";
import { UserContext } from "../../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../../utils/helper"; // Import the helper function

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(form, setError, updateUser, navigate);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <form onSubmit={onLoginSubmit} className="space-y-6 mt-6">
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

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 accent-indigo-600"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
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

// add loader after making the call every where it should be consistent