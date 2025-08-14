import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { ArrowLeft, Info, Loader2, Save, Trash2 } from 'lucide-react';

const TITLE_MAX = 120;
const DRAFT_KEY = 'discussion:new-thread-draft:v1';

const CreateDiscussionThreadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);
  const [touched, setTouched] = useState({ title: false, content: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft?.title || draft?.content) {
          setTitle(draft.title || '');
          setContent(draft.content || '');
          setRestored(true);
          setTimeout(() => setRestored(false), 3000);
        }
      }
    } catch {
      // ignore parse issues
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, content, ts: Date.now() })
      );
    }, 350);
    return () => clearTimeout(id);
  }, [title, content]);

  const titleProgress = useMemo(() => {
    const pct = Math.min(100, Math.round((title.length / TITLE_MAX) * 100));
    return isNaN(pct) ? 0 : pct;
  }, [title]);

  const contentStats = useMemo(() => {
    const chars = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    return { chars, words };
  }, [content]);

  const titleError =
    touched.title && !title.trim()
      ? 'A clear title helps others find your discussion.'
      : title.length > TITLE_MAX
      ? `Title must be ${TITLE_MAX} characters or fewer.`
      : null;

  const contentError =
    touched.content && !content.trim()
      ? 'Content is required.'
      : null;

  const isFormValid = title.trim().length > 0 && content.trim().length > 0 && title.length <= TITLE_MAX;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, content: true });
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await axiosInstance.post(API_PATHS.DISCUSSIONS.CREATE_THREAD, { title, content });
      // Clear draft on success
      localStorage.removeItem(DRAFT_KEY);
      navigate(`/discussions/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create discussion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    const ok = window.confirm('Clear the current draft? This cannot be undone.');
    if (!ok) return;
    setTitle('');
    setContent('');
    localStorage.removeItem(DRAFT_KEY);
  };

  useEffect(() => {
    const onKey = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key === 'Enter') {
        // simulate submit
        const form = document.getElementById('create-thread-form');
        if (form && !isSubmitting) {
          form.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSubmitting]);

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
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
          Start a New Discussion
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Share your question, idea, or start a conversation with the community.
        </p>

        <div className="mt-4 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-md p-3">
          <Info size={14} className="shrink-0 mt-[2px]" />
          <div>
            <p className="font-medium">Tips for a great post</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Use a descriptive title (what, where, error message, etc.).</li>
              <li>Provide enough context, steps, and what you’ve tried.</li>
              <li>Use code blocks or lists for clarity (Markdown supported later).</li>
            </ul>
          </div>
        </div>
      </header>

      {/* Draft restored toast */}
      {restored && (
        <div className="mb-3 rounded-md border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm">
          Draft restored from last session.
        </div>
      )}

      {/* Form */}
      <form
        id="create-thread-form"
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700"
      >
        {/* Title */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <span className="text-xs text-gray-500">
              {title.length}/{TITLE_MAX}
            </span>
          </div>

          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            required
            maxLength={TITLE_MAX + 1} // hard stop, but we validate at 120
            className={`w-full p-3 rounded-md bg-gray-50 dark:bg-zinc-700 border focus:outline-none focus:ring-2 text-gray-900 dark:text-white
              ${titleError ? 'border-red-400 dark:border-red-600 focus:ring-red-400' : 'border-gray-300 dark:border-zinc-600 focus:ring-indigo-500'}
            `}
            placeholder="e.g. Getting a 401 on POST /api/auth — what am I missing?"
            aria-invalid={!!titleError}
            aria-describedby={titleError ? 'title-error' : undefined}
          />

          {/* Progress bar */}
          <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-zinc-700 rounded">
            <div
              className={`h-1 rounded ${titleProgress > 90 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${titleProgress}%` }}
            />
          </div>

          {titleError && (
            <p id="title-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {titleError}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content
            </label>
            <span className="text-xs text-gray-500">
              {contentStats.words} words • {contentStats.chars} chars
            </span>
          </div>

          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, content: true }))}
            required
            rows="10"
            className={`w-full p-3 rounded-md bg-gray-50 dark:bg-zinc-700 border focus:outline-none focus:ring-2 text-gray-900 dark:text-white leading-relaxed
              ${contentError ? 'border-red-400 dark:border-red-600 focus:ring-red-400' : 'border-gray-300 dark:border-zinc-600 focus:ring-indigo-500'}
            `}
            placeholder={`Write your post here...
• Describe the problem
• Share relevant code/error
• What you expected vs. what happened
• What you've tried so far
`}
            aria-invalid={!!contentError}
            aria-describedby={contentError ? 'content-error' : undefined}
          />
          {contentError && (
            <p id="content-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {contentError}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-300 dark:border-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700">
              ⌘/Ctrl
            </kbd>
            +
            <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700">
              Enter
            </kbd>
            to post
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, ts: Date.now() }));
                } catch {
                    // 
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition text-sm"
              title="Save draft locally"
            >
              <Save size={16} /> Save draft
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm"
            >
              <Trash2 size={16} /> Clear
            </button>

            <Link
              to="/discussions"
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition text-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:bg-indigo-400 text-sm"
            >
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
              {isSubmitting ? 'Posting...' : 'Post Discussion'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscussionThreadPage;
