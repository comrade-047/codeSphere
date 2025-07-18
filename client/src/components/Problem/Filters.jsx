import React from "react";

const Filters = ({
  difficultyFilter,
  setDifficultyFilter,
  statusFilter,
  setStatusFilter,
  toggleDifficultyFilter,
  toggleStatusFilter,
}) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">
      Filters{" "}
      {(difficultyFilter.length + statusFilter.length > 0) && (
        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
          {difficultyFilter.length + statusFilter.length} active
        </span>
      )}
    </h2>

    {/* Difficulty */}
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">Difficulty</h3>
      <div className="space-y-1 text-sm text-gray-700">
        {["Easy", "Medium", "Hard"].map((level) => (
          <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" key={level}>
            <input
              type="checkbox"
              className={`accent-${level === "Easy" ? "green" : level === "Medium" ? "yellow" : "red"}-500`}
              checked={difficultyFilter.includes(level)}
              onChange={() => toggleDifficultyFilter(level)}
            />
            {level}
          </label>
        ))}
      </div>
    </div>

    {/* Status */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
      <div className="space-y-1 text-sm text-gray-700">
        {["Solved", "Unsolved"].map((status) => (
          <label
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
            key={status}
          >
            <input
              type="checkbox"
              className="accent-blue-500"
              checked={statusFilter.includes(status)}
              onChange={() => toggleStatusFilter(status)}
            />
            {status}
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default Filters;
