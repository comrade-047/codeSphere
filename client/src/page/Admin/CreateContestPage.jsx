import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Search } from 'lucide-react';

const CreateContestPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [allProblems, setAllProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                // Assuming the backend can filter problems suitable for contests
                const res = await axiosInstance.get(`${API_PATHS.PROBLEM.ALLPROBLEMS}?contest=true`);
                setAllProblems(res.data.problems);
            } catch (err) {
                setError('Failed to fetch problems list.');
            }
        };
        fetchProblems();
    }, []);

    useEffect(() => {
        const generatedSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setSlug(generatedSlug);
    }, [title]);

    const handleAddProblem = (problem) => {
        if (!selectedProblems.some(p => p.problem._id === problem._id)) {
            setSelectedProblems([...selectedProblems, { problem, points: 100 }]);
        }
    };

    const handleRemoveProblem = (problemId) => {
        setSelectedProblems(selectedProblems.filter(p => p.problem._id !== problemId));
    };

    const handlePointsChange = (problemId, points) => {
        setSelectedProblems(selectedProblems.map(p =>
            p.problem._id === problemId ? { ...p, points: parseInt(points, 10) || 0 } : p
        ));
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
            startTime,
            endTime,
            problems: selectedProblems.map(p => ({ problem: p.problem._id, points: p.points })),
        };

        try {
            await axiosInstance.post(API_PATHS.CONTESTS.CREATE, payload);
            setSuccess('Contest created successfully! Redirecting...');
            setTimeout(() => navigate('/contests'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create contest.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProblems = allProblems.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create New Contest</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Assemble problems and set the stage for the next competition.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg">
                {/* Contest Info */}
                <div className="border-b border-gray-200 dark:border-zinc-700 pb-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Contest Details</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contest Title</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                                <input type="text" id="slug" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none" readOnly />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                <input type="datetime-local" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600" />
                            </div>
                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                <input type="datetime-local" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problem Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Select Problems</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Available Problems */}
                        <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available Problems</h3>
                            {allProblems.length === 0 && !error ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                                    <p className="mb-4">No problems found. You must create a problem before it can be added to a contest.</p>
                                    <button
                                        type='button'
                                        onClick={() => navigate('/admin/create-problem')}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition"
                                    >
                                        <Plus size={18} /> Create a Problem
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative mb-4">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Search problems..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 rounded-md bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600" />
                                    </div>
                                    <ul className="flex-grow h-64 overflow-y-auto space-y-2 pr-2">
                                        {filteredProblems.map(problem => (
                                            <li key={problem._id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-zinc-900/50 rounded-md">
                                                <span className="text-sm font-medium">{problem.title}</span>
                                                <button type="button" onClick={() => handleAddProblem(problem)} className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50">
                                                    <Plus size={20} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Selected Problems */}
                        <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Selected Problems ({selectedProblems.length})</h3>
                            <ul className="flex-grow h-64 overflow-y-auto space-y-2 pr-2">
                                {selectedProblems.length > 0 ? selectedProblems.map(({ problem, points }) => (
                                    <li key={problem._id} className="p-2 bg-gray-100 dark:bg-zinc-900/50 rounded-md flex items-center justify-between gap-4">
                                        <span className="text-sm font-medium flex-grow">{problem.title}</span>
                                        <input type="number" value={points} onChange={(e) => handlePointsChange(problem._id, e.target.value)} className="w-20 p-1 rounded-md bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-sm" />
                                        <button type="button" onClick={() => handleRemoveProblem(problem._id)} className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                )) : (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-gray-400">
                                        Problems you add will appear here.
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-zinc-700">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-500">{success}</p>}
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Creating Contest...' : 'Create Contest'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateContestPage;