import { Link } from "react-router-dom";

export const AttemptedList = ({ attempted }) => (
  <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 shadow rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
      Attempted Problems
    </h3>
    {!attempted.length ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">No problems attempted yet.</p>
    ) : (
      <ul className="divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
        {attempted.map(p => (
          <li key={p.slug} className="py-2 px-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition">
            <Link to={`/problems/${p.slug}`} className="text-blue-600 dark:text-blue-400  font-medium">
              {p.title}
            </Link>
            {" — "}
            <span className="italic text-gray-500 dark:text-gray-400">{p.status}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
