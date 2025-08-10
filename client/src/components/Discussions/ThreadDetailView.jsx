
import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import { ArrowLeft, Send } from 'lucide-react';

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
        const res = await axiosInstance.get(`/api/discussions/${threadId}`);
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
      const res = await axiosInstance.post(
        `/api/discussions/${threadId}/posts`,
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
    <div className={`p-4 flex gap-4 ${!isOriginalPost && 'border-t border-gray-200 dark:border-zinc-700'}`}>
        <img src={post.author.profilePicUrl || `https://avatar.vercel.sh/${post.author.username}.svg`} alt={post.author.username} className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-800 dark:text-white">{post.author.username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="prose prose-sm dark:prose-invert mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</div>
        </div>
    </div>
  );

  if (loading) return <div className="p-6 text-center">Loading Thread...</div>;
  if (!thread) return <div className="p-6 text-center">Thread not found.</div>;

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 mb-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
      >
        <ArrowLeft size={16} /> Back to Discussions
      </button>

      <h2 className="text-xl font-bold mb-4">{thread.title}</h2>
      
      <div className="border dark:border-zinc-700 rounded-lg">
          <PostCard post={{...thread, author: thread.author, createdAt: thread.createdAt, content: thread.content}} isOriginalPost={true} />
          {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>

      {user && (
        <form onSubmit={handleReply} className="mt-6">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="4"
            placeholder="Write a reply..."
            className="w-full p-2 rounded-md bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600"
          />
          <button
            type="submit"
            disabled={isReplying}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-md disabled:bg-indigo-400"
          >
            <Send size={14} /> {isReplying ? "Posting..." : "Post Reply"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ThreadDetailView;