import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ProfilePicSelector from "../../components/Profile/ProfilePicSelector";
import Input from "../../components/Input";
import uploadImage from "../../utils/uploadImage";

const UpdateProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    mobileNumber: "",
    linkedIn: "",
    country: "",
    profilePic: null,
    profilePicUrl: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USER.PROFILE(username));
        const user = res.data.user;
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
          mobileNumber: user.mobileNumber || "",
          linkedIn: user.linkedIn || "",
          country: user.country || "",
          profilePicUrl: user.profilePicUrl || "",
        }));
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUser();
  }, [username]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedPicUrl = form.profilePicUrl;

    try {
      if (form.profilePic) {
        const imageUploadRes = await uploadImage({
          image: form.profilePic,
          username,
        });
        uploadedPicUrl = imageUploadRes?.url || "";
      }

      const updatedForm = {
        ...form,
        profilePicUrl: uploadedPicUrl,
      };

      await axiosInstance.put(API_PATHS.USER.UPDATE(username), updatedForm);
      navigate(`/${username}`);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg p-8 md:p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <ProfilePicSelector
            image={form.profilePic}
            setImage={handleImageChange}
            previousImageUrl={form.profilePicUrl}
          />

          <Input
            label="Email"
            id="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Mobile Number"
            id="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange("mobileNumber")}
            placeholder="Enter your phone number"
          />

          <Input
            label="LinkedIn"
            id="linkedIn"
            value={form.linkedIn}
            onChange={handleChange("linkedIn")}
            placeholder="LinkedIn profile URL"
          />

          <Input
            label="Country"
            id="country"
            value={form.country}
            onChange={handleChange("country")}
            placeholder="Enter your country"
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium tracking-wide transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
