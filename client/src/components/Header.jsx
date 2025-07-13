import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          codeSphere
        </Link>

        <nav className="flex gap-4 items-center text-sm font-medium">
          <Link to="/contests" className="text-gray-700 hover:text-blue-600 transition-colors">
            Contests
          </Link>
          <Link to="/problems" className="text-gray-700 hover:text-blue-600 transition-colors">
            Problems
          </Link>
          <Link to="/discussions" className="text-gray-700 hover:text-blue-600 transition-colors">
            Discussions
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Free
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
