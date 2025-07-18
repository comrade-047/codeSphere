import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";

const emojiOptions = ["👨‍💻", "👩‍🎓", "🐱", "🧠", "🚀", "🧑‍🚀", "👾"];

const UpdateProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    mobileNumber: "",
    linkedIn: "",
    country: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(API_PATHS.USER.PROFILE(username));
      setForm(res.data.user);
    };
    fetchUser();
  }, [username]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.put(API_PATHS.USER.UPDATE(username));
    navigate(`/${username}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Email"
        />
        <input
          name="mobileNumber"
          value={form.mobileNumber}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Mobile Number"
        />
        <input
          name="linkedIn"
          value={form.linkedIn}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="LinkedIn URL"
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Country"
        />
        <select
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Choose Emoji Avatar</option>
          {emojiOptions.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
