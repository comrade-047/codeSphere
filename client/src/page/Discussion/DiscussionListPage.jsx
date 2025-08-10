import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { MessageSquare, Plus } from 'lucide-react';

const DiscussionListPage = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                // Fetch general threads by not providing a problemId
                const res = await axiosInstance.get(API_PATHS.DISCUSSIONS.GET_ALL);
                setThreads(res.data);
            } catch (err) {
                setError("Failed to load discussions.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchThreads();
    }, []);

    const ThreadItem = ({ thread }) => (
        <Link 
            to={`/discussions/${thread._id}`}
            className="block p-4 bg-white dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 transition-colors duration-200"
        >
            <h3 className="font-semibold text-gray-800 dark:text-white">{thread.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>by {thread.author.username}</span>
                <div className="flex items-center gap-4">
                    <span>{thread.replyCount} replies</span>
                    <span>Last activity: {new Date(thread.lastActivity).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );

    if (loading) return <div className="text-center p-8">Loading discussions...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Discussions</h1>
                {user && (
                    <Link 
                        to="/discussions/new" // We'll create this page next
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition"
                    >
                        <Plus size={18} /> New Discussion
                    </Link>
                )}
            </header>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden border dark:border-zinc-700">
                {threads.length > 0 ? (
                    threads.map(thread => <ThreadItem key={thread._id} thread={thread} />)
                ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No discussions yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Be the first to start a conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionListPage;
