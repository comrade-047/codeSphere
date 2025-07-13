import React, { useState } from "react";
import Input from "../../components/Input";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
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

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <Input
            label="Full Name"
            id="name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Enter your full name"
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
