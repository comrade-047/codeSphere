import React from "react";
import { Link } from "react-router-dom";

const ProblemRow = ({ problem, index }) => {
  const isSolved = problem.status === "Solved";

  return (
    <tr
      key={problem._id || index}
      className={`transition-colors ${
        isSolved
          ? "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30"
          : "hover:bg-gray-50 dark:hover:bg-zinc-700"
      }`}
    >
      <td className="px-4 py-2 text-center text-gray-800 dark:text-gray-100">{index + 1}</td>

      <td className="px-4 py-2">
        <Link
          to={`/problems/${problem.slug}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {problem.title}
        </Link>
        {problem.locked && (
          <span className="ml-2 text-yellow-500">🔒</span>
        )}
      </td>

      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
        {problem.acceptanceRate ? `${problem.acceptanceRate.toFixed(1)}%` : "N/A"}
      </td>

      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            problem.difficulty === "Easy"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : problem.difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {problem.difficulty}
        </span>
      </td>

      <td className="px-4 py-2">
        {isSolved ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs rounded-full font-medium">
            Solved
          </span>
        ) : (
          <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-300 text-xs rounded-full font-medium">
            Unsolved
          </span>
        )}
      </td>
    </tr>
  );
};

export default ProblemRow;
