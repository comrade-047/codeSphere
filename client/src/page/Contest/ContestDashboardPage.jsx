import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import Countdown from '../../components/Contest/Countdown';
import Leaderboard from '../../components/Contest/Leaderboard';
import { Award, List, BarChart2 } from 'lucide-react';

const ContestDashboardPage = () => {
  const { slug } = useParams();
  const { user } = useContext(UserContext);
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestStatus, setContestStatus] = useState('upcoming');
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('problems');

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CONTESTS.GET_CONTEST(slug));
        const contestData = res.data.contest;
        setContest(contestData);

        if (res.data.problemsVisible) {
          setProblems(contestData.problems);
        }

        if (user && contestData.participants.includes(user._id)) {
          setIsRegistered(true);
        }

        // Set contest status on initial load
        const now = new Date();
        const startTime = new Date(contestData.startTime);
        const endTime = new Date(contestData.endTime);

        if (now < startTime) {
          setContestStatus('upcoming');
        } else if (now >= startTime && now <= endTime) {
          setContestStatus('live');
        } else {
          setContestStatus('finished');
          // setActiveTab('leaderboard');
        }

      } catch (err) {
        setError("Failed to load contest details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [slug, user]);

  useEffect(() => {
    if (!contest) return;

    const updateStatus = () => {
      const now = new Date();
      const startTime = new Date(contest.startTime);
      const endTime = new Date(contest.endTime);

      if (now < startTime) {
        setContestStatus('upcoming');
      } else if (now >= startTime && now <= endTime) {
        setContestStatus('live');
      } else {
        setContestStatus('finished');
      }
    };

    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const handleRegister = async () => {
    try {
      await axiosInstance.post(API_PATHS.CONTESTS.REGISTER(slug));
      setIsRegistered(true);
      alert("Successfully registered for the contest!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  const TabButton = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  if (loading) return <div className="text-center p-8">Loading Contest...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{contest.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{contest.description}</p>
      </header>

      {contestStatus === 'upcoming' && (
        <div className="text-center bg-white dark:bg-zinc-800 p-10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Contest Starts In</h2>
          <Countdown targetDate={contest.startTime} />
          {!isRegistered && (
            <button 
              onClick={handleRegister}
              className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105"
            >
              Register Now
            </button>
          )}
        </div>
      )}

      {(contestStatus === 'live' || contestStatus === 'finished') && (
        <div>
          <div className="mb-6 p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center gap-2">
            <TabButton tabName="problems" label="Problems" icon={<List size={16} />} />
            <TabButton tabName="leaderboard" label="Leaderboard" icon={<BarChart2 size={16} />} />
          </div>
          {activeTab === 'problems' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problems.map(probEntry => (
                <Link
                  to={`/problems/${probEntry.problem.slug}`} 
                  state={{ contestSlug: slug }} 
                  key={probEntry.problem._id} 
                  className="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">
                    {probEntry.problem.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Points: {probEntry.points}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <Leaderboard contestSlug={slug} />
          )}
        </div>
      )}
    </div>
  );
};

export default ContestDashboardPage;
