import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProfileCard } from "../../components/Profile/ProfileCard";
import { PieStats } from "../../components/Profile/PieStats";
import { AttemptedList } from "../../components/Profile/AttemptedList";
import { RecentSubmissions } from "../../components/Profile/RecentSumbissions";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance(API_PATHS.USER.PROFILE(username));
        setUser(res.data.user);
        setSubmissions(res.data.submissions);
        setAttempted(res.data.attemptedProblems);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="p-6 text-center text-lg text-gray-600 dark:text-gray-300">Loading profile...</div>;
  if (!user) return <div className="p-6 text-center text-red-600 dark:text-red-400">User not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <ProfileCard user={user} />
      <PieStats submissions={submissions} />
      <AttemptedList attempted={attempted} />
      <RecentSubmissions submissions={submissions} />
    </div>
  );
};

export default ProfilePage;
