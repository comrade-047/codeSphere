import React from 'react';

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl p-5 space-y-4">
    <div className="h-6 bg-gray-300 dark:bg-zinc-700 w-2/3 rounded" />
    <div className="h-4 bg-gray-200 dark:bg-zinc-700 w-1/2 rounded" />
    <div className="h-4 bg-gray-200 dark:bg-zinc-700 w-1/3 rounded" />
    <div className="h-10 bg-indigo-300 dark:bg-indigo-600 rounded-lg mt-4" />
  </div>
);

export default SkeletonCard;
