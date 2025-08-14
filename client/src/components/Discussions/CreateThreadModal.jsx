import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';

const CreateThreadModal = ({ problemId, onClose, onThreadCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const res = await axiosInstance.post(API_PATHS.DISCUSSIONS.CREATE_THREAD, {
        title,
        content,
        problemId
      });
      onThreadCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create thread.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Start New Discussion
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Share your thoughts or questions about this problem.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="E.g. Can someone explain the time complexity?"
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your question or solution details here..."
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 transition"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Post"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateThreadModal;