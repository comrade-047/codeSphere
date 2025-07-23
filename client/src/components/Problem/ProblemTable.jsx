import React from "react";
import ProblemRow from "./ProblemRow";

const ProblemTable = ({ problems }) => (
  <div className="bg-white dark:bg-zinc-800 shadow border border-gray-200 dark:border-zinc-700 rounded overflow-x-auto transition-colors">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
      <thead className="bg-gray-100 dark:bg-zinc-700 text-left sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 text-gray-700 dark:text-gray-300">#</th>
          <th className="px-4 py-3 text-gray-700 dark:text-gray-300">Title</th>
          <th className="px-4 py-3 text-gray-700 dark:text-gray-300">Acceptance</th>
          <th className="px-4 py-3 text-gray-700 dark:text-gray-300">Difficulty</th>
          <th className="px-4 py-3 text-gray-700 dark:text-gray-300">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
        {problems.map((problem, index) => (
          <ProblemRow key={problem._id || index} problem={problem} index={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProblemTable;
