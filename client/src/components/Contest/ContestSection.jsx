import React from 'react';
import ContestCard from './ContestCard';

const ContestSection = ({ title, icon, contests }) => {
  if (!contests.length) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>
    </section>
  );
};

export default ContestSection;
