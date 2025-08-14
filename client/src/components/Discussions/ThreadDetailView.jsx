import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import { ArrowLeft, Send } from 'lucide-react';
import { API_PATHS } from '../../utils/apiPaths';

const ThreadDetailView = ({ threadId, onBack }) => {
  const { user } = useContext(UserContext);
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(API_PATHS.DISCUSSIONS.GET_THREAD(threadId));
        setThread(res.data.thread);
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Failed to load thread details", err);
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
      const res = await axiosInstance.post(API_PATHS.DISCUSSIONS.REPLY(threadId),
        { content: newPostContent }
      );
      setPosts([...posts, res.data]);
      setNewPostContent("");
    } catch {
      alert("Failed to post reply.");
    } finally {
      setIsReplying(false);
    }
  };

  const PostCard = ({ post, isOriginalPost = false }) => (
    <div
      className={`p-4 flex gap-4 transition-colors ${
        !isOriginalPost
          ? 'border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
          : 'bg-gray-50 dark:bg-zinc-800 rounded-t-lg'
      }`}
    >
      <img
        src={post.author.profilePicUrl || `https://avatar.vercel.sh/${post.author.username}.svg`}
        alt={post.author.username}
        className="w-10 h-10 rounded-full border border-gray-300 dark:border-zinc-600"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
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
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading Thread...</div>;
  if (!thread)
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Thread not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 mb-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold "
      >
        <ArrowLeft size={16} /> Back to Discussions
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{thread.title}</h2>

      <div className="border dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
        <PostCard
          post={{
            ...thread,
            author: thread.author,
            createdAt: thread.createdAt,
            content: thread.content
          }}
          isOriginalPost={true}
        />
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 italic">
            No replies yet. Be the first to reply!
          </div>
        )}
      </div>

      {user && (
        <form
          onSubmit={handleReply}
          className="mt-6 p-4 border dark:border-zinc-700 rounded-lg shadow-sm bg-gray-50 dark:bg-zinc-800"
        >
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="4"
            placeholder="Write a reply..."
            className="w-full p-3 rounded-md bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={isReplying}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md disabled:bg-indigo-400 transition-colors"
          >
            <Send size={14} /> {isReplying ? "Posting..." : "Post Reply"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ThreadDetailView;