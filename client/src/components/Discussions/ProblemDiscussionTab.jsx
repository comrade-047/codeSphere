import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { MessageCircle, Plus, Search } from 'lucide-react';
import CreateThreadModal from './CreateThreadModal';
import ThreadDetailView from './ThreadDetailView';

const ProblemDiscussionTab = ({ isLoggedIn, problemId }) => {
  const { user } = useContext(UserContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const url = `${API_PATHS.DISCUSSIONS.GET_ALL}?problemId=${problemId}`;
        const res = await axiosInstance.get(url);
        setThreads(res.data);
      } catch (err) {
        console.error("Failed to fetch discussions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [problemId]);

  const handleThreadCreated = (newThread) => {
    const threadWithAuthor = { ...newThread, author: { username: user.username } };
    setThreads([threadWithAuthor, ...threads]);
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Please{" "}
        <a href="/login" className="text-indigo-500 hover:underline">
          log in
        </a>{" "}
        to view and post in the discussion section.
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading discussions...</div>;
  }

  if (selectedThreadId) {
    return (
      <ThreadDetailView
        threadId={selectedThreadId}
        onBack={() => setSelectedThreadId(null)}
      />
    );
  }

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="relative w-full max-w-xs">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search discussions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        {user && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-3 inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors duration-200"
          >
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      {isModalOpen && (
        <CreateThreadModal
          problemId={problemId}
          onClose={() => setIsModalOpen(false)}
          onThreadCreated={handleThreadCreated}
        />
      )}

      {/* Thread List */}
      <div className="mt-4 divide-y dark:divide-zinc-700">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <div
              key={thread._id}
              onClick={() => setSelectedThreadId(thread._id)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-all duration-150"
            >
              {/* User avatar */}
              <div className="flex-shrink-0">
                <img
                  src={thread.author?.profilePicUrl || `https://ui-avatars.com/api/?name=${thread.author?.username || "U"}&background=random`}
                  alt={thread.author?.username || "User"}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700"
                />
              </div>

              {/* Thread content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {thread.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  by {thread.author?.username || "Unknown"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageCircle className="mx-auto h-10 w-10" />
            <p className="mt-2 text-sm font-semibold">No Discussions Yet</p>
            <p className="text-xs">Be the first to start a conversation about this problem.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDiscussionTab;
