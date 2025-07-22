import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import ProfilePicSelector from "../../components/ProfilePicSelector"
import uploadImage from "../../utils/uploadImage.js";

const UpdateProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    mobileNumber: "",
    linkedIn: "",
    country: "",
    profilePic : null,
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
  const handleImageChange = (file) => {
    setForm((prev) => ({...prev,profilePic:file}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profilePicUrl = "";

    try{
      if(form.profilePic){
        const image = form.profilePic;
        console.log(image);
        const imageUploadRes = await uploadImage({image, username});
        profilePicUrl = imageUploadRes.url || "";
      }
      const updatedForm = {
        ...form,
        profilePicUrl : profilePicUrl
      }
      const response = await axiosInstance.put(API_PATHS.USER.UPDATE(username),updatedForm);
    }
    catch(err){
      console.log(err);
    }

    navigate(`/${username}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfilePicSelector image={form.profilePic} setImage={handleImageChange} />
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
