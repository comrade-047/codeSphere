import React from "react";
import { Link } from "react-router-dom";

const ProblemRow = ({ problem, index }) => (
  <tr
    key={problem._id || index}
    className={`hover:bg-gray-50 transition ${
      problem.status === "Solved" ? "bg-green-50" : ""
    }`}
  >
    <td className="px-4 py-2 text-center">{index + 1}</td>
    <td className="px-4 py-2">
      <Link to={`/problems/${problem.slug}`} className="text-blue-600 hover:underline">
        {problem.title}
      </Link>
      {problem.locked && (
        <span className="ml-2 text-yellow-500">🔒</span>
      )}
    </td>
    <td className="px-4 py-2">
      {problem.acceptanceRate
        ? `${problem.acceptanceRate.toFixed(1)}%`
        : "N/A"}
    </td>
    <td className="px-4 py-2">
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium ${
          problem.difficulty === "Easy"
            ? "bg-green-100 text-green-800"
            : problem.difficulty === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {problem.difficulty}
      </span>
    </td>
    <td className="px-4 py-2">
      {problem.status === "Solved" ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
          ✅ Solved
        </span>
      ) : (
        <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
          Unsolved
        </span>
      )}
    </td>
  </tr>
);

export default ProblemRow;
