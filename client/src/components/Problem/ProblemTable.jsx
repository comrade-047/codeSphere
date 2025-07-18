import React from "react";
import ProblemRow from "./ProblemRow";

const ProblemTable = ({ problems }) => (
  <div className="bg-white shadow border rounded overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-100 text-left sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3">#</th>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3">Acceptance</th>
          <th className="px-4 py-3">Difficulty</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {problems.map((problem, index) => (
          <ProblemRow key={problem._id || index} problem={problem} index={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProblemTable;
