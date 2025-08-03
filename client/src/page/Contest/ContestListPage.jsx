// pages/ContestListPage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Zap, Clock, Calendar } from 'lucide-react';

import ContestSection from '../../components/Contest/ContestSection';
import SkeletonCard from '../../components/Contest/SkeletonCard';

const ContestListPage = () => {
  const [contests, setContests] = useState({ live: [], upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.CONTESTS.GET_ALL);
        const now = new Date();
        const live = [], upcoming = [], past = [];

        res.data.contests.forEach(contest => {
          const start = new Date(contest.startTime);
          const end = new Date(contest.endTime);
          if (now >= start && now <= end) {
            live.push(contest);
          } else if (now < start) {
            upcoming.push(contest);
          } else {
            past.push(contest);
          }
        });

        setContests({ live, upcoming, past });
      } catch (err) {
        setError("Failed to load contests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 md:px-10">
      <header className="mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow">
          Programming Contests
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-3 max-w-xl mx-auto">
          Compete, grow your skills, and climb the leaderboard.
        </p>
      </header>

      <div className="bg-white dark:bg-zinc-900/40 rounded-2xl p-6 md:p-10 shadow-lg">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 text-lg p-8 bg-red-100 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            <ContestSection
              title="Live Now"
              icon={<Zap className="text-green-500 animate-pulse" />}
              contests={contests.live}
            />
            <ContestSection
              title="Upcoming Contests"
              icon={<Clock className="text-blue-500" />}
              contests={contests.upcoming}
            />
            <ContestSection
              title="Past Contests"
              icon={<Calendar className="text-gray-500" />}
              contests={contests.past}
            />

            {Object.values(contests).every(c => c.length === 0) && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-12 text-lg">
                No contests available right now.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContestListPage;
