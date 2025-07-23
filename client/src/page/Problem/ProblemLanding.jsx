import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { fetchProblems } from "../../utils/helper.js"; 
import Filters from "../../components/Problem/Filters";
import ProblemTable from "../../components/Problem/ProblemTable";
import LoadingSpinner from "../../components/LoadingSpinner";

const ProblemListPage = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);

  const { user } = useContext(UserContext);

  const toggleFilter = (value, setFilter, current) => {
    if (current.includes(value)) {
      setFilter(current.filter((v) => v !== value));
    } else {
      setFilter([...current, value]);
    }
  };

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const res = await fetchProblems({ cursor, limit: 50 });
        let updatedProblems = res.problems;

        if (user && user.problemsSolved) {
          updatedProblems = updatedProblems.map((p) => ({
            ...p,
            status: user.problemsSolved.includes(p._id) ? "Solved" : "Unsolved",
          }));
        }

        setProblems(updatedProblems);
        setCursor(res.nextCursor);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, [user?.problemsSolved, user]);

  useEffect(() => {
    let filtered = [...problems];

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (difficultyFilter.length > 0) {
      filtered = filtered.filter((p) =>
        difficultyFilter.includes(p.difficulty)
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((p) =>
        statusFilter.includes(p.status || "Unsolved")
      );
    }

    setFilteredProblems(filtered);
  }, [searchQuery, difficultyFilter, statusFilter, problems]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 px-4 py-6 sticky top-0 h-screen overflow-y-auto">
        <Filters
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          toggleDifficultyFilter={(level) =>
            toggleFilter(level, setDifficultyFilter, difficultyFilter)
          }
          toggleStatusFilter={(status) =>
            toggleFilter(status, setStatusFilter, statusFilter)
          }
          user={user}
        />
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 py-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Problems</h1>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 rounded-md w-1/3 text-sm outline-none shadow-sm transition-colors"
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredProblems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No problems match your filters.</p>
        ) : (
          <ProblemTable problems={filteredProblems} />
        )}
      </main>
    </div>
  );
};

export default ProblemListPage;
