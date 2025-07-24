import React from 'react';
import {  CheckCircle, XCircle, Timer } from 'lucide-react';

const MySubmissions = ({ submissions, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
        <p className="italic text-sm text-center">
          You need to <a href="/login" className="text-blue-500 hover:underline">log in</a> to view your submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-zinc-800  border-gray-300 dark:border-zinc-700 p-6 text-gray-800 dark:text-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">📄 My Submissions</h2>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">You haven’t made any submissions yet.</p>
      ) : (
        <table className="min-w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-zinc-700 text-left text-xs text-gray-600 dark:text-gray-300">
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Language</th>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-zinc-700">
                <td className="py-2 px-3 flex items-center gap-1">
                  {sub.status === 'Accepted' ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : sub.status === 'Wrong Answer' ? (
                    <XCircle size={14} className="text-red-500" />
                  ) : (
                    <Timer size={14} className="text-yellow-500" />
                  )}
                  {sub.status}
                </td>
                <td className="py-2 px-3">{sub.language}</td>
                <td className="py-2 px-3">{sub.executionTime} ms</td>
                <td className="py-2 px-3">{new Date(sub.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySubmissions;
