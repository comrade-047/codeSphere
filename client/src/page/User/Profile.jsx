import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { User, Mail, Phone, Globe, Pencil } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

ChartJS.register(ArcElement, Tooltip, Legend);

const getFlagEmoji = (country) => {
  const code = country
    .toUpperCase()
    .replace(/ /g, "")
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);
  return code.replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );
};

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

  if (loading)
    return (
      <div className="p-6 text-center text-lg font-medium">
        Loading profile...
      </div>
    );
  if (!user)
    return <div className="p-6 text-center text-red-600">User not found.</div>;

  const verdictStats = submissions.reduce((acc, sub) => {
    acc[sub.verdict] = (acc[sub.verdict] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(verdictStats),
    datasets: [
      {
        data: Object.values(verdictStats),
        backgroundColor: [
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#6366F1",
          "#6B7280",
          "#E11D48",
        ],
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-white shadow-xl rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6  border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
            {user.profilePicUrl?.startsWith("https") ? (
              <img
                src={user.profilePicUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{user.avatar || "👨‍💻"}</span>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              <User size={20} /> {user.username}
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Mail size={14} /> {user.email}
            </p>
            {user.country && (
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Globe size={14} /> {user.country} {getFlagEmoji(user.country)}
              </p>
            )}
            {user.mobileNumber && (
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Phone size={14} /> {user.mobileNumber}
              </p>
            )}
            {user.linkedIn && (
              <a
                href={user.linkedIn}
                className="text-sm text-blue-600 hover:underline mt-3 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                View LinkedIn
              </a>
            )}
          </div>
        </div>
        <Link
          to={`/${user.username}/update`}
          className="text-sm bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition ease-in-out duration-200 flex items-center gap-2 mt-4 md:mt-0"
        >
          <Pencil size={16} /> Edit Profile
        </Link>
      </div>

      {/* Stats Pie Chart */}
      <div className="bg-white shadow-xl rounded-xl p-6 mt-8 space-y-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Submission Verdict Distribution
        </h3>

        {Object.keys(verdictStats).length === 0 ? (
          <p className="text-center text-gray-500">No submissions available.</p>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-full md:w-1/2 relative">
              <Pie
                data={pieData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          const label =
                            pieData.labels[tooltipItem.dataIndex] || "";
                          const value =
                            pieData.datasets[0].data[tooltipItem.dataIndex] ||
                            0;
                          return `${label}: ${value}`;
                        },
                      },
                    },
                  },
                  animation: {
                    animateRotate: true,
                    animateScale: true,
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

            {/* Custom Legend */}
            <div className="w-full md:w-1/2 space-y-4">
              {pieData.labels.map((label, idx) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{
                      backgroundColor: pieData.datasets[0].backgroundColor[idx],
                    }}
                  ></div>
                  <span className="text-gray-700">{label}</span>
                  <span className="ml-auto text-gray-500">
                    {pieData.datasets[0].data[idx]} submission
                    {pieData.datasets[0].data[idx] > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attempted Problems */}
      <div className="bg-white shadow-xl rounded-xl p-6 mt-8 border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Attempted Problems
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          {attempted.map((prob) => (
            <li
              key={prob.slug}
              className="hover:bg-gray-100 p-3 rounded-lg transition duration-200 ease-in-out"
            >
              <Link
                to={`/problems/${prob.slug}`}
                className="text-blue-600 hover:underline"
              >
                {prob.title}
              </Link>{" "}
              - <span className="italic">{prob.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white shadow-xl rounded-xl p-6 mt-8 border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Submissions
        </h3>
        <ul className="divide-y divide-gray-200 text-sm text-gray-700">
          {submissions.slice(0, 5).map((sub) => (
            <li key={sub._id} className="py-3 hover:bg-gray-100 transition duration-200 ease-in-out">
              <strong>{sub.problem.title}</strong> - {sub.verdict}{" "}
              <span className="text-gray-500">({sub.languages})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
