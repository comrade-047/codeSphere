import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { Send, Loader2, ArrowLeft } from 'lucide-react';

const DiscussionThreadPage = () => {
    const { threadId } = useParams();
    const { user } = useContext(UserContext);

    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.DISCUSSIONS.GET_THREAD(threadId));
                setThread(res.data.thread);
                setPosts(res.data.posts);
            } catch (err) {
                setError('Failed to load discussion thread.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchThread();
    }, [threadId]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        setIsReplying(true);
        try {
            const res = await axiosInstance.post(API_PATHS.DISCUSSIONS.REPLY(threadId), {
                content: newPostContent,
            });
            setPosts((prev) => [...prev, res.data]);
            setNewPostContent('');
        } catch (err) {
            alert('Failed to post reply.');
        } finally {
            setIsReplying(false);
        }
    };

    const PostCard = ({ post, isOriginal }) => (
        <div
            className={`p-5 flex gap-4 border-b border-gray-200 dark:border-zinc-700 ${
                isOriginal ? 'bg-gray-50 dark:bg-zinc-900 rounded-t-lg' : 'bg-white dark:bg-zinc-800'
            }`}
        >
            <img
                src={
                    post.author.profilePicUrl ||
                    `https://avatar.vercel.sh/${post.author.username}.svg`
                }
                alt={post.author.username}
                className="w-12 h-12 rounded-full bg-gray-200 shrink-0"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 dark:text-white">
                        {post.author.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                    </span>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </p>
            </div>
        </div>
    );

    if (loading)
        return (
            <div className="flex justify-center items-center py-20 text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading thread...
            </div>
        );

    if (error)
        return (
            <div className="text-center py-12 text-red-500 font-medium">{error}</div>
        );

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            {/* Back Link */}
            <Link
                to="/discussions"
                className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
                <ArrowLeft size={16} /> Back to Discussions
            </Link>

            {/* Thread Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {thread.title}
                </h1>
            </header>

            {/* Posts */}
            <div className="rounded-lg shadow-md border dark:border-zinc-700 overflow-hidden">
                <PostCard
                    post={{
                        author: thread.author,
                        createdAt: thread.createdAt,
                        content: thread.content,
                    }}
                    isOriginal={true}
                />
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} isOriginal={false} />
                ))}
            </div>

            {/* Reply Form */}
            {user && (
                <form
                    onSubmit={handleReply}
                    className="mt-8 bg-white dark:bg-zinc-800 p-5 rounded-lg shadow border dark:border-zinc-700"
                >
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                        Your Reply
                    </h3>
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows="5"
                        placeholder="Write your reply here..."
                        className="w-full p-3 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={isReplying}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition disabled:bg-indigo-400"
                    >
                        <Send size={16} />
                        {isReplying ? 'Posting...' : 'Post Reply'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default DiscussionThreadPage;
