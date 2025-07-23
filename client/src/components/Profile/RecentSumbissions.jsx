const verdictBadge = verdict => {
  const map = {
    Accepted: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    "Wrong Answer": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    "Time Limit Exceeded": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    CompilationError: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300",
  };
  return map[verdict] || map["CompilationError"];
};


const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function formatRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const secs = Math.round(diff / 1000);
  const mins = Math.round(secs / 60);
  const hrs = Math.round(mins / 60);
  const days = Math.round(hrs / 24);
  if (days) return rtf.format(-days, "day");
  if (hrs) return rtf.format(-hrs, "hour");
  if (mins) return rtf.format(-mins, "minute");
  return rtf.format(-secs, "second");
}









export const RecentSubmissions = ({ submissions }) => (
  <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 shadow rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
      Recent Submissions
    </h3>
    {!submissions.length ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">No submissions yet.</p>
    ) : (
      <ul className="divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
        {submissions.slice(0, 5).map(s => (
          <li key={s._id} className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex-grow">
                <strong className="text-blue-600 dark:text-blue-400">{s.problem.title}</strong>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${verdictBadge(s.verdict)}`}>
                  {s.verdict}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 sm:ml-auto">
                {formatRelativeTime(new Date(s.createdAt))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
