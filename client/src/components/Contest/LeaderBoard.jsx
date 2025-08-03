import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ contestSlug }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosInstance.get(`/contests/${contestSlug}/leaderboard`);
                setLeaderboard(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [contestSlug]);

    const rankColor = (rank) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-orange-400';
        return 'text-gray-500';
    };

    if (loading) return <div className="text-center p-4">Loading Leaderboard...</div>;

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-700 dark:text-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Rank</th>
                        <th scope="col" className="px-6 py-3">User</th>
                        <th scope="col" className="px-6 py-3">Score</th>
                        <th scope="col" className="px-6 py-3">Penalty</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry, index) => (
                        <tr key={entry.username} className="bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                            <td className={`px-6 py-4 font-bold text-lg ${rankColor(index + 1)}`}>
                                <div className="flex items-center gap-2">
                                    {index < 3 && <Trophy size={18} />}
                                    {index + 1}
                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {entry.username}
                            </th>
                            <td className="px-6 py-4 font-semibold">{entry.score}</td>
                            <td className="px-6 py-4">{entry.penalty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;