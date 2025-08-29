import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Input from "../../components/Input";
import { Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setLoading(true);

    if (!token) {
      setError("Reset token is missing.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
      });
      console.log(res);
      setStatus(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-zinc-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
          Enter a new password to reset your account.
        </p>

        {status && (
          <p className="text-green-500 text-sm mt-4 text-center">{status}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input
            label="New Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 flex items-center justify-center gap-2 rounded-md font-medium transition-colors ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
