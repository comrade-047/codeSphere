import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import UserIconDropdown from './Dropdown'; // Import the UserIconDropdown component

const Header = () => {
  const { user, clearUser } = useContext(UserContext); // Accessing user context

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight"
        >
          codeSphere
        </Link>

        <nav className="flex gap-4 items-center text-sm font-medium">
          <Link
            to="/contests"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contests
          </Link>
          <Link
            to="/problems"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Problems
          </Link>
          <Link
            to="/discussions"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Discussions
          </Link>

          {user ? (
            <>
              <ModeToggle />
              <UserIconDropdown clearUser={clearUser} user={user} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Try Free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
