import React from 'react';
import { Flame, Tag, GaugeCircle, BarChart3, CircleCheck } from 'lucide-react';

const ProblemDescription = ({ problem }) => (
  <div className="h-full overflow-y-auto bg-white dark:bg-zinc-800  border-gray-300 dark:border-zinc-700 p-6 text-gray-800 dark:text-gray-100 rounded-lg">
    <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>

    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
      <span
        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded text-white ${
          problem.difficulty === 'Easy'
            ? 'bg-green-500'
            : problem.difficulty === 'Medium'
            ? 'bg-yellow-500'
            : 'bg-red-500'
        }`}
      >
        <Flame size={14} />
        {problem.difficulty}
      </span>

      <div className="flex items-center gap-1">
        <GaugeCircle size={14} />
        <span>{problem.acceptanceRate.toFixed(2)}%</span>
      </div>
      <div className="flex items-center gap-1">
        <BarChart3 size={14} />
        <span>{problem.submissions}</span>
      </div>
      <div className="flex items-center gap-1">
        <CircleCheck size={14} />
        <span>{problem.successfulSubmissions}</span>
      </div>
    </div>

    {problem.tags?.length > 0 && (
      <div className="mt-2 mb-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">Tags:</h2>
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-100 px-2 py-1 text-xs rounded"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}

    <p className="mt-4 text-gray-800 dark:text-gray-100 whitespace-pre-line">{problem.description}</p>

    {problem.inputFormat && (
      <div className="mt-4 text-sm">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Input Format:</h2>
        <p className="text-gray-700 dark:text-gray-300">{problem.inputFormat}</p>
      </div>
    )}
    {problem.outputFormat && (
      <div className="mt-2 text-sm">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Output Format:</h2>
        <p className="text-gray-700 dark:text-gray-300">{problem.outputFormat}</p>
      </div>
    )}

    {problem.examples?.map((ex, i) => (
      <div
        key={i}
        className="mt-4 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 p-3 rounded"
      >
        <p className="font-semibold text-gray-800 dark:text-gray-100">Example {i + 1}</p>
        <pre className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
          Input: {ex.input}
          {'\n'}Output: {ex.output}
          {ex.explaination ? `\nExplanation: ${ex.explaination}` : ''}
        </pre>
      </div>
    ))}
  </div>
);

export default ProblemDescription;
