import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { Send, Loader2, ArrowLeft } from "lucide-react";

const DiscussionThreadPage = () => {
  const { threadId } = useParams();
  const { user } = useContext(UserContext);
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.DISCUSSIONS.GET_THREAD(threadId)
        );
        setThread(res.data.thread);
        setPosts(res.data.posts);
      } catch {
        setError("Failed to load discussion thread.");
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
      const res = await axiosInstance.post(
        API_PATHS.DISCUSSIONS.REPLY(threadId),
        {
          content: newPostContent,
        }
      );
      setPosts((prev) => [...prev, res.data]);
      setNewPostContent("");
    } finally {
      setIsReplying(false);
    }
  };

  const PostCard = ({ post, isOriginal }) => (
    <div
      className={`rounded-lg border p-5 mb-4 ${
        isOriginal
          ? "bg-gray-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800 border-gray-200 dark:border-zinc-700"
          : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
      }`}
    >
      {/* Author Row */}
      <div className="flex items-center gap-3">
        <img
          src={
            post.author?.profilePicUrl ||
            `https://avatar.vercel.sh/${encodeURIComponent(
              post.author?.username || "user"
            )}.svg`
          }
          alt={post.author?.username || "author"}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {post.author?.username || "Unknown"}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading thread...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link
        to="/discussions"
        className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
      >
        <ArrowLeft size={16} /> Back to Discussions
      </Link>

      {/* Thread Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {thread.title}
      </h1>

      {/* Original Post */}
      <PostCard
        post={{
          author: thread.author,
          createdAt: thread.createdAt,
          content: thread.content,
        }}
        isOriginal={true}
      />

      {/* Replies */}
      <h2 className="mt-10 mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        {posts.length} {posts.length === 1 ? "Reply" : "Replies"}
      </h2>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} isOriginal={false} />
      ))}

      {/* Reply Box */}
      {user && (
        <form
          onSubmit={handleReply}
          className="mt-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4"
        >
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="4"
            placeholder="Write your reply..."
            className="w-full bg-transparent text-gray-900 dark:text-white p-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={isReplying}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isReplying ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Posting...
                </>
              ) : (
                <>
                  <Send size={16} /> Reply
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DiscussionThreadPage;
