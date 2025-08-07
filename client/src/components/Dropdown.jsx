import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react'; 

const UserIconDropdown = ({ clearUser, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    clearUser();
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleDropdownToggle}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-400 transition-colors focus:outline-none"
      >
        {user?.profilePicUrl ? (
          <img
            src={user.profilePicUrl}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li>
              <Link
                to={`/${user.username}`}
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
            </li>
            
            {user.role === 'admin' && (
              <>
                <div className="border-t border-gray-200 dark:border-zinc-700 my-1"></div>
                <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Admin Panel</div>
                <li>
                  <Link
                    to="/admin/create-contest"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShieldCheck size={16} /> Create Contest
                  </Link>
                  <Link
                    to="/admin/create-problem"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShieldCheck size={16} /> Create Problem
                  </Link>
                </li>
              </>
            )}

            <div className="border-t border-gray-200 dark:border-zinc-700 my-1"></div>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserIconDropdown;
