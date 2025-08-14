import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
} from "lucide-react";

const DiscussionListPage = () => {
  const { user } = useContext(UserContext);

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.DISCUSSIONS.GET_ALL);
        if (mounted) {
          setThreads(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load discussions.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchThreads();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((t) => {
      if (!q) return true;
      const hay =
        (t.title || "") +
        " " +
        (t.author?.username || "") 
      return hay.toLowerCase().includes(q);
    });
  }, [threads, search]);


  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const ThreadCard = ({ thread }) => {
    const replyCount = thread.replyCount ?? 0;
    const last = thread.lastActivity || thread.updatedAt || thread.createdAt;
    const excerpt =
      (thread.excerpt && thread.excerpt.trim()) ||
      (thread.content && thread.content.trim().slice(0, 220)) ||
      "";

    return (
      <Link
        to={`/discussions/${thread._id}`}
        className="group block bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {thread.title}
            </h3>
          </div>

          {excerpt && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{excerpt}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} /> {replyCount} replies
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} /> {formatDate(last)}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Discussions
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Ask questions, share solutions, and discuss ideas with the community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search discussions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 w-60 text-sm rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {user && (
              <Link
                to="/discussions/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-sm transition"
              >
                <Plus size={14} /> New
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {loading && <div>Loading...</div>}
          {!loading && error && (
            <div className="p-6 bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-700 rounded text-center text-red-600">
              {error}
            </div>
          )}
          {!loading && !error && filtered.length > 0 &&
            filtered.map((t) => <ThreadCard key={t._id} thread={t} />)
          }
          {!loading && !error && filtered.length === 0 && (
            <div className="p-8 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-400 dark:text-zinc-400" />
              <h3 className="mt-3 text-sm font-semibold text-gray-800 dark:text-white">
                {search ? "No discussions match your search." : "No discussions yet."}
              </h3>
              {!search && user && (
                <Link
                  to="/discussions/new"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md"
                >
                  Start a Discussion
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionListPage;
