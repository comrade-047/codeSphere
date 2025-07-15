import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react'; // User icon from lucide-react

const UserIconDropdown = ({ clearUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    clearUser(); // Call clearUser function to log out
    setDropdownOpen(false); // Close the dropdown after logout
  };

  return (
    <div className="relative">
      {/* User icon button */}
      <button
        onClick={handleDropdownToggle}
        className="text-gray-700 hover:text-blue-600 transition-colors"
      >
        <User className="w-6 h-6" />
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul>
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)} // Close dropdown on profile click
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
