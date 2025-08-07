import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';

const CreateProblemPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [tags, setTags] = useState('');
    const [testCases, setTestCases] = useState([{ input: '', output: '', hidden: false }]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-generate slug from title
    useEffect(() => {
        const generatedSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setSlug(generatedSlug);
    }, [title]);

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', output: '', hidden: false }]);
    };

    const removeTestCase = (index) => {
        const newTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const payload = {
            title,
            slug,
            description,
            difficulty,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            testCases,
        };

        try {
            await axiosInstance.post(API_PATHS.PROBLEM.CREATE, payload);
            setSuccess('Problem created successfully! Redirecting...');
            setTimeout(() => navigate('/problems'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create problem.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create New Problem</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Add a new challenge to the platform's problem set.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                        <input type="text" id="slug" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none" readOnly />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Markdown supported)</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="12" className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
                </div>

                {/* Difficulty and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
                        <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                {/* Test Cases */}
                <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Test Cases</h3>
                    <div className="space-y-4">
                        {testCases.map((tc, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900/50 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Input</label>
                                        <textarea value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} rows="4" className="w-full p-2 mt-1 rounded-md bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 font-mono text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Output</label>
                                        <textarea value={tc.output} onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)} rows="4" className="w-full p-2 mt-1 rounded-md bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 font-mono text-sm" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id={`hidden-${index}`} checked={tc.hidden} onChange={(e) => handleTestCaseChange(index, 'hidden', e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                        <label htmlFor={`hidden-${index}`} className="text-sm text-gray-600 dark:text-gray-300">Hidden Test Case</label>
                                    </div>
                                    {testCases.length > 1 && (
                                        <button type="button" onClick={() => removeTestCase(index)} className="text-red-500 hover:text-red-700 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addTestCase} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        <PlusCircle size={16} /> Add Test Case
                    </button>
                </div>

                {/* Submission Button and Messages */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-zinc-700">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-500">{success}</p>}
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Creating...' : 'Create Problem'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProblemPage;