import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CreateDiscussionThreadPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await axiosInstance.post(API_PATHS.DISCUSSIONS.CREATE_THREAD, { title, content });
            navigate(`/discussions/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create discussion.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            {/* Back Link */}
            <Link
                to="/discussions"
                className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
                <ArrowLeft size={16} /> Back to Discussions
            </Link>

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Start a New Discussion
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    Share your question, idea, or start a conversation with the community.
                </p>
            </header>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
            >
                {/* Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={120}
                        className="w-full p-3 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        placeholder="Enter a clear, descriptive title"
                    />
                    <p className="mt-1 text-xs text-gray-500">{title.length}/120</p>
                </div>

                {/* Content */}
                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="10"
                        className="w-full p-3 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        placeholder="Write your post here... You can include details, examples, or code."
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-300 dark:border-red-700">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Link
                        to="/discussions"
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:bg-indigo-400"
                    >
                        {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
                        {isSubmitting ? 'Posting...' : 'Post Discussion'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDiscussionThreadPage;
