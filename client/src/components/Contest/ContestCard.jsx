import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { UserContext } from '../../context/userContext';

const getStatus = (contest) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);

  if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" };
  if (now > end) return { label: "Finished", color: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400" };
  return { label: "Live", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse" };
};

const ContestCard = ({ contest }) => {
  const {user} = useContext(UserContext);
  
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  const duration = Math.round((end - start) / (1000 * 60 * 60));
  const status = getStatus(contest);

  return (
    <div className="bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
      <div className="p-5 flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">{contest.title}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{format(start, 'MMM d, yyyy - hh:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{duration} hour{duration !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      <div className="p-5 pt-0">
        <Link
          to={user ? `/contests/${contest.slug}` : `/login`}
          className="w-full block text-center py-2.5 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow hover:shadow-md"
        >
          Enter Contest
        </Link>
      </div>
    </div>
  );
};

export default ContestCard;
