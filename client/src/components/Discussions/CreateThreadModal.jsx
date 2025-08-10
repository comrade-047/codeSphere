
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
      const res = await axiosInstance.post(API_PATHS.DISCUSSIONS.CREATE, {
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
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Start New Discussion
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded-md border dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 rounded-md border dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border dark:border-zinc-600 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold disabled:bg-indigo-400"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Post"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateThreadModal;